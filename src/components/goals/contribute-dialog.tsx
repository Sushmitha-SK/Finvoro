"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { contributeToGoal } from "@/app/(dashboard)/goals/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMoney } from "@/stores/app-store";
import type { GoalSummary } from "@/types/finance";

function ContributeForm({ goal, onDone }: { goal: GoalSummary; onDone: () => void }) {
    const money = useMoney();
    const [mode, setMode] = useState<"add" | "withdraw">("add");
    const [amount, setAmount] = useState("");
    const [saving, setSaving] = useState(false);

    const value = Number(amount);
    const valid = Number.isFinite(value) && value > 0;
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

    async function submit() {
        if (!valid) return;

        setSaving(true);

        const result = await contributeToGoal(goal.id, mode === "add" ? value : -value);

        setSaving(false);

        if (!result.ok) {
            toast.error(result.error);

            return;
        }

        toast.success(mode === "add" ? `Added to ${goal.name}` : `Withdrew from ${goal.name}`);
        onDone();
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Action">
                {(["add", "withdraw"] as const).map((option) => (
                    <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={mode === option}
                        onClick={() => setMode(option)}
                        className={cn("rounded-md px-3 py-1.5 text-sm font-medium capitalize", mode === option ? "bg-background shadow-sm" : "text-muted-foreground")}
                    >
                        {option === "add" ? "Add money" : "Withdraw"}
                    </button>
                ))}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="contribute-amount">Amount</Label>
                <Input
                    id="contribute-amount"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    autoFocus
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && void submit()}
                />
                {mode === "add" && remaining > 0 && (
                    <button type="button" className="text-xs text-primary hover:underline" onClick={() => setAmount(String(remaining))}>
                        Fill remaining ({money(remaining)})
                    </button>
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={onDone}>
                    Cancel
                </Button>
                <Button onClick={submit} disabled={!valid || saving}>
                    {saving && <Loader2 className="size-4 animate-spin" />}
                    {mode === "add" ? "Add" : "Withdraw"}
                </Button>
            </div>
        </div>
    );
}

export function ContributeDialog({
    goal,
    onOpenChange,
}: {
    goal: GoalSummary | null;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={goal !== null} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{goal?.name}</DialogTitle>
                    <DialogDescription>Update how much you&apos;ve set aside.</DialogDescription>
                </DialogHeader>
                {goal && <ContributeForm goal={goal} onDone={() => onOpenChange(false)} />}
            </DialogContent>
        </Dialog>
    );
}
