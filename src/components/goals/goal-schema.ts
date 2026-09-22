import { z } from "zod";

const positiveNumber = (label: string) =>
    z
        .string()
        .min(1, `${label} is required`)
        .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
            message: `Enter a valid ${label.toLowerCase()} greater than 0`,
        });

export const goalSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name is too long"),
    targetAmount: positiveNumber("Target amount"),
    currentAmount: z
        .string()
        .refine((value) => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0), {
            message: "Saved amount can't be negative",
        }),
    targetDate: z.string(),
    color: z.string(),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

export const GOAL_COLORS = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ec4899", "#ef4444"] as const;
