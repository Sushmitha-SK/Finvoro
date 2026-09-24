"use client";

import { Info, TrendingUp } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HealthScore } from "@/types/finance";

const toneFor = (score: number) =>
    score >= 80
        ? "#10b981"
        : score >= 65
            ? "#0ea5e9"
            : score >= 45
                ? "#f59e0b"
                : "#f43f5e";

const bgToneFor = (score: number) =>
    score >= 80
        ? "bg-emerald-500/10"
        : score >= 65
            ? "bg-sky-500/10"
            : score >= 45
                ? "bg-amber-500/10"
                : "bg-rose-500/10";

export function HealthScoreCard({ health }: { health: HealthScore }) {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(health.score, 0), 100);
    const color = toneFor(progress);

    return (
        <Card className="group relative h-full overflow-hidden border-border/60 bg-card/95 shadow-sm transition-all duration-300 hover:border-border">
            {/* Ambient glow */}


            <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-base font-semibold tracking-tight">
                            Financial health
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Based on this month so far
                        </CardDescription>
                    </div>

                    <div
                        className={cn(
                            "flex size-9 items-center justify-center rounded-xl",
                            bgToneFor(progress),
                        )}
                    >
                        <TrendingUp
                            className="size-4"
                            style={{ color }}
                            strokeWidth={2.2}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative space-y-6">
                {/* Score */}
                <div className="flex items-center gap-5">
                    <div
                        className="relative size-28 shrink-0"
                        role="img"
                        aria-label={`Health score ${health.score} out of 100, ${health.label}`}
                    >
                        <svg
                            viewBox="0 0 128 128"
                            className="size-full -rotate-90"
                        >
                            {/* Track */}
                            <circle
                                cx="64"
                                cy="64"
                                r={radius}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="11"
                                className="text-muted/60"
                            />

                            {/* Progress */}
                            <circle
                                cx="64"
                                cy="64"
                                r={radius}
                                fill="none"
                                stroke={color}
                                strokeWidth="11"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={
                                    circumference *
                                    (1 - progress / 100)
                                }
                                className="transition-[stroke-dashoffset] duration-1000 ease-out"
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[30px] font-bold tracking-tight">
                                {health.score}
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground">
                                OUT OF 100
                            </span>
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                            style={{
                                color,
                                backgroundColor: `${color}15`,
                            }}
                        >
                            {health.label}
                        </div>

                        <p className="mt-2 max-w-55 text-xs leading-5 text-muted-foreground">
                            A simple, transparent snapshot of your financial
                            habits — not a credit score.
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/60" />

                {/* Factors */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Score breakdown
                        </p>
                        <span className="text-[11px] text-muted-foreground">
                            {health.factors.length} factors
                        </span>
                    </div>

                    <ul className="space-y-4">
                        {health.factors.map((factor) => {
                            const percentage = Math.min(
                                Math.max(
                                    (factor.score / factor.max) * 100,
                                    0,
                                ),
                                100,
                            );

                            return (
                                <li key={factor.label} className="group/factor">
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-foreground/80">
                                            <span className="truncate">
                                                {factor.label}
                                            </span>

                                            <span
                                                title={factor.hint}
                                                className="cursor-help"
                                            >
                                                <Info className="size-3 shrink-0 text-muted-foreground/50 transition-colors group-hover/factor:text-muted-foreground" />
                                            </span>
                                        </span>

                                        <span className="shrink-0 text-xs font-semibold tabular-nums">
                                            {factor.score}
                                            <span className="font-normal text-muted-foreground">
                                                /{factor.max}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="relative h-2 overflow-hidden rounded-full bg-muted/70">
                                        <div
                                            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-1000 ease-out"
                                            style={{
                                                width: `${percentage}%`,
                                                background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                                            }}
                                        />

                                        {/* Subtle shine */}
                                        <div
                                            className="absolute inset-y-0 left-0 rounded-full opacity-30"
                                            style={{
                                                width: `${percentage}%`,
                                                background:
                                                    "linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent)",
                                            }}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}