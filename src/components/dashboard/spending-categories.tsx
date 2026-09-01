import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { formatCurrency } from "@/lib/format-currency";

type SpendingCategory = {
    name: string;
    amount: number;
    percentage: number;
};

type SpendingCategoriesProps = {
    spendingCategories: SpendingCategory[];
    currency: string,
};

export function SpendingCategories({
    spendingCategories,
    currency,
}: SpendingCategoriesProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>
                    Spending by category
                </CardTitle>
            </CardHeader>

            <CardContent>
                {spendingCategories.length > 0 ? (
                    <div className="space-y-5">
                        {spendingCategories.map(
                            (category) => (
                                <div
                                    key={category.name}
                                >
                                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                        <span className="truncate font-medium">
                                            {
                                                category.name
                                            }
                                        </span>

                                        <span className="shrink-0 text-muted-foreground tabular-nums">
                                            {formatCurrency(
                                                category.amount,
                                                currency,
                                            )}
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{
                                                width: `${category.percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                ) : (
                    <div className="flex min-h-32 items-center justify-center text-center">
                        <p className="text-sm text-muted-foreground">
                            No expenses recorded this
                            month.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
