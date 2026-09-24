"use client";

import { Repeat, ArrowRight, Calendar } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate, parseDateInput } from "@/lib/dates";
import { useMoney } from "@/stores/app-store";
import type { Subscription } from "@/types/finance";

interface SubscriptionsCardProps {
    items: Subscription[];
    monthlyTotal: number;
    onViewAll?: () => void;
}

export function SubscriptionsCard({ items, monthlyTotal, onViewAll }: SubscriptionsCardProps) {
    const money = useMoney();
    const hasMore = items.length > 6;

    return (
        <Card className="h-full flex flex-col justify-between shadow-sm transition-all hover:shadow-md">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Repeat className="size-4" />
                    </div>
                    Recurring payments
                </CardTitle>
                <CardDescription>
                    {items.length > 0 ? (
                        <>
                            <span className="font-semibold text-foreground">{money(monthlyTotal)}</span> per month, automatically detected
                        </>
                    ) : (
                        "Detected from your history"
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Repeat className="size-5" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No recurring payments yet</p>
                        <p className="mt-1 text-xs text-muted-foreground max-w-[240px]">
                            Charges that repeat at a steady interval will automatically show up here.
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {items.slice(0, 6).map((item) => (
                            <li
                                key={item.key}
                                className="group flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        {item.name}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                        <Calendar className="size-3 shrink-0" />
                                        <span>Next ~{formatShortDate(parseDateInput(item.nextDate))}</span>
                                        <span>·</span>
                                        <span className="capitalize">{item.cadence}</span>
                                    </div>
                                </div>
                                <div className="shrink-0 text-right">
                                    <span className="text-sm font-semibold">{money(item.amount)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
            {hasMore && onViewAll && (
                <CardFooter className="pt-0 pb-4">
                    <button
                        onClick={onViewAll}
                        className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-2 border-t border-dashed"
                    >
                        <span>View all {items.length} subscriptions</span>
                        <ArrowRight className="size-3.5" />
                    </button>
                </CardFooter>
            )}
        </Card>
    );
}