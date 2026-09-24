"use client";

import { ArrowDownLeft, ArrowUpRight, ReceiptText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate, parseDateInput } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useMoney } from "@/stores/app-store";
import { useUIStore } from "@/stores/ui-store";
import type { RecentTransaction } from "@/types/finance";

export function RecentTransactions({ transactions }: { transactions: RecentTransaction[] }) {
    const money = useMoney();
    const openDialog = useUIStore((state) => state.openTransactionDialog);

    return (
        <Card className="h-full flex flex-col justify-between shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent transactions</CardTitle>
                <CardDescription>Your latest financial activity</CardDescription>
                <CardAction>
                    <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/transactions" />}>
                        View all
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent className="pb-3">
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <ReceiptText className="size-5" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No transactions yet</p>
                        <p className="mt-1 text-xs text-muted-foreground max-w-60">
                            Your recent income and expenses will appear here once recorded.
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {transactions.map((txn) => (
                            <li key={txn.id}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        openDialog({
                                            editingId: txn.id,
                                            prefill: {
                                                description: txn.description,
                                                amount: String(txn.amount),
                                                type: txn.type,
                                                category: txn.category,
                                                date: txn.date,
                                            },
                                        })
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm transition-colors hover:bg-muted/50"
                                >
                                    <span
                                        className={cn(
                                            "flex size-9 shrink-0 items-center justify-center rounded-full",
                                            txn.type === "income" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground",
                                        )}
                                    >
                                        {txn.type === "income" ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate font-medium text-foreground">{txn.description}</span>
                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                            <span className="size-1.5 rounded-full shrink-0" style={{ background: txn.categoryColor }} />
                                            <span className="truncate">{txn.category}</span>
                                            <span>·</span>
                                            <span className="shrink-0">{formatShortDate(parseDateInput(txn.date))}</span>
                                        </span>
                                    </span>
                                    <span
                                        className={cn(
                                            "shrink-0 font-semibold text-sm",
                                            txn.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
                                        )}
                                    >
                                        {txn.type === "income" ? "+" : "−"}
                                        {money(txn.amount)}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}