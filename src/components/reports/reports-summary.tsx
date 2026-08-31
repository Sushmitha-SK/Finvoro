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
};

export function ReportsSummary({
    totalIncome,
    totalExpenses,
    netBalance,
    savingsRate,
}: ReportsSummaryProps) {
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
                    <p className="text-2xl font-semibold tracking-tight">
                        {formatCurrency(totalIncome)}
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
                    <p className="text-2xl font-semibold tracking-tight">
                        {formatCurrency(totalExpenses)}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        Net balance
                    </CardTitle>

                    <Wallet className="size-4 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                    <p className="text-2xl font-semibold tracking-tight">
                        {formatCurrency(netBalance)}
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
                    <p className="text-2xl font-semibold tracking-tight">
                        {Math.round(savingsRate)}%
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}