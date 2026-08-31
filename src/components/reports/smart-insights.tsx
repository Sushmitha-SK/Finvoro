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
    currency: string;
};

function formatPercentage(value: number) {
    return `${Math.abs(Math.round(value))}% `;
}

function ChangeIndicator({
    value,
    positiveIsGood = true,
    hasPreviousValue = true,
}: {
    value: number;
    positiveIsGood?: boolean;
    hasPreviousValue?: boolean;
}) {
    if (!hasPreviousValue) {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Minus className="size-3" />
                No previous data
            </span>
        );
    }

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
            className={`inline - items - center gap - 1 text - xs ${isGood
                ? "text-emerald-600"
                : "text-destructive"
                } `}
        >
            {isPositive ? (
                <ArrowUpRight className="size-3" />
            ) : (
                <ArrowDownRight className="size-3" />
            )}

            {formatPercentage(value)} vs previous period
        </span>
    );
}

function getInsights({
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

    const hasCurrentActivity =
        totalIncome > 0 || totalExpenses > 0;

    const hasPreviousActivity =
        previousIncome > 0 || previousExpenses > 0;

    if (!hasCurrentActivity && !hasPreviousActivity) {
        return [
            "No financial activity was recorded for the selected or previous period. Start tracking your income and expenses to unlock personalized insights.",
        ];
    }

    if (!hasCurrentActivity && hasPreviousActivity) {
        return [
            "No financial activity was recorded in the selected period. Your previous period contains activity for comparison.",
        ];
    }

    if (hasCurrentActivity && !hasPreviousActivity) {
        insights.push(
            "This is your first active comparison period. Keep tracking your finances to build meaningful trends.",
        );
    }

    if (
        totalExpenses > 0 &&
        previousExpenses > 0
    ) {
        if (expenseChange > 5) {
            insights.push(
                `Expenses increased by ${formatPercentage(
                    expenseChange,
                )
                }. Review your largest spending categories to see where the increase came from.`,
            );
        } else if (expenseChange < -5) {
            insights.push(
                `Expenses decreased by ${formatPercentage(
                    expenseChange,
                )
                }. You're spending less than in the previous period.`,
            );
        }
    } else if (
        totalExpenses > 0 &&
        previousExpenses === 0
    ) {
        insights.push(
            "You recorded expenses this period after having no expenses in the previous period.",
        );
    } else if (
        totalExpenses === 0 &&
        previousExpenses > 0
    ) {
        insights.push(
            "You recorded no expenses this period, which is lower than the previous period.",
        );
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
    } else if (
        totalIncome > 0 &&
        previousIncome === 0
    ) {
        insights.push(
            "You recorded income this period after having no income in the previous period.",
        );
    } else if (
        totalIncome === 0 &&
        previousIncome > 0
    ) {
        insights.push(
            "No income was recorded this period, compared with income in the previous period.",
        );
    }

    if (
        hasCurrentActivity &&
        hasPreviousActivity
    ) {
        if (savingsRateChange > 2) {
            insights.push(
                `Your savings rate improved by ${Math.round(
                    savingsRateChange,
                )} percentage points compared with the previous period.`,
            );
        } else if (
            savingsRateChange < -2
        ) {
            insights.push(
                `Your savings rate decreased by ${Math.abs(
                    Math.round(savingsRateChange),
                )} percentage points compared with the previous period.`,
            );
        }
    }

    if (savingsRate >= 30) {
        insights.push(
            "You're maintaining a strong savings rate this period.",
        );
    } else if (savingsRate >= 20) {
        insights.push(
            "You're maintaining a healthy savings rate. Small improvements could help you save even more.",
        );
    } else if (
        savingsRate > 0 &&
        savingsRate < 20
    ) {
        insights.push(
            "Your savings rate is relatively low. Reviewing your largest expense categories could help improve it.",
        );
    } else if (
        totalIncome > 0 &&
        savingsRate <= 0
    ) {
        insights.push(
            "Your expenses are matching or exceeding your income. Consider reviewing your largest spending categories.",
        );
    }

    if (insights.length === 0) {
        insights.push(
            "Your finances are relatively stable this period. Keep tracking your activity to uncover more useful spending patterns.",
        );
    }

    return insights.slice(0, 3);
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
    currency
}: SmartInsightsProps) {
    const insights = getInsights({
        totalIncome,
        totalExpenses,
        savingsRate,
        incomeChange,
        expenseChange,
        savingsRateChange,
        previousIncome,
        previousExpenses,
        currency
    });

    const incomeHasPreviousData =
        previousIncome > 0;

    const expensesHavePreviousData =
        previousExpenses > 0;

    const savingsHasPreviousData =
        previousIncome > 0 ||
        previousExpenses > 0;

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
                                {formatCurrency(totalIncome, currency)}
                            </p>

                            <div className="mt-1">
                                <ChangeIndicator
                                    value={incomeChange}
                                    hasPreviousValue={
                                        incomeHasPreviousData
                                    }
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
                                {formatCurrency(totalExpenses, currency)}
                            </p>

                            <div className="mt-1">
                                <ChangeIndicator
                                    value={expenseChange}
                                    positiveIsGood={false}
                                    hasPreviousValue={
                                        expensesHavePreviousData
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
                                {Math.round(savingsRate)}%
                            </p>

                            <div className="mt-1">
                                <ChangeIndicator
                                    value={savingsRateChange}
                                    hasPreviousValue={
                                        savingsHasPreviousData
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

                                    <p>{insight}</p>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

