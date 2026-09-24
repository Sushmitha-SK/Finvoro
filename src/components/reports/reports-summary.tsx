import {
    ArrowDownRight,
    ArrowUpRight,
    Wallet,
    Percent,
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
    const hasTransactions = hasIncome || hasExpenses;

    const isPositiveBalance = netBalance >= 0;
    const isPositiveSavings = savingsRate >= 0;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Income */}
            <Card className="transition-all hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total income
                    </CardTitle>
                    <div className="rounded-full bg-emerald-500/10 p-2">
                        <ArrowUpRight className="size-4 text-emerald-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold tracking-tight tabular-nums">
                        {formatCurrency(totalIncome, currency)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {hasIncome ? "Income received" : "No income in this period"}
                    </p>
                </CardContent>
            </Card>

            {/* Total Expenses */}
            <Card className="transition-all hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total expenses
                    </CardTitle>
                    <div className="rounded-full bg-destructive/10 p-2">
                        <ArrowDownRight className="size-4 text-destructive" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold tracking-tight tabular-nums">
                        {formatCurrency(totalExpenses, currency)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {hasExpenses ? "Money spent" : "No expenses in this period"}
                    </p>
                </CardContent>
            </Card>

            {/* Net Balance */}
            <Card className="transition-all hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Net balance
                    </CardTitle>
                    <div className={`rounded-full p-2 ${isPositiveBalance ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
                        <Wallet
                            className={`size-4 ${
                                isPositiveBalance ? "text-emerald-500" : "text-destructive"
                            }`}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <p
                        className={`text-2xl font-bold tracking-tight tabular-nums ${
                            isPositiveBalance ? "text-foreground" : "text-destructive"
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

            {/* Savings Rate */}
            <Card className="transition-all hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Savings rate
                    </CardTitle>
                    <div className={`rounded-full p-2 ${isPositiveSavings ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
                        <Percent
                            className={`size-4 ${
                                isPositiveSavings ? "text-emerald-500" : "text-destructive"
                            }`}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <p
                        className={`text-2xl font-bold tracking-tight tabular-nums ${
                            isPositiveSavings ? "text-foreground" : "text-destructive"
                        }`}
                    >
                        {Math.round(savingsRate)}%
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {!hasIncome
                            ? "No income to calculate"
                            : isPositiveSavings
                            ? "Of your income saved"
                            : "Spending exceeded income"}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}