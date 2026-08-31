import {
    AlertCircle,
    CheckCircle2,
    PiggyBank,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DeleteBudgetDialog } from "./delete-budget-dialog";
import { EditBudgetDialog } from "./edit-budget-dialog";
import { formatCurrency } from "@/lib/format-currency";

type Budget = {
    id: string;
    category: string;
    categoryId: string;
    amount: number;
    spent: number;
    remaining: number;
    percentage: number;
    month: number;
    year: number;
};

type Category = {
    id: string;
    name: string;
};

type BudgetOverviewProps = {
    budgets: Budget[];
    categories: Category[];
    currency: string;
};

const monthFormatter = new Intl.DateTimeFormat(
    "en-IN",
    {
        month: "long",
        year: "numeric",
    },
);

function getBudgetMonth(month: number, year: number) {
    return monthFormatter.format(
        new Date(year, month - 1, 1),
    );
}

export function BudgetOverview({
    budgets,
    categories,
    currency,
}: BudgetOverviewProps) {
    if (budgets.length === 0) {
        return (
            <Card>
                <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                        <PiggyBank className="size-5 text-muted-foreground" />
                    </div>

                    <h2 className="mt-4 font-semibold">
                        No budgets yet
                    </h2>

                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        Create your first budget to start tracking
                        your spending.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {budgets.map((budget) => {
                const isExceeded =
                    budget.spent > budget.amount;

                const isNearLimit =
                    !isExceeded &&
                    budget.percentage >= 80;

                return (
                    <Card key={budget.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <CardTitle className="text-base">
                                        {budget.category}
                                    </CardTitle>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {getBudgetMonth(
                                            budget.month,
                                            budget.year,
                                        )}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {isExceeded ? (
                                        <AlertCircle className="size-5 text-destructive" />
                                    ) : isNearLimit ? (
                                        <AlertCircle className="size-5 text-amber-500" />
                                    ) : (
                                        <CheckCircle2 className="size-5 text-emerald-500" />
                                    )}

                                    <EditBudgetDialog
                                        budget={budget}
                                        categories={categories}
                                    />

                                    <DeleteBudgetDialog
                                        budgetId={budget.id}
                                        category={budget.category}
                                    />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-semibold tracking-tight">
                                        {formatCurrency(
                                            budget.spent,
                                            currency,
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        of{" "}
                                        {formatCurrency(
                                            budget.amount,
                                            currency,
                                        )}
                                    </p>
                                </div>

                                <span className="text-sm font-medium">
                                    {Math.round(
                                        budget.percentage,
                                    )}
                                    %
                                </span>
                            </div>

                            <Progress
                                value={budget.percentage}
                                className="mt-4"
                            />

                            <div className="mt-3 flex items-center justify-between text-xs">
                                <span
                                    className={
                                        isExceeded
                                            ? "font-medium text-destructive"
                                            : "text-muted-foreground"
                                    }
                                >
                                    {isExceeded
                                        ? `${formatCurrency(
                                            budget.spent -
                                            budget.amount,
                                            currency,
                                        )} over budget`
                                        : `${formatCurrency(
                                            budget.remaining,
                                            currency,
                                        )} remaining`}
                                </span>

                                <span className="text-muted-foreground">
                                    {budget.percentage >=
                                        100
                                        ? "Limit reached"
                                        : isNearLimit
                                            ? "Near limit"
                                            : "On track"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}