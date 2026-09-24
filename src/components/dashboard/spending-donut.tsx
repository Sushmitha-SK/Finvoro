"use client";

import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

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
        <Card className="h-full transition-all duration-200 hover:border-border border-border/60 bg-linear-to-b from-card/50 to-card shadow-xs">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Spending by category</CardTitle>
                <CardDescription>This month's breakdown</CardDescription>
            </CardHeader>
            <CardContent>
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                            <PieChartIcon className="size-6" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No expenses yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Expenses logged this month will appear here.</p>
                    </div>
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
                                        paddingAngle={3}
                                        stroke="none"
                                    >
                                        {chartData.map((category) => (
                                            <Cell
                                                key={category.id}
                                                fill={category.color}
                                                className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={(props) => <MoneyTooltip {...props} />} />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs font-medium text-muted-foreground">Total</span>
                                <span className="text-xl font-bold tracking-tight">{money(total, { compact: true })}</span>
                            </div>
                        </div>

                        <ul className="space-y-1 pt-1">
                            {chartData.map((category) => (
                                <li
                                    key={category.id}
                                    className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                                        <span
                                            className="size-3 shrink-0 rounded-full shadow-xs"
                                            style={{ background: category.color }}
                                        />
                                        <span className="min-w-0 flex-1 truncate font-medium text-foreground/90 group-hover:text-foreground">
                                            {category.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-right">
                                        <span className="text-xs text-muted-foreground w-10">{category.percentage}%</span>
                                        <span className="w-20 font-semibold">{money(category.amount, { compact: true })}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-2 text-center">
                            <Link
                                href="/reports"
                                className="inline-flex text-xs font-medium text-primary hover:underline underline-offset-4"
                            >
                                View full breakdown in Reports &rarr;
                            </Link>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}