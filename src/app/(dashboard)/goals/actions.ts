"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { goalSchema } from "@/components/goals/goal-schema";
import { isValidDateInput, parseDateInput } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

import type { ActionResult } from "../transactions/actions";

function refresh() {
    revalidatePath("/goals");
    revalidatePath("/dashboard");
}

function toData(values: z.infer<typeof goalSchema>) {
    return {
        name: values.name,
        targetAmount: Number(values.targetAmount),
        currentAmount: values.currentAmount === "" ? 0 : Number(values.currentAmount),
        targetDate: isValidDateInput(values.targetDate) ? parseDateInput(values.targetDate) : null,
        color: values.color || null,
    };
}

export async function createGoal(input: unknown): Promise<ActionResult> {
    const { userId } = await auth();

    if (!userId) return { ok: false, error: "You need to sign in again." };

    const parsed = goalSchema.safeParse(input);

    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid goal." };

    await prisma.goal.create({ data: { clerkUserId: userId, ...toData(parsed.data) } });
    refresh();

    return { ok: true };
}

export async function updateGoal(id: string, input: unknown): Promise<ActionResult> {
    const { userId } = await auth();

    if (!userId) return { ok: false, error: "You need to sign in again." };

    const parsed = goalSchema.safeParse(input);

    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid goal." };

    const result = await prisma.goal.updateMany({
        where: { id, clerkUserId: userId },
        data: toData(parsed.data),
    });

    if (result.count === 0) return { ok: false, error: "Goal not found." };

    refresh();

    return { ok: true };
}

export async function deleteGoal(id: string): Promise<ActionResult> {
    const { userId } = await auth();

    if (!userId) return { ok: false, error: "You need to sign in again." };

    const result = await prisma.goal.deleteMany({ where: { id, clerkUserId: userId } });

    if (result.count === 0) return { ok: false, error: "Goal not found." };

    refresh();

    return { ok: true };
}

const contributeSchema = z.object({
    id: z.string().min(1),
    amount: z.number().finite().refine((value) => value !== 0, "Enter an amount."),
});

/** Add to (or, with a negative amount, withdraw from) a goal. Never below zero. */
export async function contributeToGoal(id: string, amount: number): Promise<ActionResult> {
    const { userId } = await auth();

    if (!userId) return { ok: false, error: "You need to sign in again." };

    const parsed = contributeSchema.safeParse({ id, amount });

    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid amount." };

    const goal = await prisma.goal.findFirst({ where: { id, clerkUserId: userId } });

    if (!goal) return { ok: false, error: "Goal not found." };

    const next = Math.max(Number(goal.currentAmount) + parsed.data.amount, 0);

    await prisma.goal.update({ where: { id }, data: { currentAmount: next } });
    refresh();

    return { ok: true };
}
