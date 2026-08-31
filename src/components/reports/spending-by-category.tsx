import {
    FolderOpen,
    ReceiptText,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { formatCurrency } from "@/lib/format-currency";

type SpendingCategory = {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    amount: number;
    percentage: number;
};

type SpendingByCategoryProps = {
    categories: SpendingCategory[];
};

function getPercentageLabel(
    percentage: number,
) {
    if (percentage > 0 && percentage < 1) {
        return "<1%";
    }

    return `${Math.round(percentage)}%`;
}

export function SpendingByCategory({
    categories,
}: SpendingByCategoryProps) {
    const totalExpenses = categories.reduce(
        (total, category) =>
            total + category.amount,
        0,
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle>
                            Spending by category
                        </CardTitle>

                        <p className="mt-1 text-sm text-muted-foreground">
                            See how your expenses are distributed
                            across categories.
                        </p>
                    </div>

                    {categories.length > 0 && (
                        <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-xs text-muted-foreground">
                                Total expenses
                            </p>

                            <p className="mt-0.5 text-sm font-semibold">
                                {formatCurrency(
                                    totalExpenses,
                                )}
                            </p>
                        </div>
                    )}
                </div>

                {categories.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 sm:hidden">
                        <ReceiptText className="size-4 text-muted-foreground" />

                        <span className="text-sm text-muted-foreground">
                            Total expenses:
                        </span>

                        <span className="text-sm font-semibold">
                            {formatCurrency(
                                totalExpenses,
                            )}
                        </span>
                    </div>
                )}
            </CardHeader>

            <CardContent>
                {categories.length === 0 ? (
                    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                            <FolderOpen className="size-5 text-muted-foreground" />
                        </div>

                        <p className="mt-4 font-medium">
                            No spending data
                        </p>

                        <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            Add an expense to start seeing how your
                            spending is distributed across categories.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {categories.map(
                            (category) => {
                                const percentage =
                                    Math.max(
                                        0,
                                        Math.min(
                                            category.percentage,
                                            100,
                                        ),
                                    );

                                const barColor =
                                    category.color ??
                                    "var(--primary)";

                                return (
                                    <div
                                        key={category.id}
                                        className="space-y-2.5"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div
                                                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                                                    style={
                                                        category.color
                                                            ? {
                                                                backgroundColor:
                                                                    `${category.color}20`,
                                                                color:
                                                                    category.color,
                                                            }
                                                            : undefined
                                                    }
                                                >
                                                    {category.icon ? (
                                                        <span className="text-sm">
                                                            {
                                                                category.icon
                                                            }
                                                        </span>
                                                    ) : (
                                                        <FolderOpen className="size-4" />
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">
                                                        {
                                                            category.name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {
                                                            getPercentageLabel(
                                                                category.percentage,
                                                            )
                                                        }{" "}
                                                        of total
                                                        spending
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="shrink-0 text-sm font-semibold">
                                                {formatCurrency(
                                                    category.amount,
                                                )}
                                            </p>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor:
                                                        barColor,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}