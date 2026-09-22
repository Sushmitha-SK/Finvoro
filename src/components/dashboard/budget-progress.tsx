"use client";

import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMoney } from "@/stores/app-store";
import type { BudgetProgress } from "@/types/finance";

const BAR = { ok: "bg-emerald-500", warning: "bg-amber-500", exceeded: "bg-rose-500" } as const;

export function BudgetProgressCard({ budgets }: { budgets: BudgetProgress[] }) {
    const money = useMoney();

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Budgets</CardTitle>
                <CardDescription>Progress this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {budgets.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        <p>No budgets set for this month.</p>
                        <Link href="/budgets" className="mt-1 inline-block text-primary hover:underline">
                            Create one, or let AI suggest limits
                        </Link>
                    </div>
                ) : (
                    budgets.map((budget) => (
                        <div key={budget.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{budget.category}</span>
                                <span className={cn("text-xs", budget.status === "exceeded" ? "font-medium text-rose-600 dark:text-rose-400" : "text-muted-foreground")}>
                                    {money(budget.spent, { compact: true })} / {money(budget.limit, { compact: true })}
                                </span>
                            </div>
                            <div
                                className="h-2 overflow-hidden rounded-full bg-muted"
                                role="progressbar"
                                aria-valuenow={Math.round(budget.percentage)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${budget.category} budget`}
                            >
                                <div className={cn("h-full rounded-full transition-[width] duration-700", BAR[budget.status])} style={{ width: `${Math.min(budget.percentage, 100)}%` }} />
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
