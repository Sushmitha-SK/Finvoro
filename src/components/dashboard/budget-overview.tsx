import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { budgets } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format-currency";

export function BudgetOverview() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget overview</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    {budgets.map((budget) => {
                        const percentage = Math.min(
                            (budget.spent / budget.limit) * 100,
                            100,
                        );

                        const isNearLimit = percentage >= 80;

                        return (
                            <div key={budget.id}>
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {isNearLimit ? (
                                            <AlertCircle className="size-4 text-amber-500" />
                                        ) : (
                                            <CheckCircle2 className="size-4 text-emerald-500" />
                                        )}

                                        <span className="text-sm font-medium">
                                            {budget.category}
                                        </span>
                                    </div>

                                    <span className="text-sm text-muted-foreground">
                                        {formatCurrency(budget.spent)} /{" "}
                                        {formatCurrency(budget.limit)}
                                    </span>
                                </div>

                                <Progress value={percentage} />

                                <p className="mt-2 text-xs text-muted-foreground">
                                    {formatCurrency(
                                        Math.max(budget.limit - budget.spent, 0),
                                    )}{" "}
                                    remaining
                                </p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}