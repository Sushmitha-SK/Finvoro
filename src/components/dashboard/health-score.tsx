"use client";

import { Info } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HealthScore } from "@/types/finance";

const toneFor = (score: number) =>
    score >= 80 ? "#10b981" : score >= 65 ? "#0ea5e9" : score >= 45 ? "#f59e0b" : "#f43f5e";

export function HealthScoreCard({ health }: { health: HealthScore }) {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const color = toneFor(health.score);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Financial health</CardTitle>
                <CardDescription>Based on this month so far</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="flex items-center gap-5">
                    <div className="relative size-28 shrink-0" role="img" aria-label={`Health score ${health.score} out of 100, ${health.label}`}>
                        <svg viewBox="0 0 128 128" className="size-full -rotate-90">
                            <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--muted)" strokeWidth="12" />
                            <circle
                                cx="64"
                                cy="64"
                                r={radius}
                                fill="none"
                                stroke={color}
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference * (1 - health.score / 100)}
                                className="transition-[stroke-dashoffset] duration-700"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-semibold leading-none">{health.score}</span>
                            <span className="text-[11px] text-muted-foreground">/ 100</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-lg font-semibold" style={{ color }}>
                            {health.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            A simple, transparent score — not a credit score.
                        </p>
                    </div>
                </div>

                <ul className="space-y-3">
                    {health.factors.map((factor) => (
                        <li key={factor.label} title={factor.hint}>
                            <div className="mb-1 flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    {factor.label}
                                    <Info className="size-3 opacity-50" />
                                </span>
                                <span className="font-medium">
                                    {factor.score}/{factor.max}
                                </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                <div
                                    className={cn("h-full rounded-full transition-[width] duration-700")}
                                    style={{ width: `${(factor.score / factor.max) * 100}%`, background: color }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
