import {
    ArrowDownRight,
    ArrowUpRight,
    PiggyBank,
    Wallet,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { financialSummary } from "@/lib/mock-data";

const cards = [
    {
        title: "Total Balance",
        value: formatCurrency(financialSummary.balance),
        description: "Available balance",
        icon: Wallet,
        trend: "+12.5%",
        trendType: "positive",
    },
    {
        title: "Total Income",
        value: formatCurrency(financialSummary.income),
        description: "This month",
        icon: ArrowUpRight,
        trend: "+8.2%",
        trendType: "positive",
    },
    {
        title: "Total Expenses",
        value: formatCurrency(financialSummary.expenses),
        description: "This month",
        icon: ArrowDownRight,
        trend: "-4.3%",
        trendType: "positive",
    },
    {
        title: "Savings Rate",
        value: `${financialSummary.savingsRate}%`,
        description: "Of your income",
        icon: PiggyBank,
        trend: "+3.1%",
        trendType: "positive",
    },
] as const;

export function SummaryCards() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <Card key={card.title}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                                    <Icon className="size-4 text-muted-foreground" />
                                </div>

                                <span className="text-xs font-medium text-emerald-600">
                                    {card.trend}
                                </span>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground">
                                    {card.title}
                                </p>

                                <p className="mt-1 text-2xl font-semibold tracking-tight">
                                    {card.value}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}