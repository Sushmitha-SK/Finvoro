import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 5;

type GetTransactionsParams = {
    userId: string;
    search?: string;
    type?: string;
    category?: string;
    page?: number;
};

export async function getTransactions({
    userId,
    search = "",
    type = "all",
    category = "all",
    page = 1,
}: GetTransactionsParams) {
    const searchTerm = search.trim();

    const where = {
        clerkUserId: userId,

        ...(type !== "all" && {
            type: type as "income" | "expense",
        }),

        ...(category !== "all" && {
            category: {
                name: category,
            },
        }),

        ...(searchTerm && {
            OR: [
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive" as const,
                    },
                },
                {
                    category: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                },
            ],
        }),
    };

    const totalCount = await prisma.transaction.count({
        where,
    });

    const totalPages = Math.max(
        1,
        Math.ceil(totalCount / ITEMS_PER_PAGE),
    );

    const currentPage = Math.min(
        Math.max(page, 1),
        totalPages,
    );

    const transactions = await prisma.transaction.findMany({
        where,
        include: {
            category: true,
        },
        orderBy: {
            date: "desc",
        },
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
    });

    return {
        transactions: transactions.map((transaction) => ({
            ...transaction,
            amount: Number(transaction.amount),
        })),
        totalCount,
        totalPages,
        currentPage,
    };
}