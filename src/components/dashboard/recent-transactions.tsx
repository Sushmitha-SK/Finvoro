import Link from "next/link";
import {
    ArrowDownRight,
    ArrowUpRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { formatCurrency } from "@/lib/format-currency";

type RecentTransaction = {
    id: string;
    description: string;
    category: string;
    type: "income" | "expense";
    amount: number;
    date: Date;
};

type RecentTransactionsProps = {
    transactions: RecentTransaction[];
};

export function RecentTransactions({
    transactions,
}: RecentTransactionsProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    Recent transactions
                </CardTitle>

                <Link
                    href="/transactions"
                    className="text-sm font-medium text-primary hover:underline"
                >
                    View all
                </Link>
            </CardHeader>

            <CardContent>
                {transactions.length > 0 ? (
                    <div className="space-y-4">
                        {transactions.map(
                            (transaction) => {
                                const isIncome =
                                    transaction.type ===
                                    "income";

                                return (
                                    <div
                                        key={
                                            transaction.id
                                        }
                                        className="flex items-center gap-3"
                                    >
                                        <div
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-full ${isIncome
                                                ? "bg-emerald-500/10 text-emerald-600"
                                                : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {isIncome ? (
                                                <ArrowUpRight className="size-4" />
                                            ) : (
                                                <ArrowDownRight className="size-4" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {
                                                    transaction.description
                                                }
                                            </p>

                                            <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                                <Badge variant="secondary">
                                                    {
                                                        transaction.category
                                                    }
                                                </Badge>

                                                <span className="text-xs text-muted-foreground">
                                                    {transaction.date.toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            className={`shrink-0 text-sm font-semibold tabular-nums ${isIncome
                                                ? "text-emerald-600"
                                                : "text-foreground"
                                                }`}
                                        >
                                            {isIncome
                                                ? "+"
                                                : "-"}
                                            {formatCurrency(
                                                transaction.amount,
                                            )}
                                        </span>
                                    </div>
                                );
                            },
                        )}
                    </div>
                ) : (
                    <div className="flex min-h-32 items-center justify-center text-center">
                        <p className="text-sm text-muted-foreground">
                            No transactions yet.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
