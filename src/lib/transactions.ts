import { prisma } from "@/lib/prisma";

export async function getTransactions(userId: string) {
    const transactions = await prisma.transaction.findMany({
        where: {
            clerkUserId: userId,
        },
        include: {
            category: true,
        },
        orderBy: {
            date: "desc",
        },
    });

    return transactions.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
    }));
}