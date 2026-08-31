import {
    ArrowDownRight,
    ArrowUpRight,
    PiggyBank,
    Wallet,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";

type FinancialSummary = {
    balance: number;
    income: number;
    expenses: number;
    savingsRate: number;
};

type SummaryCardsProps = {
    financialSummary: FinancialSummary;
    currency: string;
};

export function SummaryCards({
    financialSummary,
    currency

}: SummaryCardsProps) {
    const cards = [
        {
            title: "Total Balance",
            value: formatCurrency(
                financialSummary.balance,
                currency,
            ),
            description: "Available balance",
            icon: Wallet,
        },
        {
            title: "Total Income",
            value: formatCurrency(
                financialSummary.income,
                currency,
            ),
            description: "This month",
            icon: ArrowUpRight,
        },
        {
            title: "Total Expenses",
            value: formatCurrency(
                financialSummary.expenses,
                currency,
            ),
            description: "This month",
            icon: ArrowDownRight,
        },
        {
            title: "Savings Rate",
            value: `${financialSummary.savingsRate}%`,
            description: "Of your income",
            icon: PiggyBank,
        },
    ];

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
