"use client";

import { CalendarClock, Loader2, MoreHorizontal, PartyPopper, Pencil, PiggyBank, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { deleteGoal } from "@/app/(dashboard)/goals/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatShortDate } from "@/lib/dates";
import { useMoney } from "@/stores/app-store";
import type { GoalSummary } from "@/types/finance";

import { ContributeDialog } from "./contribute-dialog";
import { GoalFormDialog } from "./goal-form-dialog";

export function GoalsView({ goals }: { goals: GoalSummary[] }) {
    const money = useMoney();
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<GoalSummary | null>(null);
    const [contributing, setContributing] = useState<GoalSummary | null>(null);
    const [deleting, setDeleting] = useState<GoalSummary | null>(null);
    const [busy, setBusy] = useState(false);

    const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

    function openCreate() {
        setEditing(null);
        setFormOpen(true);
    }

    async function confirmDelete() {
        if (!deleting) return;

        setBusy(true);

        const result = await deleteGoal(deleting.id);

        setBusy(false);

        if (!result.ok) {
            toast.error(result.error);

            return;
        }

        toast.success("Goal deleted");
        setDeleting(null);
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Savings goals</h2>
                    <p className="text-sm text-muted-foreground">
                        {goals.length > 0
                            ? `${money(totalSaved)} saved of ${money(totalTarget)} across ${goals.length} goal${goals.length === 1 ? "" : "s"}.`
                            : "Set a target and watch your progress."}
                    </p>
                </div>
                <Button className="gap-1.5" onClick={openCreate}>
                    <Plus className="size-4" /> New goal
                </Button>
            </div>

            {goals.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <PiggyBank className="size-6" />
                        </div>
                        <p className="font-medium">No goals yet</p>
                        <p className="max-w-sm text-sm text-muted-foreground">
                            Saving for a trip, an emergency fund, a new laptop? Create a goal and track it here.
                        </p>
                        <Button className="mt-1 gap-1.5" onClick={openCreate}>
                            <Plus className="size-4" /> Create your first goal
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {goals.map((goal) => {
                        const done = goal.percentage >= 100;
                        const color = goal.color ?? "#10b981";

                        return (
                            <Card key={goal.id}>
                                <CardContent className="space-y-4 p-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="flex items-center gap-2 truncate font-semibold">
                                                <span className="size-2.5 shrink-0 rounded-full" style={{ background: color }} />
                                                {goal.name}
                                            </p>
                                            {goal.targetDate && (
                                                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                                    <CalendarClock className="size-3" /> by {formatShortDate(goal.targetDate)}
                                                </p>
                                            )}
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${goal.name}`} />}>
                                                <MoreHorizontal className="size-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditing(goal);
                                                        setFormOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="size-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem variant="destructive" onClick={() => setDeleting(goal)}>
                                                    <Trash2 className="size-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div>
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-2xl font-semibold tracking-tight">{money(goal.currentAmount)}</span>
                                            <span className="text-sm text-muted-foreground">of {money(goal.targetAmount)}</span>
                                        </div>
                                        <div
                                            className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted"
                                            role="progressbar"
                                            aria-valuenow={Math.round(goal.percentage)}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label={`${goal.name} progress`}
                                        >
                                            <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${goal.percentage}%`, background: color }} />
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {done ? (
                                                <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                                                    <PartyPopper className="size-3.5" /> Goal reached!
                                                </span>
                                            ) : goal.monthlyNeeded !== null ? (
                                                <>
                                                    Save <strong className="text-foreground">{money(goal.monthlyNeeded)}</strong> a month to get there
                                                </>
                                            ) : (
                                                `${Math.round(goal.percentage)}% complete`
                                            )}
                                        </p>
                                    </div>

                                    <Button variant="outline" className="w-full" onClick={() => setContributing(goal)}>
                                        Add or withdraw
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <GoalFormDialog
                key={editing?.id ?? "new"}
                open={formOpen}
                onOpenChange={(open) => {
                    setFormOpen(open);
                    if (!open) setEditing(null);
                }}
                goal={editing}
            />
            <ContributeDialog goal={contributing} onOpenChange={(open) => !open && setContributing(null)} />

            <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && !busy && setDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete “{deleting?.name}”?</AlertDialogTitle>
                        <AlertDialogDescription>Your progress on this goal will be removed. This can&apos;t be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={busy}
                            onClick={(event) => {
                                event.preventDefault();
                                void confirmDelete();
                            }}
                        >
                            {busy && <Loader2 className="size-4 animate-spin" />} Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
