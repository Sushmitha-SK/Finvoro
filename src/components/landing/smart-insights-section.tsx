"use client";

import { useRef } from "react";
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion";
import {
    ArrowRight,
    CheckCircle2,
    ChevronRight,
} from "lucide-react";

import { insights } from "@/config/landing-content";

type Insight = (typeof insights)[number];

const typeStyles: Record<
    Insight["type"],
    { badge: string; icon: string; progressBg: string }
> = {
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

type InsightCardProps = {
    insight: Insight;
    index: number;
    total: number;
};

function InsightCardContent({
    insight,
    index,
    total,
}: InsightCardProps) {
    const Icon = insight.icon;
    const styles = typeStyles[insight.type];

    const hasMetricLabel = "metricLabel" in insight;
    const hasProgress =
        "progress" in insight && insight.progress !== undefined;

    const progress =
        hasProgress ? insight.progress : undefined;

    return (
        <article className="flex w-full flex-col justify-between rounded-2xl border bg-card p-6 shadow-[0_8px_32px_rgba(4,39,24,0.06)] sm:p-7">
            <div>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div
                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
                        >
                            <Icon
                                className="size-5"
                                aria-hidden="true"
                                focusable="false"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">
                                {insight.label}
                            </p>
                            <span className="text-[11px] text-muted-foreground/70">
                                {insight.timestamp}
                            </span>
                        </div>
                    </div>

                    <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles.badge}`}
                        aria-label={`Insight ${index + 1} of ${total}`}
                    >
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {String(total).padStart(2, "0")}
                    </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold sm:text-xl">
                    {insight.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {insight.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/40 p-3.5">
                    <div className="min-w-0">
                        <span className="block text-xs text-muted-foreground">
                            Key Metric
                        </span>
                        <span className="wrap-break-word text-base font-bold tracking-tight">
                            {insight.metric}
                        </span>
                    </div>

                    {hasMetricLabel && (
                        <span className="shrink-0 rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            {insight.metricLabel}
                        </span>
                    )}
                </div>

                {progress !== undefined && (
                    <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between gap-3 text-xs font-medium text-muted-foreground">
                            <span id={`insight-progress-label-${index}`}>
                                Monthly limit usage
                            </span>
                            <span>{progress}%</span>
                        </div>

                        <div
                            className="h-2 w-full overflow-hidden rounded-full bg-muted"
                            role="progressbar"
                            aria-labelledby={`insight-progress-label-${index}`}
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuetext={`${progress}% of monthly limit used`}
                        >
                            <div
                                className={`h-full rounded-full ${styles.progressBg}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                <button
                    type="button"
                    className="group inline-flex min-h-11 items-center gap-1.5 rounded-sm text-xs font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    {insight.actionText}
                    <ChevronRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                        aria-hidden="true"
                        focusable="false"
                    />
                </button>

                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Finvoro AI
                </span>
            </div>
        </article>
    );
}

function InsightCard({
    insight, index, total, progress,
}: InsightCardProps & { progress: MotionValue<number> }) {
    const shouldReduceMotion = useReducedMotion();
    const stickyTop = 112 + index * 24;

    const targetScale = 1 - (total - 1 - index) * 0.04;
    const start = index / total;
    const scale = useTransform(progress, [start, 1], [1, targetScale]);

    return (
        <div className="sticky flex min-h-85 items-start" style={{ top: stickyTop }}>
            <motion.div
                className="w-full origin-top transform-gpu will-change-transform"
                style={shouldReduceMotion ? undefined : { scale }}
            >
                <InsightCardContent insight={insight} index={index} total={total} />
            </motion.div>
        </div>
    );
}

function AnimatedInsightCard({
    insight,
    index,
    total,
    stickyTop,
}: InsightCardProps & { stickyTop: number }) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", `start ${stickyTop}px`],
    });

    const targetScale = 1 - (total - 1 - index) * 0.04;

    const scale = useTransform(
        scrollYProgress,
        [0, 1],
        [1, targetScale]
    );

    return (
        <div
            ref={ref}
            className="sticky flex min-h-85 items-start"
            style={{ top: stickyTop }}
        >
            <motion.div
                className="w-full origin-top"
                style={{ scale }}
            >
                <InsightCardContent
                    insight={insight}
                    index={index}
                    total={total}
                />
            </motion.div>
        </div>
    );
}

export function SmartInsightsSection() {
    const listRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: listRef,
        offset: ["start start", "end end"],
    });
    return (
        <section
            id="insights"
            aria-labelledby="insights-heading"
            className="border-b bg-muted/20"
        >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                    <div className="lg:sticky lg:top-28">
                        <div className="mx-auto inline-flex max-w-2xl items-center text-center">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Financial intelligence
                            </span>
                        </div>

                        <h2
                            id="insights-heading"
                            className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.65rem] lg:leading-tight"
                        >
                            Don&apos;t just track your money.
                            <br className="hidden sm:block" />
                            Understand it.
                        </h2>

                        <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                            Finvoro helps turn financial activity into
                            useful observations, so you can recognize
                            patterns and make more informed decisions.
                        </p>

                        <ul className="mt-8 space-y-4">
                            {[
                                "Identify spending patterns",
                                "Monitor budget performance",
                                "Understand financial trends",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <CheckCircle2
                                        className="size-4 shrink-0 text-muted-foreground"
                                        aria-hidden="true"
                                        focusable="false"
                                    />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href="#features"
                            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            Explore Finvoro features
                            <ArrowRight
                                className="size-4"
                                aria-hidden="true"
                                focusable="false"
                            />
                        </a>
                    </div>

                    <div ref={listRef} className="flex flex-col gap-6">
                        {insights.map((insight, index) => (
                            <InsightCard
                                key={insight.title}
                                insight={insight}
                                index={index}
                                total={insights.length}
                                progress={scrollYProgress}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
