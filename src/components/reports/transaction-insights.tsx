import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    Receipt,
    TrendingUp,
    WalletCards,
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
};

function formatDay(date: string) {
    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    ).format(new Date(`${date}T00:00:00`));
}

export function TransactionInsights({
    transactionCount,
    averageTransaction,
    averageExpense,
    largestIncome,
    largestExpense,
    topSpendingCategory,
    highestSpendingDay,
}: TransactionInsightsProps) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold">
                    Transaction insights
                </h2>

                <p className="text-sm text-muted-foreground">
                    A closer look at your financial activity.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Transactions
                        </CardTitle>

                        <Receipt className="size-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <p className="text-2xl font-semibold tracking-tight">
                            {transactionCount}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Total transactions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average transaction
                        </CardTitle>

                        <WalletCards className="size-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <p className="text-2xl font-semibold tracking-tight">
                            {formatCurrency(
                                averageTransaction,
                            )}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Per transaction
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average expense
                        </CardTitle>

                        <TrendingUp className="size-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <p className="text-2xl font-semibold tracking-tight">
                            {formatCurrency(
                                averageExpense,
                            )}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Per expense
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Top category
                        </CardTitle>

                        <div
                            className="flex size-7 items-center justify-center rounded-lg"
                            style={
                                topSpendingCategory?.color
                                    ? {
                                        backgroundColor:
                                            `${topSpendingCategory.color}20`,
                                        color:
                                            topSpendingCategory.color,
                                    }
                                    : undefined
                            }
                        >
                            {topSpendingCategory?.icon ?? "📁"}
                        </div>
                    </CardHeader>

                    <CardContent>
                        <p className="truncate text-2xl font-semibold tracking-tight">
                            {topSpendingCategory?.name ??
                                "—"}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {topSpendingCategory
                                ? formatCurrency(
                                    topSpendingCategory.amount,
                                )
                                : "No expenses yet"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <ArrowDownRight className="size-4 text-destructive" />

                            <CardTitle className="text-base">
                                Largest expense
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {largestExpense ? (
                            <div>
                                <p className="text-2xl font-semibold">
                                    {formatCurrency(
                                        largestExpense.amount,
                                    )}
                                </p>

                                <p className="mt-1 font-medium">
                                    {
                                        largestExpense.description
                                    }
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {
                                        largestExpense.category
                                    }
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No expenses in this period.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <ArrowUpRight className="size-4 text-emerald-500" />

                            <CardTitle className="text-base">
                                Largest income
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {largestIncome ? (
                            <div>
                                <p className="text-2xl font-semibold">
                                    {formatCurrency(
                                        largestIncome.amount,
                                    )}
                                </p>

                                <p className="mt-1 font-medium">
                                    {
                                        largestIncome.description
                                    }
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {
                                        largestIncome.category
                                    }
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No income in this period.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="size-4 text-muted-foreground" />

                            <CardTitle className="text-base">
                                Highest spending day
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {highestSpendingDay ? (
                            <div>
                                <p className="text-2xl font-semibold">
                                    {formatCurrency(
                                        highestSpendingDay.amount,
                                    )}
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {formatDay(
                                        highestSpendingDay.date,
                                    )}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No spending data yet.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="size-4 text-muted-foreground" />

                            <CardTitle className="text-base">
                                Spending focus
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {topSpendingCategory ? (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Most of your spending is going
                                    toward
                                </p>

                                <p className="mt-1 text-xl font-semibold">
                                    {
                                        topSpendingCategory.name
                                    }
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {Math.round(
                                        topSpendingCategory.percentage,
                                    )}
                                    % of total expenses
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Add expenses to see your spending
                                focus.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}