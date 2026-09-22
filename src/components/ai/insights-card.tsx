"use client";

import {
    AlertTriangle,
    Award,
    Lightbulb,
    MessageSquare,
    RefreshCw,
    Sparkles,
    TrendingUp,
    type LucideIcon,
} from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { useInsightsStore, type InsightsRequest } from "@/stores/insights-store";
import { useUIStore } from "@/stores/ui-store";
import type { Insight, InsightKind } from "@/types/finance";

const KIND_STYLE: Record<InsightKind, { icon: LucideIcon; tone: string }> = {
    warning: { icon: AlertTriangle, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    trend: { icon: TrendingUp, tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
    opportunity: { icon: Lightbulb, tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    saving: { icon: Lightbulb, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    achievement: { icon: Award, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
};

type Props = {
    /** Cache key - one per screen/period. */
    scopeKey: string;
    request: InsightsRequest;
    /** Rule-based insights shown when AI is off, unconfigured or failing. */
    fallback: Insight[];
    title?: string;
    description?: string;
};

export function InsightsCard({
    scopeKey,
    request,
    fallback,
    title = "AI insights",
    description = "Personalised observations from your data",
}: Props) {
    const aiEnabled = useAppStore((state) => state.aiEnabled);
    const entry = useInsightsStore((state) => state.entries[scopeKey]);
    const load = useInsightsStore((state) => state.load);
    const askCopilot = useUIStore((state) => state.askCopilot);

    const requestKey = JSON.stringify(request);

    useEffect(() => {
        if (aiEnabled) void load(scopeKey, JSON.parse(requestKey) as InsightsRequest);
    }, [aiEnabled, load, scopeKey, requestKey]);

    const notConfigured = entry?.status === "error" && entry.code === "not_configured";
    const usingAi = aiEnabled && entry?.status === "ready";
    const loading = aiEnabled && (!entry || entry.status === "loading") && !entry?.insights.length;
    const showAi =
        aiEnabled && !!entry && (entry.status === "ready" || (entry.status === "loading" && entry.insights.length > 0));
    const insights: Insight[] = showAi ? entry.insights : fallback;

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            {title}
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                                    usingAi ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                                )}
                            >
                                {usingAi && <Sparkles className="size-2.5" />}
                                {usingAi ? "Gemini" : "Rule-based"}
                            </span>
                        </CardTitle>
                        <CardDescription>{usingAi && entry?.headline ? entry.headline : description}</CardDescription>
                    </div>

                    {aiEnabled && !notConfigured && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0"
                            aria-label="Regenerate insights"
                            disabled={entry?.status === "loading"}
                            onClick={() => void load(scopeKey, request, { force: true })}
                        >
                            <RefreshCw className={cn("size-4", entry?.status === "loading" && "animate-spin")} />
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex gap-3">
                            <Skeleton className="size-8 shrink-0 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-full" />
                            </div>
                        </div>
                    ))
                ) : insights.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Add a few transactions and insights will appear here.
                    </p>
                ) : (
                    insights.map((insight) => {
                        const style = KIND_STYLE[insight.kind];

                        return (
                            <div key={insight.id} className="group flex gap-3">
                                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", style.tone)}>
                                    <style.icon className="size-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium leading-snug">{insight.title}</p>
                                    <p className="text-xs leading-relaxed text-muted-foreground">{insight.detail}</p>
                                    {insight.suggestedAction && (
                                        <p className="mt-1 text-xs text-foreground/80">→ {insight.suggestedAction}</p>
                                    )}
                                </div>
                                {aiEnabled && !notConfigured && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                                        aria-label={`Ask the Copilot about: ${insight.title}`}
                                        onClick={() => askCopilot(`Tell me more about this and what I should do: ${insight.title}. ${insight.detail}`)}
                                    >
                                        <MessageSquare className="size-3.5" />
                                    </Button>
                                )}
                            </div>
                        );
                    })
                )}

                {aiEnabled && entry?.status === "error" && (
                    <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                        {notConfigured
                            ? "Add GEMINI_API_KEY to enable AI-written insights. Showing rule-based insights for now."
                            : `${entry.error} Showing rule-based insights instead.`}
                    </p>
                )}
                {!aiEnabled && (
                    <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                        AI is turned off. Enable it in Settings for deeper insights.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
