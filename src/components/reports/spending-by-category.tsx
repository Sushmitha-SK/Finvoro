import { FolderOpen } from "lucide-react";

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

export function SpendingByCategory({
    categories,
}: SpendingByCategoryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Spending by category
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                    See where your money is going this month.
                </p>
            </CardHeader>

            <CardContent>
                {categories.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                            <FolderOpen className="size-5 text-muted-foreground" />
                        </div>

                        <p className="mt-4 font-medium">
                            No expenses yet
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Your spending breakdown will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {categories.map(
                            (category) => (
                                <div
                                    key={category.id}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div
                                                className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                                                style={
                                                    category.color
                                                        ? {
                                                            backgroundColor: `${category.color}20`,
                                                            color: category.color,
                                                        }
                                                        : undefined
                                                }
                                            >
                                                {category.icon ? (
                                                    <span>
                                                        {
                                                            category.icon
                                                        }
                                                    </span>
                                                ) : (
                                                    <FolderOpen className="size-4" />
                                                )}
                                            </div>

                                            <span className="truncate text-sm font-medium">
                                                {
                                                    category.name
                                                }
                                            </span>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-medium">
                                                {formatCurrency(
                                                    category.amount,
                                                )}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {Math.round(
                                                    category.percentage,
                                                )}
                                                %
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${Math.min(
                                                    category.percentage,
                                                    100,
                                                )}%`,
                                                backgroundColor:
                                                    category.color ??
                                                    "currentColor",
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}