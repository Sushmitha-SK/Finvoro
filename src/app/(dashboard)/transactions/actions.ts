"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { transactionSchema } from "@/components/transactions/transaction-schema";
import { checkBudgetNotification } from "@/lib/data/budget-alerts";
import { findOrCreateCategory } from "@/lib/data/categories";
import { parseDateInput } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

export type ActionResult<T = undefined> =
    | ({ ok: true } & (T extends undefined ? object : { data: T }))
    | { ok: false; error: string };

function refresh() {
    revalidatePath("/", "layout");
}

async function requireUser() {
    const { userId } = await auth();

    return userId;
}

export async function createTransaction(input: unknown): Promise<ActionResult<{ id: string }>> {
    const userId = await requireUser();

    if (!userId) return { ok: false, error: "You need to sign in again." };

    const parsed = transactionSchema.safeParse(input);

    if (!parsed.success) {
        return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid transaction." };
    }

    const { description, amount, type, category, date, notes } = parsed.data;

    try {
        const categoryRecord = await findOrCreateCategory(userId, category);
        const transactionDate = parseDateInput(date);

        const created = await prisma.transaction.create({
            data: {
                clerkUserId: userId,
                description,
                amount,
                type,
                date: transactionDate,
                notes: notes || null,
                categoryId: categoryRecord.id,
            },
        });

        if (type === "expense") {
            await checkBudgetNotification({
                userId,
                categoryId: categoryRecord.id,
                transactionDate,
            });
        }

        refresh();

        return { ok: true, data: { id: created.id } };
    } catch (error) {
        console.error("createTransaction failed:", error);

        return { ok: false, error: "Couldn't save the transaction. Please try again." };
    }
}

export async function updateTransaction(id: string, input: unknown): Promise<ActionResult> {
    const userId = await requireUser();

    if (!userId) return { ok: false, error: "You need to sign in again." };

    const parsed = transactionSchema.safeParse(input);

    if (!parsed.success) {
        return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid transaction." };
    }

    const { description, amount, type, category, date, notes } = parsed.data;

    try {
        const categoryRecord = await findOrCreateCategory(userId, category);
        const transactionDate = parseDateInput(date);

        const result = await prisma.transaction.updateMany({
            where: { id, clerkUserId: userId },
            data: {
                description,
                amount,
                type,
                date: transactionDate,
                notes: notes || null,
                categoryId: categoryRecord.id,
            },
        });

        if (result.count === 0) return { ok: false, error: "Transaction not found." };

        if (type === "expense") {
            await checkBudgetNotification({
                userId,
                categoryId: categoryRecord.id,
                transactionDate,
            });
        }

        refresh();

        return { ok: true };
    } catch (error) {
        console.error("updateTransaction failed:", error);

        return { ok: false, error: "Couldn't update the transaction." };
    }
}

const idsSchema = z.array(z.string().min(1).max(100)).min(1).max(500);

export async function deleteTransactions(ids: unknown): Promise<ActionResult<{ count: number }>> {
    const userId = await requireUser();

    if (!userId) return { ok: false, error: "You need to sign in again." };

    const parsed = idsSchema.safeParse(ids);

    if (!parsed.success) return { ok: false, error: "Nothing selected." };

    try {
        const result = await prisma.transaction.deleteMany({
            where: { id: { in: parsed.data }, clerkUserId: userId },
        });

        refresh();

        return { ok: true, data: { count: result.count } };
    } catch (error) {
        console.error("deleteTransactions failed:", error);

        return { ok: false, error: "Couldn't delete the transactions." };
    }
}
