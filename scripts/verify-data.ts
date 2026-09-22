import assert from "node:assert/strict";

import { executeTool } from "../src/lib/ai/tools";
import { getBudgetRows } from "../src/lib/data/budgets";
import { getDashboardData } from "../src/lib/data/dashboard";
import { clearAllUserData, seedSampleData } from "../src/lib/data/seed";
import { prisma } from "../src/lib/prisma";
import { getReportsData } from "../src/lib/reports-data";
import { getTransactions } from "../src/lib/transactions/get-transactions";

const USER = "user_verify_1";
const OTHER = "user_verify_2";

async function main() {
    await clearAllUserData(USER);
    await clearAllUserData(OTHER);

    const seeded = await seedSampleData(USER, "INR");
    assert.equal(seeded.seeded, true);
    console.log("seeded transactions:", (seeded as { transactions: number }).transactions);

    // seeding twice must be refused
    const again = await seedSampleData(USER, "INR");
    assert.equal(again.seeded, false);

    // another user's data must never leak
    await seedSampleData(OTHER, "USD");

    const data = await getDashboardData(USER);

    // --- invariant: dashboard month totals == raw SQL
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const raw = await prisma.$queryRaw<{ type: string; total: number }[]>`
        SELECT type::text, SUM(amount)::float AS total FROM "Transaction"
        WHERE "clerkUserId" = ${USER} AND date >= ${from} AND date < ${to} GROUP BY type`;
    const rawIncome = raw.find((r) => r.type === "income")?.total ?? 0;
    const rawExpense = raw.find((r) => r.type === "expense")?.total ?? 0;
    assert.equal(Math.round(data.month.income), Math.round(rawIncome), "month income mismatch");
    assert.equal(Math.round(data.month.expenses), Math.round(rawExpense), "month expenses mismatch");

    // --- invariant: all-time balance
    const all = await prisma.$queryRaw<{ bal: number }[]>`
        SELECT SUM(CASE WHEN type='income' THEN amount ELSE -amount END)::float AS bal
        FROM "Transaction" WHERE "clerkUserId" = ${USER}`;
    assert.equal(Math.round(data.balance), Math.round(all[0].bal), "balance mismatch");

    // --- cashflow: 6 buckets, sums to raw 6 month total
    assert.equal(data.cashflow.length, 6);
    const sixMonthExpense = data.cashflow.reduce((t, p) => t + p.expenses, 0);
    const rawSix = await prisma.$queryRaw<{ t: number }[]>`
        SELECT SUM(amount)::float AS t FROM "Transaction"
        WHERE "clerkUserId" = ${USER} AND type='expense' AND date >= ${new Date(now.getFullYear(), now.getMonth() - 5, 1)} AND date < ${to}`;
    assert.equal(Math.round(sixMonthExpense), Math.round(rawSix[0].t), "cashflow expense sum mismatch");

    // --- categories percentages ~100
    const pct = data.spendingCategories.reduce((t, c) => t + c.percentage, 0);
    assert.ok(pct >= 97 && pct <= 103, `category pct sums to ${pct}`);

    // --- budgets agree with getBudgetRows (independent code path)
    const rows = await getBudgetRows(USER, { month: now.getMonth() + 1, year: now.getFullYear() });
    assert.equal(rows.length, data.budgets.length);
    for (const b of data.budgets) {
        const r = rows.find((x) => x.categoryId === b.categoryId)!;
        assert.equal(Math.round(r.spent), Math.round(b.spent), `budget spent mismatch for ${b.category}`);
    }

    // --- subscriptions
    const names = data.subscriptions.items.map((s) => s.name);
    console.log("subscriptions:", data.subscriptions.items.map((s) => `${s.name} ${s.amount}/${s.cadence}`));
    for (const expected of ["Netflix", "Spotify", "Gym membership", "Airtel Fiber"]) {
        assert.ok(names.includes(expected), `missing subscription ${expected}`);
    }
    assert.ok(!names.includes("Salary"), "income must not be a subscription");
    assert.ok(!names.includes("Swiggy"), "irregular merchants must not be subscriptions");

    // --- forecast / health sanity
    assert.ok(data.forecast.projectedExpenses >= data.month.expenses);
    assert.ok(data.health.score >= 0 && data.health.score <= 100);
    assert.equal(data.health.factors.reduce((t, f) => t + f.max, 0), 100);
    assert.equal(data.goals.length, 2);
    assert.ok(data.goals[0].monthlyNeeded !== null);
    assert.ok(data.spendingPace.length >= 28);

    // --- user isolation
    const other = await getDashboardData(OTHER);
    assert.equal(other.currency, "INR"); // no preference row => default
    const leak = await prisma.transaction.count({ where: { clerkUserId: USER, category: { clerkUserId: OTHER } } });
    assert.equal(leak, 0);

    // --- transactions filters / sort / pagination
    const page1 = await getTransactions({ clerkUserId: USER, pageSize: 10, sort: "amount", dir: "desc" });
    assert.equal(page1.transactions.length, 10);
    assert.ok(page1.transactions[0].amount >= page1.transactions[9].amount);
    const inc = await getTransactions({ clerkUserId: USER, type: "income", pageSize: 50 });
    assert.ok(inc.transactions.every((t) => t.type === "income"));
    const ranged = await getTransactions({ clerkUserId: USER, from: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`, to: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-05`, pageSize: 50 });
    assert.ok(ranged.transactions.every((t) => t.date.getDate() <= 5), "date range filter leaked");
    const searched = await getTransactions({ clerkUserId: USER, search: "netflix" });
    assert.ok(searched.totalCount >= 5 && searched.transactions.every((t) => /netflix/i.test(t.description)));
    // injection-ish search must be handled as a literal
    const weird = await getTransactions({ clerkUserId: USER, search: "'; DROP TABLE \"Transaction\"; --" });
    assert.equal(weird.totalCount, 0);

    // --- reports trend covers last partial month (regression for the old bug)
    const custom = await getReportsData(USER, {
        from: new Date(now.getFullYear(), now.getMonth() - 2, 10),
        to: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
    });
    assert.equal(custom.financialTrend.length, 3, "trend should include 3 months for a range spanning 3 months");
    const lastMonthPoint = custom.financialTrend[2];
    assert.ok(lastMonthPoint.expenses > 0, "current partial month must be in the trend");

    // --- AI tools (server-trusted userId)
    const ctx = { userId: USER, today: now.toISOString().slice(0, 10) };
    const s = (await executeTool("search_transactions", { query: "netflix", limit: 3 }, ctx)).output as any;
    assert.equal(s.showing, 3);
    assert.ok(s.totalMatches >= 5);
    const sum = (await executeTool("spending_summary", { from: "2000-01-01", to: "2100-01-01", group_by: "category" }, ctx)).output as any;
    assert.ok(sum.groups[0].total >= sum.groups[1].total);
    const bs = (await executeTool("budget_status", {}, ctx)).output as any;
    assert.equal(bs.budgets.length, 5);
    const draft = await executeTool("draft_transaction", { description: "Lunch", amount: 250, type: "expense", category: "dining" }, ctx);
    assert.equal((draft.event as any).draft.category, "Dining", "draft must map to the existing category case-insensitively");
    assert.equal((draft.event as any).draft.isNewCategory, false);
    const badArgs = (await executeTool("search_transactions", { limit: 9999 }, ctx)).output as any;
    assert.equal(badArgs.error, "Invalid arguments");
    const unknown = (await executeTool("delete_everything", {}, ctx)).output as any;
    assert.ok(unknown.error);
    // a tool call can never see another user's rows
    const isolated = (await executeTool("search_transactions", { limit: 25 }, { userId: "user_nobody", today: ctx.today })).output as any;
    assert.equal(isolated.totalMatches, 0);

    console.log("health:", data.health.score, data.health.label);
    console.log("forecast:", JSON.stringify(data.forecast));
    console.log("heuristic insights:", data.heuristicInsights.map((i) => i.title));
    console.log("\nALL DATA-LAYER CHECKS PASSED");
}

main()
    .catch((error) => {
        console.error("FAILED:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await clearAllUserData(USER);
        await clearAllUserData(OTHER);
        await prisma.$disconnect();
    });
