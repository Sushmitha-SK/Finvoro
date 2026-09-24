import { describe, expect, it } from "vitest";

import {
    buildCashflow,
    buildHeuristicInsights,
    computeForecast,
    computeHealthScore,
    cumulativeDailyExpenses,
    detectSubscriptions,
    normalizeMerchant,
    type TxnLite,
} from "./analytics";

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);
const expense = (description: string, amount: number, date: Date): TxnLite => ({
    description,
    amount,
    date,
    type: "expense",
    categoryId: "c1",
});

describe("normalizeMerchant", () => {
    it("strips digits, punctuation and noise words", () => {
        expect(normalizeMerchant("Netflix Subscription #4412")).toBe("netflix");
        expect(normalizeMerchant("SPOTIFY - monthly payment")).toBe("spotify");
    });

    it("falls back to the raw text when everything is noise", () => {
        expect(normalizeMerchant("123")).toBe("123");
    });
});

describe("buildCashflow", () => {
    it("buckets by month, ignores out-of-range rows and computes savings rate", () => {
        const months = [d(2026, 7, 1), d(2026, 8, 1)];
        const result = buildCashflow(
            [
                { ...expense("x", 200, d(2026, 7, 5)) },
                { description: "pay", amount: 1000, type: "income", date: d(2026, 7, 1), categoryId: "c2" },
                expense("old", 999, d(2026, 1, 5)),
            ],
            months,
        );

        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({ income: 1000, expenses: 200, net: 800, savingsRate: 80 });
        expect(result[1]).toMatchObject({ income: 0, expenses: 0, savingsRate: 0 });
    });
});

describe("cumulativeDailyExpenses", () => {
    it("is monotonic and truncates at upToDay", () => {
        const series = cumulativeDailyExpenses(
            [expense("a", 10, d(2026, 9, 2)), expense("b", 5, d(2026, 9, 4))],
            d(2026, 9, 1),
            5,
        );

        expect(series).toEqual([0, 10, 10, 15, 15]);
    });
});

describe("detectSubscriptions", () => {
    const now = d(2026, 9, 21);
    const names = new Map([["c1", "Subscriptions"]]);

    it("finds a monthly charge with a stable amount", () => {
        const txns = [5, 6, 7, 8, 9].map((m) => expense("Netflix", 649, d(2026, m, 5)));
        const { items, monthlyTotal } = detectSubscriptions(txns, names, now);

        expect(items).toHaveLength(1);
        expect(items[0]).toMatchObject({ cadence: "monthly", amount: 649, occurrences: 5 });
        expect(items[0].nextDate).toBe("2026-10-05");
        expect(monthlyTotal).toBe(649);
    });

    it("ignores merchants with erratic amounts or timing", () => {
        const txns = [
            expense("Swiggy", 250, d(2026, 8, 2)),
            expense("Swiggy", 900, d(2026, 8, 9)),
            expense("Swiggy", 410, d(2026, 8, 30)),
        ];

        expect(detectSubscriptions(txns, names, now).items).toHaveLength(0);
    });

    it("requires an exact amount match when there are only two charges", () => {
        const differing = [expense("Cafe", 300, d(2026, 7, 10)), expense("Cafe", 340, d(2026, 8, 10))];
        const identical = [expense("Cloud", 300, d(2026, 7, 10)), expense("Cloud", 300, d(2026, 8, 10))];

        expect(detectSubscriptions(differing, names, now).items).toHaveLength(0);
        expect(detectSubscriptions(identical, names, now).items).toHaveLength(1);
    });

    it("drops subscriptions that look cancelled", () => {
        const txns = [1, 2, 3].map((m) => expense("OldGym", 1000, d(2026, m, 15)));

        expect(detectSubscriptions(txns, names, now).items).toHaveLength(0);
    });

    it("never treats income as a subscription", () => {
        const txns = [7, 8, 9].map((m) => ({
            description: "Salary",
            amount: 85000,
            type: "income" as const,
            date: d(2026, m, 1),
            categoryId: "c1",
        }));

        expect(detectSubscriptions(txns, names, now).items).toHaveLength(0);
    });
});

