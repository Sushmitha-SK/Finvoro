"use client";

import { useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { formatCurrency } from "@/lib/format-currency";

type FinancialTrendItem = {
    month: string;
    income: number;
    expenses: number;
    net: number;
};

type FinancialTrendProps = {
    data: FinancialTrendItem[];
    currency: string;
};

type ChartType = "area" | "bar";

function formatTooltipValue(value: number, currency: string) {
    return formatCurrency(value, currency);
}

function formatAxisValue(value: number, currency: string) {
    const currencySymbols: Record<string, string> = {
        INR: "₹",
        USD: "$",
        EUR: "€",
        GBP: "£",
        AED: "د.إ",
    };

    const symbol = currencySymbols[currency] ?? currency;

    if (value >= 100000) {
        return `${symbol}${Math.round(value / 100000)}L`;
    }
    if (value >= 1000) {
        return `${symbol}${Math.round(value / 1000)}K`;
    }

    return `${symbol}${Math.round(value)}`;
}

export function FinancialTrend({
    data,
    currency,
}: FinancialTrendProps) {
    const [chartType, setChartType] = useState<ChartType>("area");

    const hasTransactions = data.some(
        (item) => item.income > 0 || item.expenses > 0
    );

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-xl font-semibold">
                        Financial Trend
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Compare your income, expenses, and net balance over time.
                    </p>
                </div>

                {/* View Mode Toggle Buttons */}
                {hasTransactions && (
                    <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
                        <button
                            onClick={() => setChartType("area")}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                                chartType === "area"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "hover:text-foreground"
                            }`}
                        >
                            Area
                        </button>
                        <button
                            onClick={() => setChartType("bar")}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                                chartType === "bar"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "hover:text-foreground"
                            }`}
                        >
                            Bar
                        </button>
                    </div>
                )}
            </CardHeader>

            <CardContent>
                {!hasTransactions ? (
                    <div className="flex min-h-[320px] items-center justify-center text-center">
                        <div>
                            <p className="font-medium text-foreground">
                                No transactions for this period
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Your financial trend will appear here when you have income or expenses.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === "area" ? (
                                <AreaChart
                                    data={data}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.0} />
                                        </linearGradient>
                                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.0} />
                                        </linearGradient>
                                        <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} minTickGap={24} />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={65} tickFormatter={(value) => formatAxisValue(Number(value), currency)} />
                                    
                                    <Tooltip
                                        cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "4 4" }}
                                        contentStyle={{
                                            borderRadius: "0.75rem",
                                            border: "1px solid var(--border)",
                                            backgroundColor: "var(--background)",
                                            color: "var(--foreground)",
                                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                        }}
                                        formatter={(value, name) => [
                                            formatTooltipValue(Number(value), currency),
                                            name === "income" ? "Income" : name === "expenses" ? "Expenses" : "Net Balance",
                                        ]}
                                        labelFormatter={(label) => String(label)}
                                    />
                                    
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => (
                                            <span className="text-xs font-medium text-foreground mr-4">
                                                {value === "income" ? "Income" : value === "expenses" ? "Expenses" : "Net Balance"}
                                            </span>
                                        )}
                                    />

                                    <Area type="monotone" dataKey="income" stroke="var(--chart-2)" strokeWidth={2} fillOpacity={1} fill="url(#incomeGradient)" activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--background)" }} />
                                    <Area type="monotone" dataKey="expenses" stroke="var(--chart-1)" strokeWidth={2} fillOpacity={1} fill="url(#expenseGradient)" activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--background)" }} />
                                    <Area type="monotone" dataKey="net" stroke="var(--chart-3)" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#netGradient)" activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--background)" }} />
                                </AreaChart>
                            ) : (
                                <BarChart
                                    data={data}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} minTickGap={24} />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={65} tickFormatter={(value) => formatAxisValue(Number(value), currency)} />
                                    
                                    <Tooltip
                                        cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                                        contentStyle={{
                                            borderRadius: "0.75rem",
                                            border: "1px solid var(--border)",
                                            backgroundColor: "var(--background)",
                                            color: "var(--foreground)",
                                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                        }}
                                        formatter={(value, name) => [
                                            formatTooltipValue(Number(value), currency),
                                            name === "income" ? "Income" : name === "expenses" ? "Expenses" : "Net Balance",
                                        ]}
                                        labelFormatter={(label) => String(label)}
                                    />
                                    
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => (
                                            <span className="text-xs font-medium text-foreground mr-4">
                                                {value === "income" ? "Income" : value === "expenses" ? "Expenses" : "Net Balance"}
                                            </span>
                                        )}
                                    />

                                    <Bar dataKey="income" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expenses" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="net" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}