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
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Month-end forecast</CardTitle>
                <CardDescription>
                    Day {month.daysElapsed} of {month.daysInMonth}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-muted/60 p-3">
                        <p className="text-xs text-muted-foreground">Projected spend</p>
                        <p className="mt-0.5 text-lg font-semibold">{money(forecast.projectedExpenses)}</p>
                        {pace !== null && (
                            <p className={pace > 10 ? "text-xs text-rose-600 dark:text-rose-400" : "text-xs text-muted-foreground"}>
                                {pace > 0 ? "+" : ""}
                                {Math.round(pace)}% vs last month
                            </p>
                        )}
                    </div>
                    <div className="rounded-xl bg-muted/60 p-3">
                        <p className="text-xs text-muted-foreground">Projected savings</p>
                        <p className={forecast.projectedSavings < 0 ? "mt-0.5 text-lg font-semibold text-rose-600 dark:text-rose-400" : "mt-0.5 text-lg font-semibold"}>
                            {money(forecast.projectedSavings)}
                        </p>
                        <p className="text-xs text-muted-foreground">of {money(forecast.expectedIncome, { compact: true })} income</p>
                    </div>
                </div>

                {forecast.dailyAllowance !== null && (
                    <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
                        You can spend about <strong>{money(forecast.dailyAllowance)}</strong>/day for the next {forecast.daysLeft} days and stay
                        within your budgets.
                    </p>
                )}

                <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Cumulative spending vs last month</p>
                    <div className="h-32" role="img" aria-label="Line chart comparing cumulative spending this month with last month">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.spendingPace} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} interval={6} />
                                <Tooltip content={(props) => <MoneyTooltip {...props} label={props.label ? `Day ${props.label}` : undefined} />} />
                                <Line type="monotone" dataKey="previous" name="Last month" stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                                <Line type="monotone" dataKey="current" name="This month" stroke="#0ea5e9" strokeWidth={2.25} dot={false} connectNulls={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
