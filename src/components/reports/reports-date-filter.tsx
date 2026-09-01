"use client";

import { CalendarDays } from "lucide-react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
        label: "Custom range",
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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPreset(currentPreset);
            setFrom(currentFrom);
            setTo(currentTo);
        }, 0);

        return () => {
            clearTimeout(timeout);
        };
    }, [
        currentPreset,
        currentFrom,
        currentTo,
    ]);

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

    const handlePresetChange = (
        value: string | null,
    ) => {
        if (!value) {
            return;
        }

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

    return (
        <div className="rounded-xl border bg-card p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                    <div className="space-y-2">
                        <label
                            htmlFor="report-period"
                            className="text-sm font-medium"
                        >
                            Period
                        </label>

                        <Select
                            value={preset}
                            onValueChange={
                                handlePresetChange
                            }
                        >
                            <SelectTrigger
                                id="report-period"
                                className="w-full sm:w-48"
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {presets.map(
                                    (item) => (
                                        <SelectItem
                                            key={
                                                item.value
                                            }
                                            value={
                                                item.value
                                            }
                                        >
                                            {
                                                item.label
                                            }
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {preset === "custom" && (
                        <>
                            <div className="space-y-2">
                                <label
                                    htmlFor="report-from"
                                    className="text-sm font-medium"
                                >
                                    From
                                </label>

                                <Input
                                    id="report-from"
                                    type="date"
                                    value={from}
                                    max={to || undefined}
                                    onChange={(
                                        event,
                                    ) =>
                                        setFrom(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className="w-full sm:w-40"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="report-to"
                                    className="text-sm font-medium"
                                >
                                    To
                                </label>

                                <Input
                                    id="report-to"
                                    type="date"
                                    value={to}
                                    min={
                                        from ||
                                        undefined
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setTo(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className="w-full sm:w-40"
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={
                                    handleApplyCustom
                                }
                                disabled={
                                    !canApply
                                }
                            >
                                <CalendarDays />
                                Apply
                            </Button>
                        </>
                    )}
                </div>

                {preset === "custom" && (
                    <div className="min-h-5 text-sm">
                        {hasInvalidRange && (
                            <p className="text-destructive">
                                The end date must be on or after
                                the start date.
                            </p>
                        )}

                        {!hasInvalidRange &&
                            hasIncompleteRange && (
                                <p className="text-muted-foreground">
                                    Select both dates to apply the
                                    custom range.
                                </p>
                            )}

                        {!hasInvalidRange &&
                            !hasIncompleteRange &&
                            !from &&
                            !to && (
                                <p className="text-muted-foreground">
                                    Choose a start and end date.
                                </p>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}