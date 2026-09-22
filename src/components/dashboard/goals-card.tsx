"use client";

import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMoney } from "@/stores/app-store";
import type { GoalSummary } from "@/types/finance";

export function GoalsCard({ goals }: { goals: GoalSummary[] }) {
    const money = useMoney();

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Savings goals</CardTitle>
                <CardDescription>What you&apos;re working toward</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {goals.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        <p>No goals yet.</p>
                        <Link href="/goals" className="mt-1 inline-block text-primary hover:underline">
                            Set your first goal
                        </Link>
                    </div>
                ) : (
                    goals.slice(0, 4).map((goal) => (
                        <div key={goal.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{goal.name}</span>
                                <span className="text-xs text-muted-foreground">{Math.round(goal.percentage)}%</span>
                            </div>
                            <div
                                className="h-2 overflow-hidden rounded-full bg-muted"
                                role="progressbar"
                                aria-valuenow={Math.round(goal.percentage)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={goal.name}
                            >
                                <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${goal.percentage}%`, background: goal.color ?? "#10b981" }} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {money(goal.currentAmount, { compact: true })} of {money(goal.targetAmount, { compact: true })}
                                {goal.monthlyNeeded !== null && ` · ${money(goal.monthlyNeeded, { compact: true })}/mo to stay on track`}
                            </p>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
