"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMoney } from "@/stores/app-store";

export function TransactionsSummary({
    count,
    income,
    expenses,
    filtered,
}: {
    count: number;
    income: number;
    expenses: number;
    filtered: boolean;
}) {
    const money = useMoney();
    const net = income - expenses;

    const items = [
        { label: filtered ? "Matching transactions" : "Transactions", value: count.toLocaleString("en-IN"), tone: "" },
        { label: "Income", value: money(income), tone: "text-emerald-600 dark:text-emerald-400" },
        { label: "Expenses", value: money(expenses), tone: "" },
        { label: "Net", value: `${net < 0 ? "−" : ""}${money(Math.abs(net))}`, tone: net < 0 ? "text-rose-600 dark:text-rose-400" : "" },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {items.map((item) => (
                <Card key={item.label} size="sm">
                    <CardContent className="space-y-0.5 p-3.5">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className={cn("text-lg font-semibold tracking-tight", item.tone)}>{item.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
