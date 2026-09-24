"use client";

import { AlertCircle, ArrowRight, CalendarDays } from "lucide-react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const presets = [
    {
        value: "this-month",
        label: "This month",
    },
    {
        value: "last-month",
        label: "Last month",
    },
    {
        value: "last-3-months",
        label: "Last 3 months",
    },
    {
        value: "this-year",
        label: "This year",
    },
    {
        value: "custom",
        label: "Custom",
    },
];

function formatDate(date: Date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
        date.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
    if (!value) return "";

    const [year, month, day] = value
        .split("-")
        .map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getPresetRange(preset: string) {
    const now = new Date();

    switch (preset) {
        case "last-month": {
            const from = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                1,
            );

            const to = new Date(
                now.getFullYear(),
                now.getMonth(),
                0,
            );

            return {
                from: formatDate(from),
                to: formatDate(to),
            };
        }

        case "last-3-months": {
            const from = new Date(
                now.getFullYear(),
                now.getMonth() - 2,
                1,
            );

            const to = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
            );

            return {
                from: formatDate(from),
                to: formatDate(to),
            };
        }

        case "this-year": {
            const from = new Date(
                now.getFullYear(),
                0,
                1,
            );

            const to = new Date(
                now.getFullYear(),
                11,
                31,
            );

            return {
                from: formatDate(from),
                to: formatDate(to),
            };
        }

        case "this-month":
        default: {
            const from = new Date(
                now.getFullYear(),
                now.getMonth(),
                1,
            );

            const to = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
            );

            return {
                from: formatDate(from),
                to: formatDate(to),
            };
        }
    }
}

