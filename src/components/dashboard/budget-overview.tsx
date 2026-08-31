import {
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format-currency";

type Budget = {
    id: string;
    category: string;
    spent: number;
    limit: number;
};

type BudgetOverviewProps = {
    budgets: Budget[];
    currency: string,
};

export function BudgetOverview({
    budgets,
    currency,
}: BudgetOverviewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Budget overview
                </CardTitle>
            </CardHeader>

            <CardContent>
                {budgets.length > 0 ? (
                    <div className="space-y-6">
                        {budgets.map((budget) => {
                            const percentage =
                                budget.limit > 0
                                    ? Math.min(
                                        (budget.spent /
                                            budget.limit) *
                                        100,
                                        100,
                                    )
                                    : 0;

                            const isNearLimit =
                                percentage >= 80;

                            return (
                                <div
                                    key={budget.id}
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {isNearLimit ? (
                                                <AlertCircle className="size-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle2 className="size-4 text-emerald-500" />
                                            )}

                                            <span className="text-sm font-medium">
                                                {
                                                    budget.category
                                                }
                                            </span>
                                        </div>

                                        <span className="text-sm text-muted-foreground">
                                            {formatCurrency(
                                                budget.spent,
                                                currency,
                                            )}{" "}
                                            /{" "}
                                            {formatCurrency(
                                                budget.limit,
                                                currency,
                                            )}
                                        </span>
                                    </div>

                                    <Progress
                                        value={
                                            percentage
                                        }
                                    />

                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {formatCurrency(
                                            Math.max(
                                                budget.limit -
                                                budget.spent,
                                                0,
                                            ),
                                            currency,
                                        )}{" "}
                                        remaining
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex min-h-32 items-center justify-center text-center">
                        <p className="text-sm text-muted-foreground">
                            No budgets set for this
                            month.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
