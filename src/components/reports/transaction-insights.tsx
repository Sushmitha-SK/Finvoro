import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    TrendingUp,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { formatCurrency } from "@/lib/format-currency";

type InsightTransaction = {
    amount: number;
    description: string;
    category: string;
};

type SpendingCategory = {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    amount: number;
    percentage: number;
};

type HighestSpendingDay = {
    date: string;
    amount: number;
};

type TransactionInsightsProps = {
    transactionCount: number;
    averageTransaction: number;
    averageExpense: number;
    largestIncome: InsightTransaction | null;
    largestExpense: InsightTransaction | null;
    topSpendingCategory: SpendingCategory | null;
    highestSpendingDay: HighestSpendingDay | null;
    currency: string;
};

function formatDay(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
}

export function TransactionInsights({
    transactionCount,
    averageTransaction,
    averageExpense,
    largestIncome,
    largestExpense,
    topSpendingCategory,
    highestSpendingDay,
    currency,
}: TransactionInsightsProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Transaction insights</h2>
                <p className="text-sm text-muted-foreground">
                    A closer look at your financial activity.
                </p>
            </div>

            {/* Two Column Layout Wrapper */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Overview Statistics (List Style Layout) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Overview Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y divide-border/60 p-0">
                        {/* Transactions Row */}
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="text-sm font-medium">Transactions</p>
                                <p className="text-xs text-muted-foreground">Total activity count</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold tabular-nums">{transactionCount}</p>
                                <p className="text-xs text-muted-foreground">Total count</p>
                            </div>
                        </div>

                        {/* Average Transaction Row */}
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="text-sm font-medium">Average transaction</p>
                                <p className="text-xs text-muted-foreground">Overall activity average</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold tabular-nums">
                                    {formatCurrency(averageTransaction, currency)}
                                </p>
                                <p className="text-xs text-muted-foreground">Per transaction</p>
                            </div>
                        </div>

                        {/* Average Expense Row */}
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="text-sm font-medium">Average expense</p>
                                <p className="text-xs text-muted-foreground">Expense baseline</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold tabular-nums">
                                    {formatCurrency(averageExpense, currency)}
                                </p>
                                <p className="text-xs text-muted-foreground">Per expense</p>
                            </div>
                        </div>

                        {/* Top Category Row */}
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="text-sm font-medium">Top category</p>
                                <p className="text-xs text-muted-foreground">
                                    {topSpendingCategory?.name ?? "No category"}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold tabular-nums">
                                    {topSpendingCategory
                                        ? formatCurrency(topSpendingCategory.amount, currency)
                                        : "-"}
                                </p>
                                <p className="text-xs text-muted-foreground">Category spend</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Breakdown (List Style Layout) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Activity Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y divide-border/60 p-0">
                        {/* Largest Expense Row */}
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50">
                                    <ArrowDownRight className="size-5 text-destructive" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {largestExpense ? largestExpense.description : "Largest expense"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {largestExpense ? largestExpense.category : "No expenses in this period"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                {largestExpense ? (
                                    <>
                                        <p className="text-sm font-semibold tabular-nums">
                                            {formatCurrency(largestExpense.amount, currency)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Expense</p>
                                    </>
                                ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                )}
                            </div>
                        </div>

                        {/* Largest Income Row */}
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50">
                                    <ArrowUpRight className="size-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {largestIncome ? largestIncome.description : "Largest income"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {largestIncome ? largestIncome.category : "No income in this period"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                {largestIncome ? (
                                    <>
                                        <p className="text-sm font-semibold tabular-nums">
                                            {formatCurrency(largestIncome.amount, currency)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Income</p>
                                    </>
                                ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                )}
                            </div>
                        </div>

                        {/* Highest Spending Day Row */}
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50">
                                    <CalendarDays className="size-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Highest spending day</p>
                                    <p className="text-xs text-muted-foreground">
                                        {highestSpendingDay ? formatDay(highestSpendingDay.date) : "No data"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                {highestSpendingDay ? (
                                    <>
                                        <p className="text-sm font-semibold tabular-nums">
                                            {formatCurrency(highestSpendingDay.amount, currency)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Peak Day</p>
                                    </>
                                ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                )}
                            </div>
                        </div>

                        {/* Spending Focus Row */}
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50">
                                    <TrendingUp className="size-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Spending focus</p>
                                    <p className="text-xs text-muted-foreground">
                                        {topSpendingCategory ? topSpendingCategory.name : "No category"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                {topSpendingCategory ? (
                                    <>
                                        <p className="text-sm font-semibold tabular-nums">
                                            {Math.round(topSpendingCategory.percentage)}%
                                        </p>
                                        <p className="text-xs text-muted-foreground">of total expenses</p>
                                    </>
                                ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}