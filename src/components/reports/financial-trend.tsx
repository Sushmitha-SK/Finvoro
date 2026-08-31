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
    currency: string;
};

function formatTooltipValue(
    value: number,
    currency: string,
) {
    return formatCurrency(value, currency);
}

function formatAxisValue(
    value: number,
    currency: string,
) {
    const currencySymbols: Record<string, string> = {
        INR: "₹",
        USD: "$",
        EUR: "€",
        GBP: "£",
        AED: "د.إ",
    };

    const symbol =
        currencySymbols[currency] ?? currency;

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
    const hasTransactions = data.some(
        (item) =>
            item.income > 0 ||
            item.expenses > 0,
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Financial trend
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                    Compare your income, expenses, and net balance
                    over the selected period.
                </p>
            </CardHeader>

            <CardContent>
                {!hasTransactions ? (
                    <div className="flex min-h-72 items-center justify-center text-center">
                        <div>
                            <p className="font-medium">
                                No transactions for this period
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Your financial trend will appear here
                                when you have income or expenses.
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
                                    left: 0,
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
                                    minTickGap={24}
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={12}
                                    width={60}
                                    tickFormatter={(value) =>
                                        formatAxisValue(
                                            Number(value),
                                            currency,
                                        )
                                    }
                                />

                                <Tooltip
                                    cursor={{
                                        strokeDasharray: "4 4",
                                    }}
                                    contentStyle={{
                                        borderRadius: "0.75rem",
                                        border: "1px solid var(--border)",
                                        backgroundColor:
                                            "var(--background)",
                                        color: "var(--foreground)",
                                    }}
                                    formatter={(value, name) => [
                                        formatTooltipValue(
                                            Number(value),
                                            currency,
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
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="line"
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