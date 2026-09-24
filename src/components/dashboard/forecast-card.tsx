"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMoney } from "@/stores/app-store";
import type { DashboardData } from "@/types/finance";

import { MoneyTooltip } from "./chart-tooltip";

export function ForecastCard({ data }: { data: DashboardData }) {
    const money = useMoney();
    const { forecast, month } = data;
    const pace = forecast.paceVsLastMonth;

    return (
        <Card className="h-full border-border/60 bg-linear-to-b from-card/50 to-card shadow-xs transition-all hover:border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-4">
                <div className="space-y-1.5">
                    <CardTitle className="text-lg font-semibold tracking-tight">Month-end forecast</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground/85">
                        Day {month.daysElapsed} of {month.daysInMonth}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6 pt-0">
                <div className="grid grid-cols-2 gap-3.5">
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/60">
                        <p className="text-xs font-medium text-muted-foreground">Projected spend</p>
                        <p className="mt-1 text-xl font-bold tracking-tight text-foreground">{money(forecast.projectedExpenses)}</p>
                        {pace !== null && (
                            <p className={pace > 10 ? "mt-1 text-xs font-medium text-rose-600 dark:text-rose-400" : "mt-1 text-xs text-muted-foreground"}>
                                {pace > 0 ? "+" : ""}
                                {Math.round(pace)}% vs last month
                            </p>
                        )}
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/60">
                        <p className="text-xs font-medium text-muted-foreground">Projected savings</p>
                        <p className={forecast.projectedSavings < 0 ? "mt-1 text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400" : "mt-1 text-xl font-bold tracking-tight text-foreground"}>
                            {money(forecast.projectedSavings)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            of <span className="font-medium text-foreground">{money(forecast.expectedIncome, { compact: true })}</span> income
                        </p>
                    </div>
                </div>

                {forecast.dailyAllowance !== null && (
                    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3.5 text-xs text-sky-900 dark:text-sky-200 leading-relaxed">
                        You can spend about <strong className="font-semibold text-foreground">{money(forecast.dailyAllowance)}</strong>/day for the next {forecast.daysLeft} days and stay within your budgets.
                    </div>
                )}

                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Cumulative spending vs last month</p>
                    <div className="h-32 w-full pt-1" role="img" aria-label="Line chart comparing cumulative spending this month with last month">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.spendingPace} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} interval={6} dy={6} />
                                <Tooltip content={(props) => <MoneyTooltip {...props} label={props.label ? `Day ${props.label}` : undefined} />} />
                                <Line type="monotone" dataKey="previous" name="Last month" stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} opacity={0.7} />
                                <Line type="monotone" dataKey="current" name="This month" stroke="#0ea5e9" strokeWidth={2.5} dot={false} connectNulls={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}