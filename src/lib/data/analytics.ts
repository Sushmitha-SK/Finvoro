/**
 * Pure analytics helpers - no database or framework imports, so everything in
 * here can be unit-tested with plain arrays.
 */
import {
    daysInMonth,
    monthKey,
    monthLabel,
    startOfMonth,
    toDateInput,
} from "@/lib/dates";
import { formatCurrency } from "@/lib/format-currency";
import type {
    BudgetProgress,
    CashflowPoint,
    Forecast,
    HealthScore,
    Insight,
    SpendingCategory,
    SpendingPacePoint,
    Subscription,
} from "@/types/finance";

export type TxnLite = {
    id?: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    date: Date;
    categoryId: string;
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

export const percentChange = (current: number, previous: number) =>
    previous === 0 ? null : ((current - previous) / previous) * 100;

/* -------------------------------------------------------------------------- */
/*  Cash-flow                                                                  */
/* -------------------------------------------------------------------------- */

export function buildCashflow(txns: TxnLite[], months: Date[]): CashflowPoint[] {
    const buckets = new Map<string, CashflowPoint>(
        months.map((month) => [
            monthKey(month),
            {
                key: monthKey(month),
                label: monthLabel(month),
                income: 0,
                expenses: 0,
                net: 0,
                savingsRate: 0,
            },
        ]),
    );

    for (const txn of txns) {
        const bucket = buckets.get(monthKey(txn.date));

        if (!bucket) continue;

        if (txn.type === "income") bucket.income += txn.amount;
        else bucket.expenses += txn.amount;
    }

    return Array.from(buckets.values()).map((point) => ({
        ...point,
        net: point.income - point.expenses,
        savingsRate:
            point.income > 0
                ? Math.round(((point.income - point.expenses) / point.income) * 100)
                : 0,
    }));
}

/**
 * Cumulative expense per day of a month. `upToDay` truncates the series
 * (used for the current, still-running month).
 */
export function cumulativeDailyExpenses(
    txns: TxnLite[],
    monthStart: Date,
    upToDay?: number,
): number[] {
    const total = daysInMonth(monthStart);
    const perDay = new Array<number>(total).fill(0);
    const key = monthKey(monthStart);

    for (const txn of txns) {
        if (txn.type !== "expense" || monthKey(txn.date) !== key) continue;

        perDay[txn.date.getDate() - 1] += txn.amount;
    }

    const limit = upToDay ? Math.min(upToDay, total) : total;
    const result: number[] = [];
    let running = 0;

    for (let day = 0; day < limit; day += 1) {
        running += perDay[day];
        result.push(running);
    }

    return result;
}

export function buildSpendingPace(
    txns: TxnLite[],
    now: Date,
): SpendingPacePoint[] {
    const monthStart = startOfMonth(now);
    const previousStart = startOfMonth(now, -1);
    const current = cumulativeDailyExpenses(txns, monthStart, now.getDate());
    const previous = cumulativeDailyExpenses(txns, previousStart);
    const length = Math.max(daysInMonth(monthStart), previous.length);
    const previousLast = previous[previous.length - 1] ?? 0;

    return Array.from({ length }, (_, index) => ({
        day: index + 1,
        current: index < current.length ? current[index] : null,
        previous: previous[index] ?? previousLast,
    }));
}

/* -------------------------------------------------------------------------- */
/*  Spending by category                                                       */
/* -------------------------------------------------------------------------- */

export type CategoryMeta = {
    id: string;
    name: string;
    icon: string | null;
    color: string;
};

export function buildSpendingCategories(
    current: TxnLite[],
    previous: TxnLite[],
    categories: Map<string, CategoryMeta>,
): SpendingCategory[] {
    const sum = (txns: TxnLite[]) => {
        const totals = new Map<string, number>();

        for (const txn of txns) {
            if (txn.type !== "expense") continue;
            totals.set(txn.categoryId, (totals.get(txn.categoryId) ?? 0) + txn.amount);
        }

        return totals;
    };

    const currentTotals = sum(current);
    const previousTotals = sum(previous);
    const total = Array.from(currentTotals.values()).reduce((a, b) => a + b, 0);

    return Array.from(currentTotals.entries())
        .map(([id, amount]) => {
            const meta = categories.get(id);

            return {
                id,
                name: meta?.name ?? "Other",
                amount,
                previousAmount: previousTotals.get(id) ?? 0,
                percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
                color: meta?.color ?? "#94a3b8",
                icon: meta?.icon ?? null,
            };
        })
        .sort((a, b) => b.amount - a.amount);
}

/* -------------------------------------------------------------------------- */
/*  Subscriptions / recurring detection                                        */
/* -------------------------------------------------------------------------- */

const NOISE_WORDS =
    /\b(payment|subscription|monthly|bill|recurring|charge|autopay|auto|renewal|membership|fee|for|the|inc|ltd|pvt)\b/g;

export function normalizeMerchant(description: string) {
    const cleaned = description
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .replace(NOISE_WORDS, " ")
        .replace(/\s+/g, " ")
        .trim();

    return cleaned || description.toLowerCase().trim();
}

const DAY_MS = 86_400_000;

function median(values: number[]) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function cadenceFor(medianDays: number, intervals: number[]) {
    const within = (tolerance: number) =>
        intervals.every((days) => Math.abs(days - medianDays) <= tolerance);

    if (medianDays >= 6 && medianDays <= 8 && within(2)) {
        return { cadence: "weekly" as const, factor: 52 / 12 };
    }

    if (medianDays >= 26 && medianDays <= 35 && within(5)) {
        return { cadence: "monthly" as const, factor: 1 };
    }

    if (medianDays >= 85 && medianDays <= 100 && within(10)) {
        return { cadence: "quarterly" as const, factor: 1 / 3 };
    }

    return null;
}

export function detectSubscriptions(
    txns: TxnLite[],
    categoryNames: Map<string, string>,
    now: Date,
): { items: Subscription[]; monthlyTotal: number } {
    const groups = new Map<string, TxnLite[]>();

    for (const txn of txns) {
        if (txn.type !== "expense") continue;

        const key = normalizeMerchant(txn.description);
        const bucket = groups.get(key);

        if (bucket) bucket.push(txn);
        else groups.set(key, [txn]);
    }

    const items: Subscription[] = [];

    for (const [key, group] of groups) {
        if (group.length < 2) continue;

        const sorted = [...group].sort((a, b) => a.date.getTime() - b.date.getTime());
        const amounts = sorted.map((txn) => txn.amount);
        const medianAmount = median(amounts);
        const spread =
            medianAmount > 0
                ? (Math.max(...amounts) - Math.min(...amounts)) / medianAmount
                : 1;

     
        const tolerance = sorted.length >= 3 ? 0.2 : 0.01;

        if (spread > tolerance) continue;

        const intervals: number[] = [];

        for (let i = 1; i < sorted.length; i += 1) {
            intervals.push(
                Math.round((sorted[i].date.getTime() - sorted[i - 1].date.getTime()) / DAY_MS),
            );
        }

        const medianDays = median(intervals);
        const match = cadenceFor(medianDays, intervals);

        if (!match) continue;

        const last = sorted[sorted.length - 1];
        const daysSinceLast = (now.getTime() - last.date.getTime()) / DAY_MS;
        if (daysSinceLast > medianDays * 2) continue;

        const next = new Date(last.date);

        if (match.cadence === "monthly") next.setMonth(next.getMonth() + 1);
        else if (match.cadence === "quarterly") next.setMonth(next.getMonth() + 3);
        else next.setDate(next.getDate() + 7);

        items.push({
            key,
            name: last.description,
            category: categoryNames.get(last.categoryId) ?? "Other",
            amount: Math.round(medianAmount * 100) / 100,
            cadence: match.cadence,
            monthlyEquivalent: Math.round(medianAmount * match.factor * 100) / 100,
            lastDate: toDateInput(last.date),
            nextDate: toDateInput(next),
            occurrences: sorted.length,
        });
    }

    items.sort((a, b) => b.monthlyEquivalent - a.monthlyEquivalent);

    return {
        items,
        monthlyTotal: items.reduce((total, item) => total + item.monthlyEquivalent, 0),
    };
}

/* -------------------------------------------------------------------------- */
/*  Forecast                                                                   */
/* -------------------------------------------------------------------------- */

export function computeForecast(input: {
    expensesSoFar: number;
    incomeSoFar: number;
    previousExpenses: number;
    previousIncome: number;
    daysElapsed: number;
    daysInMonth: number;
    totalBudget: number;
    budgetSpent: number;
}): Forecast {
    const {
        expensesSoFar,
        incomeSoFar,
        previousExpenses,
        previousIncome,
        daysElapsed,
        daysInMonth: totalDays,
        totalBudget,
        budgetSpent,
    } = input;

    const pace = daysElapsed > 0 ? (expensesSoFar / daysElapsed) * totalDays : 0;
    const weight = clamp((daysElapsed - 3) / 12, 0, 1);
    const baseline = Math.max(previousExpenses, expensesSoFar);
    const projectedExpenses =
        previousExpenses > 0 ? weight * pace + (1 - weight) * baseline : pace;

    const expectedIncome = incomeSoFar > 0 ? incomeSoFar : previousIncome;
    const daysLeft = Math.max(totalDays - daysElapsed, 0);

    return {
        projectedExpenses: Math.max(projectedExpenses, expensesSoFar),
        projectedSavings: expectedIncome - Math.max(projectedExpenses, expensesSoFar),
        expectedIncome,
        paceVsLastMonth: percentChange(
            Math.max(projectedExpenses, expensesSoFar),
            previousExpenses,
        ),
        dailyAllowance:
            totalBudget > 0
                ? Math.max(totalBudget - budgetSpent, 0) / Math.max(daysLeft, 1)
                : null,
        daysLeft,
    };
}

/* -------------------------------------------------------------------------- */
/*  Health score                                                               */
/* -------------------------------------------------------------------------- */

export function computeHealthScore(input: {
    savingsRate: number;
    budgets: BudgetProgress[];
    paceVsLastMonth: number | null;
    transactionCount: number;
}): HealthScore {
    const savings = clamp(input.savingsRate / 20, 0, 1) * 40;

    const budgetScore =
        input.budgets.length > 0
            ? (input.budgets.filter((budget) => budget.status !== "exceeded").length /
                input.budgets.length) *
            30
            : 15;

    let momentum = 10;

    if (input.paceVsLastMonth !== null) {
        const ratio = 1 + input.paceVsLastMonth / 100;

        momentum =
            ratio <= 0.9 ? 20 : ratio <= 1 ? 16 : ratio <= 1.1 ? 10 : ratio <= 1.25 ? 5 : 0;
    }

    const activity = clamp(input.transactionCount / 10, 0, 1) * 10;

    const total = Math.round(savings + budgetScore + momentum + activity);

    return {
        score: total,
        label:
            total >= 80
                ? "Excellent"
                : total >= 65
                    ? "Good"
                    : total >= 45
                        ? "Fair"
                        : "Needs attention",
        factors: [
            {
                label: "Savings rate",
                score: Math.round(savings),
                max: 40,
                hint: "Full marks at 20% or more of income saved.",
            },
            {
                label: "Budget discipline",
                score: Math.round(budgetScore),
                max: 30,
                hint:
                    input.budgets.length > 0
                        ? "Share of budgets that are still within their limit."
                        : "Set budgets to improve this score.",
            },
            {
                label: "Spending momentum",
                score: momentum,
                max: 20,
                hint: "Projected spend compared with last month.",
            },
            {
                label: "Tracking activity",
                score: Math.round(activity),
                max: 10,
                hint: "Log at least 10 transactions a month for full marks.",
            },
        ],
    };
}

/* -------------------------------------------------------------------------- */
/*  Rule-based insights (fallback when Gemini is unavailable)                   */
/* -------------------------------------------------------------------------- */

const impactRank = { high: 0, medium: 1, low: 2 } as const;

export function buildHeuristicInsights(input: {
    currency: string;
    income: number;
    expenses: number;
    savingsRate: number;
    spendingCategories: SpendingCategory[];
    budgets: BudgetProgress[];
    forecast: Forecast;
    subscriptionsMonthly: number;
}): Insight[] {
    const money = (value: number) => formatCurrency(value, input.currency);
    const insights: Insight[] = [];

    for (const budget of input.budgets) {
        if (budget.status === "exceeded") {
            insights.push({
                id: `budget-exceeded-${budget.id}`,
                kind: "warning",
                impact: "high",
                title: `${budget.category} is over budget`,
                detail: `You've spent ${money(budget.spent)} against a ${money(budget.limit)} limit.`,
                suggestedAction: "Review recent purchases in this category.",
            });
        } else if (budget.status === "warning") {
            insights.push({
                id: `budget-warning-${budget.id}`,
                kind: "warning",
                impact: "medium",
                title: `${budget.category} is at ${Math.round(budget.percentage)}% of budget`,
                detail: `Only ${money(Math.max(budget.limit - budget.spent, 0))} left for the rest of the month.`,
            });
        }
    }

    if (input.income > 0) {
        if (input.savingsRate >= 30) {
            insights.push({
                id: "savings-strong",
                kind: "achievement",
                impact: "medium",
                title: `Saving ${input.savingsRate}% of your income`,
                detail: "That's well above the common 20% guideline. Consider putting the surplus toward a goal.",
            });
        } else if (input.savingsRate < 10) {
            insights.push({
                id: "savings-low",
                kind: "warning",
                impact: "high",
                title: `Savings rate is only ${input.savingsRate}%`,
                detail: "Aim for at least 20%. Trimming your largest discretionary category is the quickest lever.",
            });
        }
    }

    const top = input.spendingCategories[0];

    if (top && top.percentage >= 40) {
        insights.push({
            id: "top-category",
            kind: "trend",
            impact: "medium",
            title: `${top.name} makes up ${top.percentage}% of spending`,
            detail: `${money(top.amount)} this month. A concentrated category is where small changes matter most.`,
        });
    }

    const risers = input.spendingCategories
        .filter((c) => c.previousAmount > 0 && c.amount > c.previousAmount * 1.3 && c.amount > 0)
        .sort((a, b) => b.amount - b.previousAmount - (a.amount - a.previousAmount));

    if (risers[0]) {
        const riser = risers[0];

        insights.push({
            id: `riser-${riser.id}`,
            kind: "trend",
            impact: "medium",
            title: `${riser.name} is up ${Math.round(((riser.amount - riser.previousAmount) / riser.previousAmount) * 100)}% vs last month`,
            detail: `${money(riser.amount)} now, compared with ${money(riser.previousAmount)} last month.`,
        });
    }

    if (input.forecast.paceVsLastMonth !== null && input.forecast.paceVsLastMonth > 15) {
        insights.push({
            id: "pace-high",
            kind: "warning",
            impact: "high",
            title: "Spending is running ahead of last month",
            detail: `At this pace you'll spend about ${money(input.forecast.projectedExpenses)} by month end (+${Math.round(input.forecast.paceVsLastMonth)}%).`,
        });
    }

    if (input.income > 0 && input.subscriptionsMonthly / input.income > 0.1) {
        insights.push({
            id: "subs-heavy",
            kind: "opportunity",
            impact: "medium",
            title: "Recurring charges are over 10% of income",
            detail: `${money(input.subscriptionsMonthly)} a month goes to detected subscriptions. Cancel any you no longer use.`,
        });
    }

    if (input.budgets.length === 0 && input.expenses > 0) {
        insights.push({
            id: "no-budgets",
            kind: "opportunity",
            impact: "low",
            title: "You haven't set any budgets yet",
            detail: "Budgets unlock alerts and improve your health score. Let AI suggest limits from your history.",
        });
    }

    return insights
        .sort((a, b) => impactRank[a.impact] - impactRank[b.impact])
        .slice(0, 5);
}
