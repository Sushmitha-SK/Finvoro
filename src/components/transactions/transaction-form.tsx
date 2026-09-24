"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { createTransaction, updateTransaction } from "@/app/(dashboard)/transactions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toDateInput } from "@/lib/dates";
import { localeForCurrency } from "@/lib/currencies";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { useInsightsStore } from "@/stores/insights-store";
import { useNotificationsStore } from "@/stores/notifications-store";
import type { TransactionPrefill } from "@/stores/ui-store";

import { transactionSchema, type TransactionFormValues } from "./transaction-schema";

type ParsedResponse = {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    isNewCategory: boolean;
    date: string;
    notes: string;
};

type Props = {
    editingId: string | null;
    prefill: TransactionPrefill | null;
    source: "manual" | "ai";
    onDone: () => void;
};

const fieldClass =
    "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

const MAX_RECEIPT_BYTES = 4 * 1024 * 1024;

export function TransactionForm({ editingId, prefill, source, onDone }: Props) {
    const editing = editingId !== null;
    const aiEnabled = useAppStore((state) => state.aiEnabled);
    const currency = useAppStore((state) => state.currency);
    const categories = useAppStore((state) => state.categories);

    const [quickText, setQuickText] = useState("");
    const [busy, setBusy] = useState<"parse" | "scan" | "categorize" | null>(null);
    const [extraCategories, setExtraCategories] = useState<string[]>([]);
    const [aiFilled, setAiFilled] = useState(source === "ai");
    const fileInput = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            description: "",
            amount: "",
            type: "expense",
            category: "",
            date: toDateInput(new Date()),
            notes: "",
            ...prefill,
        },
    });

    const type = useWatch({ control, name: "type" });

    const currencySymbol = useMemo(
        () =>
            new Intl.NumberFormat(localeForCurrency(currency), { style: "currency", currency })
                .formatToParts(0)
                .find((part) => part.type === "currency")?.value ?? currency,
        [currency],
    );

    const categoryNames = useMemo(() => {
        const names = new Set(categories.map((category) => category.name));

        for (const extra of extraCategories) names.add(extra);

        const current = prefill?.category;

        if (current) names.add(current);

        return Array.from(names).sort((a, b) => a.localeCompare(b));
    }, [categories, extraCategories, prefill?.category]);

    function applyParsed(parsed: ParsedResponse) {
        if (parsed.isNewCategory) {
            setExtraCategories((existing) => [...existing, parsed.category]);
        }

        reset({
            description: parsed.description,
            amount: String(parsed.amount),
            type: parsed.type,
            category: parsed.category,
            date: parsed.date,
            notes: parsed.notes,
        });
        setAiFilled(true);
    }

    async function runAi<T>(kind: "parse" | "scan" | "categorize", request: () => Promise<Response>) {
        setBusy(kind);

        try {
            const response = await request();
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                toast.error(data.error ?? "The AI couldn't help with that.");

                return null;
            }

            return data as T;
        } catch {
            toast.error("Network error. Please try again.");

            return null;
        } finally {
            setBusy(null);
        }
    }

    async function quickAdd() {
        const text = quickText.trim();

        if (text.length < 2) return;

        const data = await runAi<{ transaction: ParsedResponse }>("parse", () =>
            fetch("/api/ai/parse-transaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, today: toDateInput(new Date()) }),
            }),
        );

        if (data) {
            applyParsed(data.transaction);
            setQuickText("");
        }
    }

    async function scanReceipt(file: File) {
        if (file.size > MAX_RECEIPT_BYTES) {
            toast.error("That image is over 4 MB. Try a smaller photo.");

            return;
        }

        const body = new FormData();

        body.set("image", file);
        body.set("today", toDateInput(new Date()));

        const data = await runAi<{ transaction: ParsedResponse }>("scan", () =>
            fetch("/api/ai/scan-receipt", { method: "POST", body }),
        );

        if (data) applyParsed(data.transaction);
    }

    async function suggestCategory() {
        const description = getValues("description").trim();

        if (!aiEnabled || editing || description.length < 3 || getValues("category")) return;

        setBusy("categorize");

        try {
            const response = await fetch("/api/ai/categorize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            });

            if (!response.ok) return; 

            const data = (await response.json()) as { category: string; isNewCategory: boolean };

            if (getValues("category")) return;

            if (data.isNewCategory) setExtraCategories((existing) => [...existing, data.category]);

            setValue("category", data.category, { shouldValidate: true });
            setAiFilled(true);
        } catch {
        } finally {
            setBusy(null);
        }
    }

    async function onSubmit(values: TransactionFormValues) {
        const result = editing
            ? await updateTransaction(editingId, values)
            : await createTransaction(values);

        if (!result.ok) {
            toast.error(result.error);

            return;
        }

        toast.success(editing ? "Transaction updated" : "Transaction added");
        useInsightsStore.getState().invalidateAll();
        void useNotificationsStore.getState().fetch();
        onDone();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {aiEnabled && !editing && (
                <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <Label htmlFor="quick-add" className="flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Sparkles className="size-3.5" /> Describe it and let AI fill the form
                    </Label>

                    <div className="flex gap-2">
                        <Input
                            id="quick-add"
                            value={quickText}
                            onChange={(event) => setQuickText(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    void quickAdd();
                                }
                            }}
                            placeholder="Dinner at Truffles 1,240 yesterday"
                            maxLength={300}
                            disabled={busy !== null}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={busy !== null || quickText.trim().length < 2}
                            onClick={quickAdd}
                        >
                            {busy === "parse" ? <Loader2 className="size-4 animate-spin" /> : "Fill"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Scan a receipt"
                            title="Scan a receipt"
                            disabled={busy !== null}
                            onClick={() => fileInput.current?.click()}
                        >
                            {busy === "scan" ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
                        </Button>
                        <input
                            ref={fileInput}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/heic"
                            capture="environment"
                            className="hidden"
                            onChange={(event) => {
                                const file = event.target.files?.[0];

                                event.target.value = "";
                                if (file) void scanReceipt(file);
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Type">
                {(["expense", "income"] as const).map((option) => (
                    <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={type === option}
                        onClick={() => setValue("type", option, { shouldValidate: true })}
                        className={cn(
                            "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                            type === option
                                ? option === "expense"
                                    ? "bg-background text-destructive shadow-sm"
                                    : "bg-background text-emerald-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    placeholder="e.g. Swiggy dinner"
                    aria-invalid={!!errors.description}
                    {...register("description", { onBlur: suggestCategory })}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            {currencySymbol}
                        </span>
                        <Input
                            id="amount"
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            className="pl-7"
                            placeholder="0.00"
                            aria-invalid={!!errors.amount}
                            {...register("amount")}
                        />
                    </div>
                    {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" aria-invalid={!!errors.date} {...register("date")} />
                    {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <Label htmlFor="category">Category</Label>
                    {busy === "categorize" && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Loader2 className="size-3 animate-spin" /> Suggesting…
                        </span>
                    )}
                    {aiFilled && busy !== "categorize" && (
                        <span className="flex items-center gap-1 text-xs text-primary">
                            <Sparkles className="size-3" /> Filled by AI — check before saving
                        </span>
                    )}
                </div>
                <select
                    id="category"
                    className={fieldClass}
                    aria-invalid={!!errors.category}
                    {...register("category")}
                >
                    <option value="">Select a category</option>
                    {categoryNames.map((name) => (
                        <option key={name} value={name}>
                            {name}
                            {categories.some((category) => category.name === name) ? "" : " (new)"}
                        </option>
                    ))}
                </select>
                {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input id="notes" placeholder="Anything worth remembering" {...register("notes")} />
                {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={onDone}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || busy === "parse" || busy === "scan"}>
                    {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                    {editing ? "Save changes" : "Add transaction"}
                </Button>
            </div>
        </form>
    );
}


