"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { createGoal, updateGoal } from "@/app/(dashboard)/goals/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toDateInput } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { GoalSummary } from "@/types/finance";

import { GOAL_COLORS, goalSchema, type GoalFormValues } from "./goal-schema";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    goal?: GoalSummary | null;
};

function GoalForm({ goal, onDone }: { goal?: GoalSummary | null; onDone: () => void }) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<GoalFormValues>({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            name: goal?.name ?? "",
            targetAmount: goal ? String(goal.targetAmount) : "",
            currentAmount: goal ? String(goal.currentAmount) : "",
            targetDate: goal?.targetDate ? toDateInput(new Date(goal.targetDate)) : "",
            color: goal?.color ?? GOAL_COLORS[0],
        },
    });

    const color = useWatch({ control, name: "color" });

    async function onSubmit(values: GoalFormValues) {
        const result = goal ? await updateGoal(goal.id, values) : await createGoal(values);

        if (!result.ok) {
            toast.error(result.error);

            return;
        }

        toast.success(goal ? "Goal updated" : "Goal created");
        onDone();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
                <Label htmlFor="goal-name">Name</Label>
                <Input id="goal-name" placeholder="e.g. Emergency fund" aria-invalid={!!errors.name} {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="goal-target">Target amount</Label>
                    <Input id="goal-target" type="number" inputMode="decimal" step="0.01" min="0" aria-invalid={!!errors.targetAmount} {...register("targetAmount")} />
                    {errors.targetAmount && <p className="text-xs text-destructive">{errors.targetAmount.message}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="goal-saved">Already saved</Label>
                    <Input id="goal-saved" type="number" inputMode="decimal" step="0.01" min="0" placeholder="0" {...register("currentAmount")} />
                    {errors.currentAmount && <p className="text-xs text-destructive">{errors.currentAmount.message}</p>}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="goal-date">Target date (optional)</Label>
                <Input id="goal-date" type="date" {...register("targetDate")} />
            </div>

            <div className="space-y-1.5">
                <Label>Colour</Label>
                <div className="flex gap-2" role="radiogroup" aria-label="Goal colour">
                    {GOAL_COLORS.map((option) => (
                        <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={color === option}
                            aria-label={option}
                            onClick={() => setValue("color", option)}
                            className={cn("size-7 rounded-full ring-offset-2 ring-offset-popover transition", color === option ? "ring-2 ring-foreground" : "hover:scale-110")}
                            style={{ background: option }}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={onDone}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                    {goal ? "Save changes" : "Create goal"}
                </Button>
            </div>
        </form>
    );
}

export function GoalFormDialog({ open, onOpenChange, goal }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{goal ? "Edit goal" : "New savings goal"}</DialogTitle>
                    <DialogDescription>Track progress toward something that matters.</DialogDescription>
                </DialogHeader>
                <GoalForm goal={goal} onDone={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
