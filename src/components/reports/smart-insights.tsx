import {
    ArrowDownRight,
    ArrowUpRight,
    Lightbulb,
    Minus,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { formatCurrency } from "@/lib/format-currency";

type SmartInsightsProps = {
    totalIncome: number;
    totalExpenses: number;
    savingsRate: number;

    incomeChange: number;
    expenseChange: number;
    savingsRateChange: number;

    previousIncome: number;
    previousExpenses: number;
};

function formatPercentage(value: number) {
    return `${Math.abs(Math.round(value))}%`;
}

function ChangeIndicator({
    value,
    positiveIsGood = true,
}: {
    value: number;
    positiveIsGood?: boolean;
}) {
    if (Math.round(value) === 0) {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Minus className="size-3" />
                No change
            </span>
        );
    }

    const isPositive = value > 0;
    const isGood = positiveIsGood
        ? isPositive
        : !isPositive;

    return (
        <span
            className={`inline-flex items-center gap-1 text-xs ${isGood
                    ? "text-emerald-600"
                    : "text-destructive"
                }`}
        >
            {isPositive ? (
                <ArrowUpRight className="size-3" />
            ) : (
                <ArrowDownRight className="size-3" />
            )}

            {formatPercentage(value)}
            {" "}
            vs previous period
        </span>
    );
}

export function SmartInsights({
    totalIncome,
    totalExpenses,
    savingsRate,
    incomeChange,
    expenseChange,
    savingsRateChange,
    previousIncome,
    previousExpenses,
}: SmartInsightsProps) {
    const insights: string[] = [];

    if (
        totalExpenses > 0 &&
        previousExpenses > 0
    ) {
        if (expenseChange > 5) {
            insights.push(
                `Expenses increased by ${formatPercentage(
                    expenseChange,
                )} compared with the previous period.`,
            );
        } else if (expenseChange < -5) {
            insights.push(
                `Expenses decreased by ${formatPercentage(
                    expenseChange,
                )} compared with the previous period.`,
            );
        }
    }

    if (
        totalIncome > 0 &&
        previousIncome > 0
    ) {
        if (incomeChange > 5) {
            insights.push(
                `Income increased by ${formatPercentage(
                    incomeChange,
                )} compared with the previous period.`,
            );
        } else if (incomeChange < -5) {
            insights.push(
                `Income decreased by ${formatPercentage(
                    incomeChange,
                )} compared with the previous period.`,
            );
        }
    }

    if (savingsRateChange > 2) {
        insights.push(
            `Your savings rate improved by ${Math.round(
                savingsRateChange,
            )} percentage points.`,
        );
    } else if (savingsRateChange < -2) {
        insights.push(
            `Your savings rate decreased by ${Math.abs(
                Math.round(savingsRateChange),
            )} percentage points.`,
        );
    }

    if (savingsRate >= 30) {
        insights.push(
            "You're maintaining a strong savings rate this period.",
        );
    } else if (
        savingsRate > 0 &&
        savingsRate < 10
    ) {
        insights.push(
            "Your savings rate is relatively low. Consider reviewing your largest expense categories.",
        );
    }

    if (insights.length === 0) {
        insights.push(
            "Keep tracking your finances to uncover more spending patterns.",
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                        <Lightbulb className="size-4 text-primary" />
                    </div>

                    <div>
                        <CardTitle className="text-base">
                            Smart insights
                        </CardTitle>

                        <p className="text-sm text-muted-foreground">
                            How your finances compare with the previous period.
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="size-4 text-muted-foreground" />

                                <span className="text-sm font-medium">
                                    Income
                                </span>
                            </div>

                            <p className="mt-2 font-semibold">
                                {formatCurrency(
                                    totalIncome,
                                )}
                            </p>

                            <div className="mt-1">
                                <ChangeIndicator
                                    value={incomeChange}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="size-4 text-muted-foreground" />

                                <span className="text-sm font-medium">
                                    Expenses
                                </span>
                            </div>

                            <p className="mt-2 font-semibold">
                                {formatCurrency(
                                    totalExpenses,
                                )}
                            </p>

                            <div className="mt-1">
                                <ChangeIndicator
                                    value={
                                        expenseChange
                                    }
                                    positiveIsGood={
                                        false
                                    }
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="size-4 text-muted-foreground" />

                                <span className="text-sm font-medium">
                                    Savings rate
                                </span>
                            </div>

                            <p className="mt-2 font-semibold">
                                {Math.round(
                                    savingsRate,
                                )}
                                %
                            </p>

                            <div className="mt-1">
                                <ChangeIndicator
                                    value={
                                        savingsRateChange
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {insights.map(
                            (insight, index) => (
                                <div
                                    key={`${insight}-${index}`}
                                    className="flex gap-3 rounded-lg bg-muted/50 p-3 text-sm"
                                >
                                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />

                                    <p>
                                        {insight}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}