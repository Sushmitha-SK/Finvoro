"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { useAppStore } from "@/stores/app-store";
import type { CashflowPoint } from "@/types/finance";

import { MoneyTooltip } from "./chart-tooltip";

const tick = { fill: "var(--muted-foreground)", fontSize: 12 };

export function CashflowChart({ data }: { data: CashflowPoint[] }) {
    const currency = useAppStore((state) => state.currency);
    const hide = useAppStore((state) => state.hideAmounts);

    return (
        <Card className="h-full border-border/60 bg-linear-to-b from-card/50 to-card shadow-xs transition-all hover:border-border">
            <CardHeader className="space-y-1.5 p-6 pb-2">
                <CardTitle className="text-lg font-semibold tracking-tight">Cash flow</CardTitle>
                <CardDescription className="text-xs text-muted-foreground/80">
                    Income vs expenses over the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2">
                <div className="h-72 w-full pt-4" role="img" aria-label="Area chart of monthly income and expenses">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                                </linearGradient>
                                <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={tick} dy={8} />
                            <YAxis
                                hide={hide}
                                tickLine={false}
                                axisLine={false}
                                tick={tick}
                                width={56}
                                tickFormatter={(value: number) => formatCurrency(value, currency, { compact: true })}
                            />
                            <Tooltip content={(props) => <MoneyTooltip {...props} />} />
                            <Area 
                                type="monotone" 
                                dataKey="income" 
                                name="Income" 
                                stroke="#10b981" 
                                strokeWidth={2.5} 
                                fillOpacity={1} 
                                fill="url(#fillIncome)" 
                            />
                            <Area 
                                type="monotone" 
                                dataKey="expenses" 
                                name="Expenses" 
                                stroke="#f43f5e" 
                                strokeWidth={2.5} 
                                fillOpacity={1} 
                                fill="url(#fillExpenses)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}