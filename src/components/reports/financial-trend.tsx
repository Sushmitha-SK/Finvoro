"use client";

import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
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
};

export function FinancialTrend({
    data,
}: FinancialTrendProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Financial trend
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                    Compare your income, expenses, and net balance
                    over time.
                </p>
            </CardHeader>

            <CardContent>
                {data.length === 0 ? (
                    <div className="flex min-h-72 items-center justify-center text-center">
                        <div>
                            <p className="font-medium">
                                No financial data yet
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Your financial trend will appear
                                here once you have transactions.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="h-80 w-full">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <LineChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 10,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={12}
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={12}
                                    tickFormatter={(value) =>
                                        formatCurrency(
                                            Number(value),
                                        )
                                    }
                                />

                                <Tooltip
                                    formatter={(value, name) => [
                                        formatCurrency(
                                            Number(value),
                                        ),
                                        name === "income"
                                            ? "Income"
                                            : name === "expenses"
                                                ? "Expenses"
                                                : "Net balance",
                                    ]}
                                    labelFormatter={(label) =>
                                        String(label)
                                    }
                                />

                                <Legend
                                    formatter={(value) =>
                                        value === "income"
                                            ? "Income"
                                            : value === "expenses"
                                                ? "Expenses"
                                                : "Net balance"
                                    }
                                />

                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    stroke="var(--chart-2)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke="var(--chart-1)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="net"
                                    stroke="var(--chart-3)"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}