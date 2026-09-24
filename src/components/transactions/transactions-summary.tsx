"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMoney } from "@/stores/app-store";
import { ArrowDownRight, ArrowUpRight, Minus, Receipt } from "lucide-react";

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
        {
            label: filtered ? "Matching transactions" : "Total transactions",
            value: count.toLocaleString("en-IN"),
            tone: "text-foreground",
            icon: Receipt,
            iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        },
        {
            label: "Total Income",
            value: money(income),
            tone: "text-emerald-600 dark:text-emerald-400",
            icon: ArrowUpRight,
            iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        },
        {
            label: "Total Expenses",
            value: money(expenses),
            tone: "text-foreground",
            icon: ArrowDownRight,
            iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        },
        {
            label: "Net Balance",
            value: `${net < 0 ? "−" : ""}${money(Math.abs(net))}`,
            tone: net < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400",
            icon: Minus,
            iconBg: net < 0 ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <Card
                        key={item.label}
                        size="sm"
                        className="group relative overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-sm"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-muted-foreground">
                                    {item.label}
                                </p>
                                <div className={cn("flex h-7 w-7 items-center justify-center rounded-md transition-transform duration-200 group-hover:scale-110", item.iconBg)}>
                                    <Icon className="h-3.5 w-3.5" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className={cn("text-xl font-bold tracking-tight", item.tone)}>
                                    {item.value}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}