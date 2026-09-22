import { colorForName } from "@/lib/colors";
import { daysInMonth, lastMonths, monthKey, monthLabel, startOfMonth, toDateInput } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import type { BudgetProgress, DashboardData } from "@/types/finance";

import {
    buildCashflow,
    buildHeuristicInsights,
    buildSpendingCategories,
    buildSpendingPace,
    computeForecast,
    computeHealthScore,
    detectSubscriptions,
    type CategoryMeta,
    type TxnLite,
} from "./analytics";
import { budgetStatus } from "./budgets";
import { getGoals } from "./goals";
import { getUserPreferences } from "./preferences";

const HISTORY_MONTHS = 6;

export async function getDashboardData(
    clerkUserId: string,
    now = new Date(),
): Promise<DashboardData> {
    const monthStart = startOfMonth(now);
    const nextMonthStart = startOfMonth(now, 1);
    const historyStart = startOfMonth(now, -(HISTORY_MONTHS - 1));

    const [rows, totalsByType, budgets, recent, categories, goals, preferences] =
        await Promise.all([
            prisma.transaction.findMany({
                where: { clerkUserId, date: { gte: historyStart, lt: nextMonthStart } },
                select: {
                    id: true,
                    description: true,
                    amount: true,
                    type: true,
                    date: true,
                    categoryId: true,
                },
            }),
            prisma.transaction.groupBy({
                by: ["type"],
                where: { clerkUserId },
                _sum: { amount: true },
            }),
            prisma.budget.findMany({
                where: {
                    clerkUserId,
                    month: monthStart.getMonth() + 1,
                    year: monthStart.getFullYear(),
                },
                include: { category: true },
                orderBy: { createdAt: "asc" },
            }),
            prisma.transaction.findMany({
                where: { clerkUserId },
                include: { category: true },
                orderBy: [{ date: "desc" }, { createdAt: "desc" }],
                take: 6,
            }),
            prisma.category.findMany({ where: { clerkUserId } }),
            getGoals(clerkUserId, now),
            getUserPreferences(clerkUserId),
        ]);

    const txns: TxnLite[] = rows.map((row) => ({
        ...row,
        amount: Number(row.amount),
    }));

    const categoryMeta = new Map<string, CategoryMeta>(
        categories.map((category) => [
            category.id,
            {
                id: category.id,
                name: category.name,
                icon: category.icon,
                color: category.color ?? colorForName(category.name),
            },
        ]),
    );

    const currentKey = monthKey(monthStart);
    const previousKey = monthKey(startOfMonth(now, -1));
    const currentTxns = txns.filter((txn) => monthKey(txn.date) === currentKey);
    const previousTxns = txns.filter((txn) => monthKey(txn.date) === previousKey);

    const dayOfMonth = now.getDate();
    const previousToDateTxns = previousTxns.filter((txn) => txn.date.getDate() <= dayOfMonth);
    const sumType = (list: TxnLite[], type: "income" | "expense") =>
        list.filter((txn) => txn.type === type).reduce((total, txn) => total + txn.amount, 0);
    const previousToDateIncome = sumType(previousToDateTxns, "income");
    const previousToDateExpenses = sumType(previousToDateTxns, "expense");

    const cashflow = buildCashflow(txns, lastMonths(now, HISTORY_MONTHS));
    const currentPoint = cashflow[cashflow.length - 1];
    const previousPoint = cashflow[cashflow.length - 2];

    const income = Number(totalsByType.find((t) => t.type === "income")?._sum.amount ?? 0);
    const expenses = Number(totalsByType.find((t) => t.type === "expense")?._sum.amount ?? 0);

    const spendingCategories = buildSpendingCategories(currentTxns, previousTxns, categoryMeta);

    const budgetProgress: BudgetProgress[] = budgets.map((budget) => {
        const spent = currentTxns
            .filter((txn) => txn.type === "expense" && txn.categoryId === budget.categoryId)
            .reduce((total, txn) => total + txn.amount, 0);
        const limit = Number(budget.amount);
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;

        return {
            id: budget.id,
            categoryId: budget.categoryId,
            category: budget.category.name,
            spent,
            limit,
            percentage,
            status: budgetStatus(percentage),
        };
    });

    const subscriptions = detectSubscriptions(
        txns,
        new Map(categories.map((category) => [category.id, category.name])),
        now,
    );

    const forecast = computeForecast({
        expensesSoFar: currentPoint.expenses,
        incomeSoFar: currentPoint.income,
        previousExpenses: previousPoint?.expenses ?? 0,
        previousIncome: previousPoint?.income ?? 0,
        daysElapsed: now.getDate(),
        daysInMonth: daysInMonth(now),
        totalBudget: budgetProgress.reduce((total, b) => total + b.limit, 0),
        budgetSpent: budgetProgress.reduce((total, b) => total + b.spent, 0),
    });

    const health = computeHealthScore({
        savingsRate: currentPoint.savingsRate,
        budgets: budgetProgress,
        paceVsLastMonth: forecast.paceVsLastMonth,
        transactionCount: currentTxns.length,
    });

    return {
        currency: preferences.currency,
        aiEnabled: preferences.aiEnabled,
        hasData: recent.length > 0,
        monthLabel: monthLabel(now, "long"),
        balance: income - expenses,
        month: {
            income: currentPoint.income,
            expenses: currentPoint.expenses,
            net: currentPoint.net,
            savingsRate: currentPoint.savingsRate,
            daysElapsed: now.getDate(),
            daysInMonth: daysInMonth(now),
        },
        previous: {
            income: previousPoint?.income ?? 0,
            expenses: previousPoint?.expenses ?? 0,
            net: previousPoint?.net ?? 0,
            savingsRate: previousPoint?.savingsRate ?? 0,
        },
        previousToDate: {
            income: previousToDateIncome,
            expenses: previousToDateExpenses,
            savingsRate:
                previousToDateIncome > 0
                    ? Math.round(((previousToDateIncome - previousToDateExpenses) / previousToDateIncome) * 100)
                    : 0,
        },
        cashflow,
        spendingPace: buildSpendingPace(txns, now),
        spendingCategories,
        budgets: budgetProgress,
        recentTransactions: recent.map((txn) => ({
            id: txn.id,
            description: txn.description,
            category: txn.category.name,
            categoryColor: txn.category.color ?? colorForName(txn.category.name),
            type: txn.type,
            amount: Number(txn.amount),
            date: toDateInput(txn.date),
        })),
        goals,
        subscriptions,
        forecast,
        health,
        heuristicInsights: buildHeuristicInsights({
            currency: preferences.currency,
            income: currentPoint.income,
            expenses: currentPoint.expenses,
            savingsRate: currentPoint.savingsRate,
            spendingCategories,
            budgets: budgetProgress,
            forecast,
            subscriptionsMonthly: subscriptions.monthlyTotal,
        }),
    };
}
