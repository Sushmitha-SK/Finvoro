"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { transactionSchema } from "@/components/transactions/transaction-schema";

export async function createTransaction(
    data: unknown,
) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const parsed = transactionSchema.safeParse(data);

    if (!parsed.success) {
        throw new Error("Invalid transaction data");
    }

    const {
        description,
        amount,
        type,
        category,
        date,
        notes,
    } = parsed.data;

    const existingCategory =
        await prisma.category.findFirst({
            where: {
                name: category,
                clerkUserId: userId,
            },
        });

    const transactionCategory =
        existingCategory ??
        (await prisma.category.create({
            data: {
                name: category,
                clerkUserId: userId,
            },
        }));

    await prisma.transaction.create({
        data: {
            clerkUserId: userId,
            description,
            amount,
            type,
            date: new Date(`${date}T00:00:00`),
            notes: notes || null,
            categoryId: transactionCategory.id,
        },
    });

    revalidatePath("/transactions");
}