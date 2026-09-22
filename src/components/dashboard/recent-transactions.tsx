"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
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
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent transactions</CardTitle>
                <CardDescription>Your latest activity</CardDescription>
                <CardAction>
                    <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/transactions" />}>
                        View all
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No transactions yet.</p>
                ) : (
                    <ul className="divide-y">
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
                                    className="flex w-full items-center gap-3 rounded-lg py-3 text-left text-sm transition-colors first:pt-0 last:pb-0 hover:bg-muted/50"
                                >
                                    <span
                                        className={cn(
                                            "flex size-9 shrink-0 items-center justify-center rounded-full",
                                            txn.type === "income" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600",
                                        )}
                                    >
                                        {txn.type === "income" ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate font-medium">{txn.description}</span>
                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <span className="size-1.5 rounded-full" style={{ background: txn.categoryColor }} />
                                            {txn.category} · {formatShortDate(parseDateInput(txn.date))}
                                        </span>
                                    </span>
                                    <span className={cn("shrink-0 font-semibold", txn.type === "income" && "text-emerald-600 dark:text-emerald-400")}>
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
