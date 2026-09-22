"use client";

import { Repeat } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate, parseDateInput } from "@/lib/dates";
import { useMoney } from "@/stores/app-store";
import type { Subscription } from "@/types/finance";

export function SubscriptionsCard({ items, monthlyTotal }: { items: Subscription[]; monthlyTotal: number }) {
    const money = useMoney();

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Repeat className="size-4 text-muted-foreground" /> Recurring payments
                </CardTitle>
                <CardDescription>
                    {items.length > 0 ? `${money(monthlyTotal)} per month, detected automatically` : "Detected from your history"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Nothing recurring found yet. Charges that repeat at a steady interval show up here.
                    </p>
                ) : (
                    <ul className="divide-y">
                        {items.slice(0, 6).map((item) => (
                            <li key={item.key} className="flex items-center justify-between gap-3 py-2.5 text-sm first:pt-0 last:pb-0">
                                <div className="min-w-0">
                                    <p className="truncate font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Next ~{formatShortDate(parseDateInput(item.nextDate))} · {item.cadence}
                                    </p>
                                </div>
                                <span className="shrink-0 font-medium">{money(item.amount)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
