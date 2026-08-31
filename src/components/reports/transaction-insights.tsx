import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    CircleDollarSign,
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
    currency: string,
};

function formatDay(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
}

function EmptyInsight({
    message,
}: {
    message: string;
}) {
    return (
        <div className="flex min-h-24 items-center">
            <p className="text-sm text-muted-foreground">
                {message}
            </p>
        </div>
    );
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

                        <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                            <Receipt className="size-4 text-muted-foreground" />
                        </div>
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

                        <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                            <WalletCards className="size-4 text-muted-foreground" />
                        </div>
                    </CardHeader>

                    <CardContent>
                        <p className="text-2xl font-semibold tracking-tight">
                            {formatCurrency(
                                averageTransaction,
                                currency,
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

                        <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                            <TrendingUp className="size-4 text-muted-foreground" />
                        </div>
                    </CardHeader>

                    <CardContent>
                        <p className="text-2xl font-semibold tracking-tight">
                            {formatCurrency(
                                averageExpense,
                                currency
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
                            className="flex size-8 items-center justify-center rounded-lg"
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
                            {topSpendingCategory?.icon ? (
                                <span className="text-sm">
                                    {
                                        topSpendingCategory.icon
                                    }
                                </span>
                            ) : (
                                <CircleDollarSign className="size-4 text-muted-foreground" />
                            )}
                        </div>
                    </CardHeader>

                    <CardContent>
                        <p className="truncate text-2xl font-semibold tracking-tight">
                            {topSpendingCategory?.name ??
                                "No category"}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {topSpendingCategory
                                ? formatCurrency(
                                    topSpendingCategory.amount,
                                    currency,
                                )
                                : "No expenses in this period"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10">
                                <ArrowDownRight className="size-4 text-destructive" />
                            </div>

                            <CardTitle className="text-base">
                                Largest expense
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {largestExpense ? (
                            <div className="space-y-1">
                                <p className="text-2xl font-semibold tracking-tight">
                                    {formatCurrency(
                                        largestExpense.amount,
                                        currency,
                                    )}
                                </p>

                                <p className="truncate font-medium">
                                    {
                                        largestExpense.description
                                    }
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {
                                        largestExpense.category
                                    }
                                </p>
                            </div>
                        ) : (
                            <EmptyInsight message="No expenses in this period." />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
                                <ArrowUpRight className="size-4 text-emerald-500" />
                            </div>

                            <CardTitle className="text-base">
                                Largest income
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {largestIncome ? (
                            <div className="space-y-1">
                                <p className="text-2xl font-semibold tracking-tight">
                                    {formatCurrency(
                                        largestIncome.amount,
                                        currency
                                    )}
                                </p>

                                <p className="truncate font-medium">
                                    {
                                        largestIncome.description
                                    }
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {
                                        largestIncome.category
                                    }
                                </p>
                            </div>
                        ) : (
                            <EmptyInsight message="No income in this period." />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                                <CalendarDays className="size-4 text-muted-foreground" />
                            </div>

                            <CardTitle className="text-base">
                                Highest spending day
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {highestSpendingDay ? (
                            <div className="space-y-1">
                                <p className="text-2xl font-semibold tracking-tight">
                                    {formatCurrency(
                                        highestSpendingDay.amount,
                                        currency,
                                    )}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {formatDay(
                                        highestSpendingDay.date,
                                    )}
                                </p>
                            </div>
                        ) : (
                            <EmptyInsight message="No spending data in this period." />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                                <TrendingUp className="size-4 text-muted-foreground" />
                            </div>

                            <CardTitle className="text-base">
                                Spending focus
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {topSpendingCategory ? (
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Most of your spending is going
                                    toward
                                </p>

                                <p className="truncate text-xl font-semibold">
                                    {
                                        topSpendingCategory.name
                                    }
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {Math.round(
                                        topSpendingCategory.percentage,
                                    )}
                                    % of total expenses
                                </p>
                            </div>
                        ) : (
                            <EmptyInsight message="Add expenses to see your spending focus." />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}