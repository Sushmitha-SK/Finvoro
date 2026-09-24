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
    currency: string;
};

function getPercentageLabel(percentage: number) {
    if (percentage > 0 && percentage < 1) {
        return "<1%";
    }
    return `${Math.round(percentage)}%`;
}

export function SpendingByCategory({
    categories,
    currency,
}: SpendingByCategoryProps) {
    const totalExpenses = categories.reduce(
        (total, category) => total + category.amount,
        0,
    );

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-base font-semibold">Spending by category</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            See how your expenses are distributed across categories.
                        </p>
                    </div>

                    {categories.length > 0 && (
                        <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-xs text-muted-foreground">Total expenses</p>
                            <p className="mt-0.5 text-sm font-semibold tabular-nums">
                                {formatCurrency(totalExpenses, currency)}
                            </p>
                        </div>
                    )}
                </div>

                {categories.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 sm:hidden">
                        <ReceiptText className="size-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total expenses:</span>
                        <span className="text-sm font-semibold tabular-nums">
                            {formatCurrency(totalExpenses, currency)}
                        </span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-0">
                {categories.length === 0 ? (
                    <div className="flex min-h-56 flex-col items-center justify-center border-t border-dashed bg-muted/20 px-6 py-8 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                            <FolderOpen className="size-5 text-muted-foreground" />
                        </div>
                        <p className="mt-4 font-medium">No spending data</p>
                        <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            Add an expense to start seeing how your spending is distributed across categories.
                        </p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-y border-border/60 bg-muted/30 text-xs font-medium text-muted-foreground">
                                <tr>
                                    <th className="py-2.5 pl-6 pr-4">Category</th>
                                    <th className="px-4 py-2.5 text-right sm:text-left">Distribution</th>
                                    <th className="py-2.5 pl-4 pr-6 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {categories.map((category) => {
                                    const percentage = Math.max(
                                        0,
                                        Math.min(category.percentage, 100),
                                    );

                                    const barColor = category.color ?? "var(--primary)";

                                    return (
                                        <tr
                                            key={category.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            {/* Category Name & Icon */}
                                            <td className="py-3.5 pl-6 pr-4">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div
                                                        className="flex size-9 shrink-0 items-center justify-center rounded-full"
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
                                                            <span className="text-xs">{category.icon}</span>
                                                        ) : (
                                                            <FolderOpen className="size-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <span className="truncate font-medium leading-none">
                                                        {category.name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Progress Distribution Bar */}
                                            <td className="px-4 py-3.5 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${percentage}%`,
                                                                backgroundColor: barColor,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                                                        {getPercentageLabel(category.percentage)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className="py-3.5 pl-4 pr-6 text-right font-semibold tabular-nums">
                                                {formatCurrency(category.amount, currency)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}