"use client";

import { CalendarDays } from "lucide-react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useState } from "react";

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
                1,
            );

            return {
                from: formatDate(from),
                to: formatDate(
                    new Date(
                        to.getFullYear(),
                        to.getMonth(),
                        0,
                    ),
                ),
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
                1,
            );

            return {
                from: formatDate(from),
                to: formatDate(
                    new Date(
                        to.getFullYear(),
                        to.getMonth(),
                        0,
                    ),
                ),
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

    const [preset, setPreset] =
        useState(currentPreset);

    const [from, setFrom] = useState(
        searchParams.get("from") ?? "",
    );

    const [to, setTo] = useState(
        searchParams.get("to") ?? "",
    );

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

            updateUrl(
                "custom",
            );

            return;
        }

        const range =
            getPresetRange(value);

        setFrom(range.from);
        setTo(range.to);

        updateUrl(
            value,
            range.from,
            range.to,
        );
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

    return (
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end">
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
                            onChange={(
                                event,
                            ) =>
                                setFrom(
                                    event
                                        .target
                                        .value,
                                )
                            }
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
                            onChange={(
                                event,
                            ) =>
                                setTo(
                                    event
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <Button
                        type="button"
                        onClick={
                            handleApplyCustom
                        }
                        disabled={
                            !from ||
                            !to ||
                            from > to
                        }
                    >
                        <CalendarDays />
                        Apply
                    </Button>
                </>
            )}
        </div>
    );
}