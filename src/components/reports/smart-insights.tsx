import {
    ArrowDownRight,
    ArrowUpRight,
    Lightbulb,
    Minus,
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
    const isGood = positiveIsGood ? isPositive : !isPositive;

    return (
        <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${isGood
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive"
                }`}
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

    const hasCurrentActivity = totalIncome > 0 || totalExpenses > 0;
    const hasPreviousActivity = previousIncome > 0 || previousExpenses > 0;

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

    if (totalExpenses > 0 && previousExpenses > 0) {
        if (expenseChange > 5) {
            insights.push(
                `Expenses increased by ${formatPercentage(
                    expenseChange,
                )}. Review your largest spending categories to see where the increase came from.`,
            );
        } else if (expenseChange < -5) {
            insights.push(
                `Expenses decreased by ${formatPercentage(
                    expenseChange,
                )}. You're spending less than in the previous period.`,
            );
        }
    } else if (totalExpenses > 0 && previousExpenses === 0) {
        insights.push(
            "You recorded expenses this period after having no expenses in the previous period.",
        );
    } else if (totalExpenses === 0 && previousExpenses > 0) {
        insights.push(
            "You recorded no expenses this period, which is lower than the previous period.",
        );
    }

    if (totalIncome > 0 && previousIncome > 0) {
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
    } else if (totalIncome > 0 && previousIncome === 0) {
        insights.push(
            "You recorded income this period after having no income in the previous period.",
        );
    } else if (totalIncome === 0 && previousIncome > 0) {
        insights.push(
            "No income was recorded this period, compared with income in the previous period.",
        );
    }

    if (hasCurrentActivity && hasPreviousActivity) {
        if (savingsRateChange > 2) {
            insights.push(
                `Your savings rate improved by ${Math.round(
                    savingsRateChange,
                )} percentage points compared with the previous period.`,
            );
        } else if (savingsRateChange < -2) {
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
    } else if (savingsRate > 0 && savingsRate < 20) {
        insights.push(
            "Your savings rate is relatively low. Reviewing your largest expense categories could help improve it.",
        );
    } else if (totalIncome > 0 && savingsRate <= 0) {
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
    currency,
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
        currency,
    });

    const incomeHasPreviousData = previousIncome > 0;
    const expensesHavePreviousData = previousExpenses > 0;
    const savingsHasPreviousData = previousIncome > 0 || previousExpenses > 0;

    const normalizedSavings = Math.min(Math.max(Math.round(savingsRate), 0), 100);
    const circumference = 2 * Math.PI * 38; 
    const strokeDashoffset = circumference - (normalizedSavings / 100) * circumference;

    return (
        <Card className="border-border/60 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                        <Lightbulb className="size-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold tracking-tight">
                        AI Financial Health Score
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid gap-6 lg:grid-cols-12 items-center py-2">
                    {/* Left: Circular Score Graphic */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-muted/20 rounded-2xl border border-border/40">
                        <div className="relative flex items-center justify-center size-36">
                            <svg className="size-full -rotate-90" viewBox="0 0 96 96">
                                {/* Background track */}
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="38"
                                    className="text-muted/40"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                />
                                {/* Progress track */}
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="38"
                                    className="text-primary transition-all duration-500 ease-in-out"
                                    strokeWidth="8"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center text-center">
                                <span className="text-2xl font-bold tracking-tight tabular-nums">
                                    {Math.round(savingsRate)}%
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">
                                    Saved
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Dynamic Message & Insight Bullet Points */}
                    <div className="lg:col-span-8 flex flex-col justify-center space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold tracking-tight text-foreground">
                                {savingsRate >= 20
                                    ? "You're maintaining a healthy and consistent financial pace"
                                    : "Review your spending habits to boost your savings score"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Based on your current income and tracked expense activity.
                            </p>
                        </div>

                        {/* Bulleted Insights List matching style */}
                        <div className="space-y-2.5 pt-1">
                            {insights.map((insight, index) => (
                                <div
                                    key={`${insight}-${index}`}
                                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                                >
                                    <span className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <p className="leading-snug text-foreground/90">{insight}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Optional footer metric metrics grid if you still want quick visibility of changes */}
                <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-border/40">
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground font-medium">Income</span>
                        <p className="text-sm font-bold">{formatCurrency(totalIncome, currency)}</p>
                        <ChangeIndicator value={incomeChange} hasPreviousValue={incomeHasPreviousData} />
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground font-medium">Expenses</span>
                        <p className="text-sm font-bold">{formatCurrency(totalExpenses, currency)}</p>
                        <ChangeIndicator value={expenseChange} positiveIsGood={false} hasPreviousValue={expensesHavePreviousData} />
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground font-medium">Savings Rate</span>
                        <p className="text-sm font-bold">{Math.round(savingsRate)}%</p>
                        <ChangeIndicator value={savingsRateChange} hasPreviousValue={savingsHasPreviousData} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}