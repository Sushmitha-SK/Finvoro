"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
} from "lucide-react";
import { insights } from "@/config/landing-content";



type Insight = (typeof insights)[number];

const typeStyles: Record<Insight["type"], { badge: string; icon: string; progressBg: string }> = {
    positive: {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: "text-emerald-600 bg-emerald-50 border-emerald-200",
        progressBg: "bg-emerald-500",
    },
    neutral: {
        badge: "bg-sky-50 text-sky-700 border-sky-200",
        icon: "text-sky-600 bg-sky-50 border-sky-200",
        progressBg: "bg-sky-500",
    },
    warning: {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        icon: "text-amber-600 bg-amber-50 border-amber-200",
        progressBg: "bg-amber-500",
    },
};

function InsightCard({
    insight,
    index,
    total,
}: {
    insight: Insight;
    index: number;
    total: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "start start"],
    });

    const targetScale = 1 - (total - 1 - index) * 0.04;
    const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
    const Icon = insight.icon;
    const styles = typeStyles[insight.type];

    return (
        <div
            ref={ref}
            className="min-h-85 sticky top-28 flex items-start"
            style={{ top: `${112 + index * 24}px` }}
        >
            <motion.div
                style={{ scale }}
                className="w-full rounded-2xl border bg-card p-6 sm:p-7 shadow-[0_8px_32px_rgba(4,39,24,0.06)] origin-top flex flex-col justify-between"
            >
                <div>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
                            >
                                <Icon className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    {insight.label}
                                </p>
                                <span className="text-[11px] text-muted-foreground/70">
                                    {insight.timestamp}
                                </span>
                            </div>
                        </div>

                        <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles.badge}`}
                        >
                            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                        </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold sm:text-xl">
                        {insight.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {insight.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between rounded-xl bg-muted/40 p-3.5 border border-border/50">
                        <div>
                            <span className="text-xs text-muted-foreground block">Key Metric</span>
                            <span className="text-base font-bold tracking-tight">{insight.metric}</span>
                        </div>
                        {("metricLabel" in insight) && (
                            <span className="text-xs font-medium text-muted-foreground bg-background px-2.5 py-1 rounded-md border">
                                {insight.metricLabel}
                            </span>
                        )}
                    </div>

                    {("progress" in insight) && insight.progress !== undefined && (
                        <div className="mt-4 space-y-1.5">
                            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                <span>Monthly limit usage</span>
                                <span>{insight.progress}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className={`h-full rounded-full ${styles.progressBg}`}
                                    style={{ width: `${insight.progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                    <button className="group inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-primary">
                        {insight.actionText}
                        <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                        Finvoro AI
                    </span>
                </div>
            </motion.div>
        </div>
    );
}

export function SmartInsightsSection() {
    return (
        <section id="insights" className="border-b bg-muted/20">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                    <div className="lg:sticky lg:top-28">
                        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium">
                            <BrainCircuit className="size-3.5" />
                            Financial intelligence
                        </div>

                        <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
                            Don&apos;t just track your money.
                            <br className="hidden sm:block" />
                            Understand it.
                        </h2>

                        <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                            Finvoro helps turn financial activity into
                            useful observations, so you can recognize
                            patterns and make more informed decisions.
                        </p>

                        <div className="mt-8 space-y-4">
                            {[
                                "Identify spending patterns",
                                "Monitor budget performance",
                                "Understand financial trends",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <a
                            href="#features"
                            className="mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-muted-foreground"
                        >
                            Explore Finvoro features
                            <ArrowRight className="size-4" />
                        </a>
                    </div>

                    <div className="flex flex-col gap-6">
                        {insights.map((insight, idx) => (
                            <InsightCard
                                key={insight.title}
                                insight={insight}
                                index={idx}
                                total={insights.length}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}