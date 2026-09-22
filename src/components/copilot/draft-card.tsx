"use client";

import { Check, Loader2, Pencil, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { createTransaction } from "@/app/(dashboard)/transactions/actions";
import { Button } from "@/components/ui/button";
import type { TransactionDraft } from "@/lib/ai/tools";
import { useMoney } from "@/stores/app-store";
import { useCopilotStore } from "@/stores/copilot-store";
import { useInsightsStore } from "@/stores/insights-store";
import { useUIStore } from "@/stores/ui-store";

/** Human-in-the-loop: the model proposes, the user confirms. Nothing is saved until "Add". */
export function DraftCard({
    draft,
    messageId,
    index,
}: {
    draft: TransactionDraft;
    messageId: string;
    index: number;
}) {
    const money = useMoney();
    const [saving, setSaving] = useState(false);
    const dismiss = useCopilotStore((state) => state.dismissDraft);
    const openDialog = useUIStore((state) => state.openTransactionDialog);

    async function confirm() {
        setSaving(true);

        const result = await createTransaction({ ...draft, amount: String(draft.amount) });

        setSaving(false);

        if (!result.ok) {
            toast.error(result.error);

            return;
        }

        toast.success("Transaction added");
        useInsightsStore.getState().invalidateAll();
        dismiss(messageId, index);
    }

    return (
        <div className="mt-2 rounded-xl border bg-background p-3 text-sm shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">Proposed transaction</p>

            <div className="mt-1 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate font-medium">{draft.description}</p>
                    <p className="text-xs text-muted-foreground">
                        {draft.category}
                        {draft.isNewCategory && " (new category)"} · {draft.date}
                    </p>
                </div>
                <p className={draft.type === "income" ? "font-semibold text-emerald-600" : "font-semibold"}>
                    {draft.type === "income" ? "+" : "−"}
                    {money(draft.amount, { fractionDigits: 2 })}
                </p>
            </div>

            <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={confirm} disabled={saving} className="gap-1">
                    {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />} Add
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => {
                        openDialog({ source: "ai", prefill: { ...draft, amount: String(draft.amount) } });
                        dismiss(messageId, index);
                    }}
                >
                    <Pencil className="size-3.5" /> Edit
                </Button>
                <Button size="sm" variant="ghost" className="gap-1" onClick={() => dismiss(messageId, index)}>
                    <X className="size-3.5" /> Dismiss
                </Button>
            </div>
        </div>
    );
}