export function ReportsDateFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPreset =
        searchParams.get("preset") ??
        "this-month";

    const currentFrom =
        searchParams.get("from") ?? "";

    const currentTo =
        searchParams.get("to") ?? "";

    const [preset, setPreset] =
        useState(currentPreset);

    const [from, setFrom] =
        useState(currentFrom);

    const [to, setTo] =
        useState(currentTo);

    const [appliedFrom, setAppliedFrom] =
        useState(currentFrom);

    const [appliedTo, setAppliedTo] =
        useState(currentTo);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPreset(currentPreset);
            setFrom(currentFrom);
            setTo(currentTo);
            setAppliedFrom(currentFrom);
            setAppliedTo(currentTo);
        }, 0);

        return () => {
            clearTimeout(timeout);
        };
    }, [
        currentPreset,
        currentFrom,
        currentTo,
    ]);


    useEffect(() => {
        if (preset !== "custom") {
            const range = getPresetRange(preset);
            setAppliedFrom(range.from);
            setAppliedTo(range.to);
        }
    }, [preset]);

    const updateUrl = (
        nextPreset: string,
        nextFrom?: string,
        nextTo?: string,
    ) => {
        const params =
            new URLSearchParams(
                searchParams.toString(),
            );

        params.set(
            "preset",
            nextPreset,
        );

        if (nextPreset === "custom") {
            if (nextFrom) {
                params.set(
                    "from",
                    nextFrom,
                );
            } else {
                params.delete("from");
            }

            if (nextTo) {
                params.set(
                    "to",
                    nextTo,
                );
            } else {
                params.delete("to");
            }
        } else {
            params.delete("from");
            params.delete("to");
        }

        router.push(
            `${pathname}?${params.toString()}`,
        );
    };

    const handlePresetChange = (value: string) => {
        setPreset(value);

        if (value === "custom") {
            setFrom("");
            setTo("");

            updateUrl("custom");

            return;
        }

        const range =
            getPresetRange(value);

        setFrom(range.from);
        setTo(range.to);

        updateUrl(value);
    };

    const handleApplyCustom = () => {
        if (!from || !to) {
            return;
        }

        if (from > to) {
            return;
        }

        setAppliedFrom(from);
        setAppliedTo(to);

        updateUrl(
            "custom",
            from,
            to,
        );
    };

    const hasInvalidRange =
        Boolean(from && to && from > to);

    const hasIncompleteRange =
        Boolean(
            (from && !to) ||
            (!from && to),
        );

    const canApply =
        Boolean(from && to) &&
        !hasInvalidRange;

    const hasUnappliedChanges =
        preset === "custom" &&
        canApply &&
        (from !== appliedFrom ||
            to !== appliedTo);

    const showCustomFields = preset === "custom";

    let statusMessage: {
        text: string;
        tone: "error" | "muted";
    } | null = null;

    if (showCustomFields) {
        if (hasInvalidRange) {
            statusMessage = {
                text: "End date must be on or after the start date.",
                tone: "error",
            };
        } else if (hasIncompleteRange) {
            statusMessage = {
                text: "Select both dates to apply the custom range.",
                tone: "muted",
            };
        } else if (!from && !to) {
            statusMessage = {
                text: "Choose a start and end date.",
                tone: "muted",
            };
        } else if (hasUnappliedChanges) {
            statusMessage = {
                text: "Range changed — click Apply to update the report.",
                tone: "muted",
            };
        }
    }

    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                    role="radiogroup"
                    aria-label="Report period"
                    className="inline-flex flex-wrap items-center gap-0.5 rounded-lg bg-muted p-1"
                >
                    {presets.map((item) => {
                        const isActive = preset === item.value;

                        return (
                            <button
                                key={item.value}
                                type="button"
                                role="radio"
                                aria-checked={isActive}
                                onClick={() =>
                                    handlePresetChange(item.value)
                                }
                                className={cn(
                                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    isActive
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {appliedFrom && appliedTo && (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                        <CalendarDays className="size-3.5 shrink-0" />
                        {formatDisplayDate(appliedFrom)}
                        <ArrowRight className="size-3 shrink-0" />
                        {formatDisplayDate(appliedTo)}
                    </span>
                )}
            </div>

            {/* Height-animated reveal so the panel expands/collapses
                smoothly instead of popping in. */}
            <div
                className={cn(
                    "grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out",
                    showCustomFields
                        ? "mt-4 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                )}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                        {/* From/To grouped as one connected control so
                            they read as a single range, not two loose
                            fields — and both stay the same height as
                            the Apply button. */}
                        <div
                            className={cn(
                                "flex h-10 items-center gap-1.5 rounded-lg border bg-background pl-3 pr-1.5 transition-colors",
                                hasInvalidRange
                                    ? "border-destructive"
                                    : "border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                            )}
                        >
                            <Input
                                type="date"
                                value={from}
                                max={to || undefined}
                                onChange={(event) =>
                                    setFrom(event.target.value)
                                }
                                aria-label="Start date"
                                aria-invalid={hasInvalidRange}
                                className="h-8 w-34 border-0 bg-transparent p-0 tabular-nums shadow-none focus-visible:ring-0"
                            />

                            <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />

                            <Input
                                type="date"
                                value={to}
                                min={from || undefined}
                                onChange={(event) =>
                                    setTo(event.target.value)
                                }
                                aria-label="End date"
                                aria-invalid={hasInvalidRange}
                                className="h-8 w-34 border-0 bg-transparent p-0 tabular-nums shadow-none focus-visible:ring-0"
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={handleApplyCustom}
                            disabled={!canApply}
                            variant={
                                hasUnappliedChanges
                                    ? "default"
                                    : "secondary"
                            }
                            className="h-10"
                        >
                            Apply
                        </Button>

                        {statusMessage && (
                            <p
                                aria-live="polite"
                                className={cn(
                                    "flex items-center gap-1.5 text-sm",
                                    statusMessage.tone === "error"
                                        ? "text-destructive"
                                        : "text-muted-foreground",
                                )}
                            >
                                {statusMessage.tone === "error" && (
                                    <AlertCircle className="size-3.5 shrink-0" />
                                )}
                                {statusMessage.text}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}