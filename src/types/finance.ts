export type TransactionType = "income" | "expense";

export type InsightKind =
    | "saving"
    | "warning"
    | "trend"
    | "opportunity"
    | "achievement";

export type InsightImpact = "high" | "medium" | "low";

export type Insight = {
    id: string;
    title: string;
    detail: string;
    kind: InsightKind;
    impact: InsightImpact;
    suggestedAction?: string;
};

export type CashflowPoint = {
    key: string;
    label: string;
    income: number;
    expenses: number;
    net: number;
    savingsRate: number;
};

export type SpendingCategory = {
    id: string;
    name: string;
    amount: number;
    previousAmount: number;
    percentage: number;
    color: string;
    icon: string | null;
};

export type BudgetProgress = {
    id: string;
    categoryId: string;
    category: string;
    spent: number;
    limit: number;
    percentage: number;
    status: "ok" | "warning" | "exceeded";
};

export type RecentTransaction = {
    id: string;
    description: string;
    category: string;
    categoryColor: string;
    type: TransactionType;
    amount: number;
    date: string;
};

export type GoalSummary = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string | null;
    color: string | null;
    percentage: number;
    monthlyNeeded: number | null;
};

export type Subscription = {
    key: string;
    name: string;
    category: string;
    amount: number;
    cadence: "weekly" | "monthly" | "quarterly";
    monthlyEquivalent: number;
    lastDate: string;
    nextDate: string;
    occurrences: number;
};

export type Forecast = {
    projectedExpenses: number;
    projectedSavings: number;
    expectedIncome: number;
    /** Spending pace vs last month, as a percentage (positive = spending faster). */
    paceVsLastMonth: number | null;
    dailyAllowance: number | null;
    daysLeft: number;
};

export type HealthFactor = {
    label: string;
    score: number;
    max: number;
    hint: string;
};

export type HealthScore = {
    score: number;
    label: "Excellent" | "Good" | "Fair" | "Needs attention";
    factors: HealthFactor[];
};

export type SpendingPacePoint = {
    day: number;
    current: number | null;
    previous: number;
};

export type DashboardData = {
    currency: string;
    aiEnabled: boolean;
    hasData: boolean;
    monthLabel: string;
    balance: number;
    month: {
        income: number;
        expenses: number;
        net: number;
        savingsRate: number;
        daysElapsed: number;
        daysInMonth: number;
    };
    previous: {
        income: number;
        expenses: number;
        net: number;
        savingsRate: number;
    };
    /** Last month up to the same day-of-month, for like-for-like comparisons. */
    previousToDate: {
        income: number;
        expenses: number;
        savingsRate: number;
    };
    cashflow: CashflowPoint[];
    spendingPace: SpendingPacePoint[];
    spendingCategories: SpendingCategory[];
    budgets: BudgetProgress[];
    recentTransactions: RecentTransaction[];
    goals: GoalSummary[];
    subscriptions: { items: Subscription[]; monthlyTotal: number };
    forecast: Forecast;
    health: HealthScore;
    heuristicInsights: Insight[];
};
