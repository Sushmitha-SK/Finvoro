"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMoney } from "@/stores/app-store";
import type { BudgetProgress } from "@/types/finance";

const BAR = {
    ok: "bg-emerald-500",
    warning: "bg-amber-500",
    exceeded: "bg-rose-500"
} as const;

export function BudgetProgressCard({ budgets }: { budgets: BudgetProgress[] }) {
    const money = useMoney();

    return (
        <Card className="h-full transition-all duration-200  flex flex-col justify-between border-border/60 hover:border-border">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Budgets</CardTitle>
                <CardDescription>Progress this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                {budgets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center my-auto">
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                            <Wallet className="size-6" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No budgets set</p>
                        <p className="text-xs text-muted-foreground mt-1 mb-3">Create one or let AI suggest limits.</p>
                        <Link
                            href="/budgets"
                            className="inline-flex text-xs font-medium text-primary hover:underline underline-offset-4"
                        >
                            Set up budgets &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {budgets.map((budget) => {
                            const isExceeded = budget.status === "exceeded";
                            const isWarning = budget.status === "warning";

                            return (
                                <div
                                    key={budget.id}
                                    className="space-y-1.5 rounded-lg p-2 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-foreground/90">{budget.category}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-xs font-medium",
                                                isExceeded ? "text-rose-600 dark:text-rose-400" :
                                                    isWarning ? "text-amber-600 dark:text-amber-400" :
                                                        "text-muted-foreground"
                                            )}>
                                                {Math.round(budget.percentage)}%
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                ({money(budget.spent, { compact: true })} / {money(budget.limit, { compact: true })})
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="h-2 overflow-hidden rounded-full bg-muted"
                                        role="progressbar"
                                        aria-valuenow={Math.round(budget.percentage)}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={`${budget.category} budget`}
                                    >
                                        <div
                                            className={cn("h-full rounded-full transition-[width] duration-700", BAR[budget.status])}
                                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {budgets.length > 0 && (
                    <div className="pt-2 text-center border-t border-border/40">
                        <Link
                            href="/budgets"
                            className="inline-flex text-xs font-medium text-primary hover:underline underline-offset-4"
                        >
                            Manage all budgets &rarr;
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}