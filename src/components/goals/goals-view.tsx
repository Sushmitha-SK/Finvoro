"use client";

import { CalendarClock, Loader2, MoreHorizontal, PartyPopper, Pencil, PiggyBank, Plus, Trash2, TrendingUp } from "lucide-react";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="font-heading text-2xl font-semibold tracking-tight">
                        Savings goals
                    </h2>
                    <p className="font-sans py-1 text-sm text-muted-foreground">
                        {goals.length > 0
                            ? `${money(totalSaved)} saved of ${money(totalTarget)} across ${goals.length} goal${goals.length === 1 ? "" : "s"}.`
                            : "Set a target and watch your progress."}
                    </p>
                </div>
                <Button className="gap-1.5 shadow-xs shadow-primary/5 h-10" onClick={openCreate}>
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
                <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="py-3.5 font-semibold">Goal Details</TableHead>
                                <TableHead className="py-3.5 font-semibold">Progress & Status</TableHead>
                                <TableHead className="py-3.5 font-semibold">Target / Needed</TableHead>
                                <TableHead className="py-3.5 text-right font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {goals.map((goal) => {
                                const done = goal.percentage >= 100;
                                const color = goal.color ?? "#10b981";
                                const clampedPercentage = Math.min(Math.round(goal.percentage), 100);

                                return (
                                    <TableRow key={goal.id} className="transition-colors group">
                                        {/* Goal Name & Date */}
                                        <TableCell className="py-4 font-medium align-middle">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="size-3 shrink-0 rounded-full shadow-xs"
                                                    style={{ background: color }}
                                                />
                                                <div className="space-y-0.5">
                                                    <p className="font-semibold text-foreground text-sm tracking-tight">{goal.name}</p>
                                                    {goal.targetDate ? (
                                                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <CalendarClock className="size-3" /> Due {formatShortDate(goal.targetDate)}
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-muted-foreground">No due date</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Progress Bar & Amounts */}
                                        <TableCell className="py-4 align-middle w-[320px]">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-medium text-foreground">
                                                        {money(goal.currentAmount)} <span className="text-muted-foreground font-normal">/ {money(goal.targetAmount)}</span>
                                                    </span>
                                                    <span className="font-semibold text-muted-foreground">{clampedPercentage}%</span>
                                                </div>
                                                <div
                                                    className="h-2.5 overflow-hidden rounded-full bg-muted/80 shadow-inner"
                                                    role="progressbar"
                                                    aria-valuenow={clampedPercentage}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-label={`${goal.name} progress`}
                                                >
                                                    <div
                                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                                        style={{ width: `${clampedPercentage}%`, background: color }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Status / Monthly Needed */}
                                        <TableCell className="py-4 align-middle">
                                            {done ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                    <PartyPopper className="size-3.5" /> Goal reached!
                                                </span>
                                            ) : goal.monthlyNeeded !== null ? (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground border border-border">
                                                    <TrendingUp className="size-3.5 text-primary" />
                                                    <span>Save <strong className="text-foreground">{money(goal.monthlyNeeded)}</strong>/mo</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">In progress</span>
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="py-4 text-right align-middle">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 shadow-xs font-medium"
                                                    onClick={() => setContributing(goal)}
                                                >
                                                    Contribute
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" aria-label={`Actions for ${goal.name}`} />}>
                                                        <MoreHorizontal className="size-4" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-36">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setEditing(goal);
                                                                setFormOpen(true);
                                                            }}
                                                            className="gap-2 cursor-pointer"
                                                        >
                                                            <Pencil className="size-3.5" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() => setDeleting(goal)}
                                                            className="gap-2 cursor-pointer"
                                                        >
                                                            <Trash2 className="size-3.5" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
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