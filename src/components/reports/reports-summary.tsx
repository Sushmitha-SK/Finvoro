import {
    ArrowDownRight,
    ArrowUpRight,
    Wallet,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { formatCurrency } from "@/lib/format-currency";

type ReportsSummaryProps = {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    savingsRate: number;
    currency: string;
};

export function ReportsSummary({
    totalIncome,
    totalExpenses,
    netBalance,
    savingsRate,
    currency
}: ReportsSummaryProps) {
    const hasIncome = totalIncome > 0;
    const hasExpenses = totalExpenses > 0;
    const hasTransactions =
        hasIncome || hasExpenses;

    const isPositiveBalance =
        netBalance >= 0;

    const isPositiveSavings =
        savingsRate >= 0;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total income
                    </CardTitle>

                    <ArrowUpRight className="size-4 text-emerald-500" />
                </CardHeader>

                <CardContent>
                    <p className="text-2xl font-semibold tracking-tight tabular-nums">
                        {formatCurrency(totalIncome, currency)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {hasIncome
                            ? "Income received"
                            : "No income in this period"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total expenses
                    </CardTitle>

                    <ArrowDownRight className="size-4 text-destructive" />
                </CardHeader>

                <CardContent>
                    <p className="text-2xl font-semibold tracking-tight tabular-nums">
                        {formatCurrency(totalExpenses, currency)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {hasExpenses
                            ? "Money spent"
                            : "No expenses in this period"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        Net balance
                    </CardTitle>

                    <Wallet
                        className={`size-4 ${isPositiveBalance
                            ? "text-emerald-500"
                            : "text-destructive"
                            }`}
                    />
                </CardHeader>

                <CardContent>
                    <p
                        className={`text-2xl font-semibold tracking-tight tabular-nums ${isPositiveBalance
                            ? "text-foreground"
                            : "text-destructive"
                            }`}
                    >
                        {formatCurrency(netBalance, currency)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {!hasTransactions
                            ? "No activity in this period"
                            : isPositiveBalance
                                ? "Income exceeds expenses"
                                : "Expenses exceed income"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                        Savings rate
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p
                        className={`text-2xl font-semibold tracking-tight tabular-nums ${isPositiveSavings
                            ? "text-foreground"
                            : "text-destructive"
                            }`}
                    >
                        {Math.round(savingsRate)}%
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {!hasIncome
                            ? "No income to calculate savings"
                            : isPositiveSavings
                                ? "Of your income saved"
                                : "Spending exceeded income"}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}