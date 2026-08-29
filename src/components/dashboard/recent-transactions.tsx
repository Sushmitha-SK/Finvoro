import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { recentTransactions } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format-currency";

export function RecentTransactions() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent transactions</CardTitle>

                <span className="text-sm font-medium text-primary">
                    View all
                </span>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {recentTransactions.map((transaction) => {
                        const isIncome = transaction.type === "income";

                        return (
                            <div
                                key={transaction.id}
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
                                        {transaction.description}
                                    </p>

                                    <div className="mt-0.5 flex items-center gap-2">
                                        <Badge variant="secondary">
                                            {transaction.category}
                                        </Badge>

                                        <span className="text-xs text-muted-foreground">
                                            {transaction.date}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={`text-sm font-semibold ${isIncome
                                            ? "text-emerald-600"
                                            : "text-foreground"
                                        }`}
                                >
                                    {isIncome ? "+" : "-"}
                                    {formatCurrency(transaction.amount)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}