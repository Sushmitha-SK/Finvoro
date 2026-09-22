"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppStore, useMoney } from "@/stores/app-store";
import { useInsightsStore } from "@/stores/insights-store";

type Suggestion = {
    categoryId: string;
    category: string;
    amount: number;
    averageSpend: number;
    rationale: string;
};

type State =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; month: number; year: number; suggestions: Suggestion[]; reason?: string };

export function AiBudgetSuggestions() {
    const router = useRouter();
    const money = useMoney();
    const aiEnabled = useAppStore((state) => state.aiEnabled);

    const [open, setOpen] = useState(false);
    const [state, setState] = useState<State>({ status: "idle" });
    const [amounts, setAmounts] = useState<Record<string, string>>({});
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [applying, setApplying] = useState(false);

    if (!aiEnabled) return null;

    async function generate() {
        setState({ status: "loading" });

        try {
            const response = await fetch("/api/ai/budget-suggestions", { method: "POST" });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setState({ status: "error", message: data.error ?? "Couldn't generate suggestions." });

                return;
            }

            const suggestions: Suggestion[] = data.suggestions ?? [];

            setAmounts(Object.fromEntries(suggestions.map((s) => [s.categoryId, String(s.amount)])));
            setChecked(Object.fromEntries(suggestions.map((s) => [s.categoryId, true])));
            setState({ status: "ready", month: data.month, year: data.year, suggestions, reason: data.reason });
        } catch {
            setState({ status: "error", message: "Network error. Please try again." });
        }
    }

    function openDialog() {
        setOpen(true);
        if (state.status === "idle" || state.status === "error") void generate();
    }

    async function apply() {
        if (state.status !== "ready") return;

        const chosen = state.suggestions.filter((s) => checked[s.categoryId] && Number(amounts[s.categoryId]) > 0);

        if (chosen.length === 0) return;

        setApplying(true);

        const results = await Promise.all(
            chosen.map((s) =>
                fetch("/api/budgets", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        categoryId: s.categoryId,
                        amount: Number(amounts[s.categoryId]),
                        month: state.month,
                        year: state.year,
                    }),
                }).then((response) => response.ok),
            ),
        );

        setApplying(false);

        const created = results.filter(Boolean).length;

        if (created === 0) {
            toast.error("Couldn't create the budgets.");

            return;
        }

        toast.success(`Created ${created} budget${created === 1 ? "" : "s"}`);
        useInsightsStore.getState().invalidateAll();
        setOpen(false);
        setState({ status: "idle" });
        router.refresh();
    }

    const selectedCount =
        state.status === "ready" ? state.suggestions.filter((s) => checked[s.categoryId]).length : 0;

    return (
        <>
            <Button variant="outline" className="gap-1.5" onClick={openDialog}>
                <Sparkles className="size-4 text-primary" /> Suggest with AI
            </Button>

            <Dialog open={open} onOpenChange={(next) => !applying && setOpen(next)}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="size-4 text-primary" /> AI budget suggestions
                        </DialogTitle>
                        <DialogDescription>
                            Based on your average spending over the last three months. Adjust anything before applying.
                        </DialogDescription>
                    </DialogHeader>

                    {state.status === "loading" && (
                        <div className="flex flex-col items-center gap-3 py-12 text-sm text-muted-foreground">
                            <Loader2 className="size-6 animate-spin" />
                            Analysing your spending…
                        </div>
                    )}

                    {state.status === "error" && (
                        <div className="space-y-3 py-6 text-center">
                            <p className="text-sm text-destructive">{state.message}</p>
                            <Button variant="outline" onClick={generate}>
                                Try again
                            </Button>
                        </div>
                    )}

                    {state.status === "ready" && state.suggestions.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            {state.reason ?? "No suggestions right now."}
                        </p>
                    )}

                    {state.status === "ready" && state.suggestions.length > 0 && (
                        <>
                            <ul className="max-h-80 divide-y overflow-y-auto rounded-xl border">
                                {state.suggestions.map((s) => (
                                    <li key={s.categoryId} className="flex items-start gap-3 p-3">
                                        <input
                                            type="checkbox"
                                            className="mt-1 size-4 accent-primary"
                                            aria-label={`Include ${s.category}`}
                                            checked={!!checked[s.categoryId]}
                                            onChange={(event) => setChecked((c) => ({ ...c, [s.categoryId]: event.target.checked }))}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium">{s.category}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Avg {money(s.averageSpend)}/mo · {s.rationale}
                                            </p>
                                        </div>
                                        <Input
                                            type="number"
                                            min="0"
                                            aria-label={`${s.category} budget amount`}
                                            className="w-28"
                                            value={amounts[s.categoryId] ?? ""}
                                            onChange={(event) => setAmounts((a) => ({ ...a, [s.categoryId]: event.target.value }))}
                                        />
                                    </li>
                                ))}
                            </ul>

                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setOpen(false)} disabled={applying}>
                                    Cancel
                                </Button>
                                <Button onClick={apply} disabled={applying || selectedCount === 0}>
                                    {applying && <Loader2 className="size-4 animate-spin" />}
                                    Apply {selectedCount} budget{selectedCount === 1 ? "" : "s"}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
