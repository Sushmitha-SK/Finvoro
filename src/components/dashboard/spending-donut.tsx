"use client";

import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMoney } from "@/stores/app-store";
import type { SpendingCategory } from "@/types/finance";

import { MoneyTooltip } from "./chart-tooltip";

export function SpendingDonut({ categories, total }: { categories: SpendingCategory[]; total: number }) {
    const money = useMoney();
    const top = categories.slice(0, 5);
    const rest = categories.slice(5);
    const chartData = rest.length
        ? [
            ...top,
            {
                id: "other",
                name: "Other",
                amount: rest.reduce((sum, c) => sum + c.amount, 0),
                percentage: rest.reduce((sum, c) => sum + c.percentage, 0),
                color: "#94a3b8",
                previousAmount: 0,
                icon: null,
            },
        ]
        : top;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Spending by category</CardTitle>
                <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
                {categories.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">No expenses yet this month.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="relative h-44" role="img" aria-label="Donut chart of spending by category">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="amount"
                                        nameKey="name"
                                        innerRadius="62%"
                                        outerRadius="92%"
                                        paddingAngle={2}
                                        stroke="none"
                                    >
                                        {chartData.map((category) => (
                                            <Cell key={category.id} fill={category.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={(props) => <MoneyTooltip {...props} />} />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs text-muted-foreground">Total</span>
                                <span className="text-lg font-semibold">{money(total, { compact: true })}</span>
                            </div>
                        </div>

                        <ul className="space-y-2">
                            {chartData.map((category) => (
                                <li key={category.id} className="flex items-center gap-2 text-sm">
                                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: category.color }} />
                                    <span className="min-w-0 flex-1 truncate">{category.name}</span>
                                    <span className="text-muted-foreground">{category.percentage}%</span>
                                    <span className="w-20 text-right font-medium">{money(category.amount, { compact: true })}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/reports" className="block text-center text-xs text-primary hover:underline">
                            Full breakdown in Reports
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
