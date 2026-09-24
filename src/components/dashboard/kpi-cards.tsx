"use client";

import { ArrowDownRight, ArrowUpRight, Minus, PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { percentChange } from "@/lib/data/analytics";
import { cn } from "@/lib/utils";
import { useAppStore, useMoney } from "@/stores/app-store";
import type { DashboardData } from "@/types/finance";

import { Sparkline } from "./sparkline";

type Delta = { text: string; tone: "good" | "bad" | "neutral" };

function DeltaChip({ delta }: { delta: Delta | null }) {
    if (!delta) return <span className="text-xs text-muted-foreground/70">No prior data</span>;

    const Icon = delta.tone === "neutral" ? Minus : delta.tone === "good" ? ArrowUpRight : ArrowDownRight;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold tracking-tight transition-colors",
                delta.tone === "good" && "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
                delta.tone === "bad" && "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
                delta.tone === "neutral" && "bg-muted text-muted-foreground",
            )}
        >
            <Icon className="size-3 stroke-[2.5]" />
            {delta.text}
        </span>
    );
}

function Kpi({
    title,
    value,
    icon,
    delta,
    series,
    color,
}: {
    title: string;
    value: ReactNode;
    icon: ReactNode;
    delta: Delta | null;
    series: number[];
    color: string;
}) {
    return (
        <Card className="group relative overflow-hidden border-border/60 bg-gradient-to-b from-card/50 to-card transition-all hover:border-border hover:shadow-sm">
            <CardContent className="flex flex-col justify-between gap-4 p-5">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-muted/80 text-foreground/80 shadow-xs transition-transform group-hover:scale-105 [&_svg]:size-4">{icon}</span>
                        {title}
                    </div>
                </div>
                
                <div className="flex items-end justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                        <p className="truncate text-2xl font-bold tracking-tight text-foreground">{value}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <DeltaChip delta={delta} />
                            <span className="text-[11px] text-muted-foreground/80 font-normal">vs last month</span>
                        </div>
                    </div>
                    <div className="pb-1">
                        <Sparkline values={series} color={color} className="h-10 w-28 shrink-0 opacity-85 transition-opacity group-hover:opacity-100" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function KpiCards({ data }: { data: DashboardData }) {
    const money = useMoney();
    const hide = useAppStore((state) => state.hideAmounts);

    const pct = (current: number, previous: number, higherIsBetter: boolean): Delta | null => {
        const change = percentChange(current, previous);

        if (change === null) return null;

        const rounded = Math.round(change);

        if (rounded === 0) return { text: "0%", tone: "neutral" };

        return {
            text: `${rounded > 0 ? "+" : ""}${rounded}%`,
            tone: rounded > 0 === higherIsBetter ? "good" : "bad",
        };
    };

    const points = data.previousToDate.savingsRate;
    const savingsDiff = data.month.savingsRate - points;
    const savingsDelta: Delta | null =
        data.previousToDate.income > 0
            ? {
                text: `${savingsDiff > 0 ? "+" : ""}${savingsDiff} pts`,
                tone: savingsDiff === 0 ? "neutral" : savingsDiff > 0 ? "good" : "bad",
            }
            : null;

    const netByMonth = data.cashflow.map((point) => point.net);
    const startBalance = data.balance - netByMonth.reduce((a, b) => a + b, 0);
    const balanceSeries = netByMonth.reduce<number[]>(
        (series, net) => [...series, (series[series.length - 1] ?? startBalance) + net],
        [],
    );

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi
                title="Total balance"
                value={money(data.balance)}
                icon={<Wallet />}
                delta={
                    data.month.net === 0
                        ? null
                        : { text: `${data.month.net > 0 ? "+" : "−"}${hide ? "••••" : money(Math.abs(data.month.net), { compact: true })}`, tone: data.month.net > 0 ? "good" : "bad" }
                }
                series={balanceSeries}
                color="#0ea5e9"
            />
            <Kpi
                title="Income"
                value={money(data.month.income)}
                icon={<TrendingUp />}
                delta={pct(data.month.income, data.previousToDate.income, true)}
                series={data.cashflow.map((p) => p.income)}
                color="#10b981"
            />
            <Kpi
                title="Expenses"
                value={money(data.month.expenses)}
                icon={<TrendingDown />}
                delta={pct(data.month.expenses, data.previousToDate.expenses, false)}
                series={data.cashflow.map((p) => p.expenses)}
                color="#f43f5e"
            />
            <Kpi
                title="Savings rate"
                value={`${data.month.savingsRate}%`}
                icon={<PiggyBank />}
                delta={savingsDelta}
                series={data.cashflow.map((p) => p.savingsRate)}
                color="#8b5cf6"
            />
        </div>
    );
}