"use client";

import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const currencies = [
    {
        value: "INR",
        label: "Indian Rupee (₹)",
    },
    {
        value: "USD",
        label: "US Dollar ($)",
    },
    {
        value: "EUR",
        label: "Euro (€)",
    },
    {
        value: "GBP",
        label: "British Pound (£)",
    },
    {
        value: "AED",
        label: "UAE Dirham (د.إ)",
    },
];

export function PreferencesCard() {
    const [currency, setCurrency] =
        useState("INR");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        const loadPreferences =
            async () => {
                try {
                    const response =
                        await fetch(
                            "/api/preferences",
                        );

                    if (!response.ok) {
                        throw new Error(
                            "Failed to load preferences",
                        );
                    }

                    const data =
                        await response.json();

                    setCurrency(
                        data.currency ?? "INR",
                    );
                } catch (error) {
                    console.error(
                        "Failed to load preferences:",
                        error,
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadPreferences();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage("");

            const response =
                await fetch(
                    "/api/preferences",
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            currency,
                        }),
                    },
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to save preferences",
                );
            }

            setMessage(
                "Preferences saved successfully.",
            );
        } catch (error) {
            console.error(
                "Failed to save preferences:",
                error,
            );

            setMessage(
                "Unable to save preferences. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Preferences
                </CardTitle>

                <CardDescription>
                    Customize how Finvoro displays your financial information.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="currency">
                        Currency
                    </Label>

                    <select
                        id="currency"
                        value={currency}
                        disabled={loading || saving}
                        onChange={(event) =>
                            setCurrency(
                                event.target.value,
                            )
                        }
                        className="flex h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none"
                    >
                        {currencies.map(
                            (item) => (
                                <option
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
                                </option>
                            ),
                        )}
                    </select>

                    <p className="text-xs text-muted-foreground">
                        This currency will be used for your financial displays.
                    </p>
                </div>

                <div className="flex items-center justify-between gap-4 border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                        {message}
                    </p>

                    <Button
                        onClick={handleSave}
                        disabled={
                            loading ||
                            saving
                        }
                    >
                        {saving
                            ? "Saving..."
                            : "Save preferences"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}