describe("computeForecast", () => {
    const base = {
        expensesSoFar: 15000,
        incomeSoFar: 80000,
        previousExpenses: 40000,
        previousIncome: 80000,
        daysElapsed: 15,
        daysInMonth: 30,
        totalBudget: 0,
        budgetSpent: 0,
    };

    it("extrapolates the pace once enough days have passed", () => {
        const forecast = computeForecast(base);

        expect(forecast.projectedExpenses).toBeCloseTo(30000);
        expect(forecast.projectedSavings).toBeCloseTo(50000);
        expect(forecast.paceVsLastMonth).toBeCloseTo(-25);
        expect(forecast.dailyAllowance).toBeNull();
    });

    it("blends with last month early in the month instead of exploding", () => {
        const early = computeForecast({ ...base, expensesSoFar: 22000, daysElapsed: 1 });

        expect(early.projectedExpenses).toBeLessThan(100000);
    });

    it("never projects below what is already spent", () => {
        const forecast = computeForecast({ ...base, expensesSoFar: 50000, previousExpenses: 10000, daysElapsed: 30 });

        expect(forecast.projectedExpenses).toBeGreaterThanOrEqual(50000);
    });

    it("uses last month's income when none has arrived yet", () => {
        expect(computeForecast({ ...base, incomeSoFar: 0 }).expectedIncome).toBe(80000);
    });

    it("computes a daily allowance from budgets", () => {
        const forecast = computeForecast({ ...base, totalBudget: 10000, budgetSpent: 4000 });

        expect(forecast.dailyAllowance).toBeCloseTo(6000 / 15);
    });
});

describe("computeHealthScore", () => {
    it("stays within 0-100 and factor maxima sum to 100", () => {
        const best = computeHealthScore({ savingsRate: 90, budgets: [], paceVsLastMonth: -50, transactionCount: 99 });
        const worst = computeHealthScore({
            savingsRate: -50,
            budgets: [{ id: "1", categoryId: "1", category: "A", spent: 2, limit: 1, percentage: 200, status: "exceeded" }],
            paceVsLastMonth: 100,
            transactionCount: 0,
        });

        expect(best.score).toBeLessThanOrEqual(100);
        expect(worst.score).toBeGreaterThanOrEqual(0);
        expect(worst.score).toBeLessThan(best.score);
        expect(best.factors.reduce((t, f) => t + f.max, 0)).toBe(100);
        expect(worst.label).toBe("Needs attention");
    });
});

describe("buildHeuristicInsights", () => {
    it("flags exceeded budgets first and caps the list at five", () => {
        const insights = buildHeuristicInsights({
            currency: "INR",
            income: 1000,
            expenses: 990,
            savingsRate: 1,
            spendingCategories: [
                { id: "a", name: "Dining", amount: 700, previousAmount: 300, percentage: 70, color: "#000", icon: null },
            ],
            budgets: [
                { id: "b1", categoryId: "a", category: "Dining", spent: 700, limit: 400, percentage: 175, status: "exceeded" },
            ],
            forecast: { projectedExpenses: 1500, projectedSavings: -500, expectedIncome: 1000, paceVsLastMonth: 40, dailyAllowance: null, daysLeft: 10 },
            subscriptionsMonthly: 300,
        });

        expect(insights.length).toBeLessThanOrEqual(5);
        expect(insights[0].impact).toBe("high");
        expect(insights.some((i) => i.id === "budget-exceeded-b1")).toBe(true);
    });

    it("suggests setting budgets when there are none", () => {
        const insights = buildHeuristicInsights({
            currency: "INR",
            income: 1000,
            expenses: 400,
            savingsRate: 60,
            spendingCategories: [],
            budgets: [],
            forecast: { projectedExpenses: 400, projectedSavings: 600, expectedIncome: 1000, paceVsLastMonth: null, dailyAllowance: null, daysLeft: 10 },
            subscriptionsMonthly: 0,
        });

        expect(insights.some((i) => i.id === "no-budgets")).toBe(true);
    });
});
