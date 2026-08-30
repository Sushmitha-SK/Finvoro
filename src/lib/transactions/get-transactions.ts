import { prisma } from "@/lib/prisma";
import type { TransactionType } from "@/generated/prisma/client";

const DEFAULT_PAGE_SIZE = 5;

type GetTransactionsParams = {
    clerkUserId: string;
    search?: string;
    type?: string;
    category?: string;
    page?: number;
    pageSize?: number;
};

export async function getTransactions({
    clerkUserId,
    search = "",
    type = "all",
    category = "all",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
}: GetTransactionsParams) {
    const currentPage = Math.max(1, page);
    const skip = (currentPage - 1) * pageSize;
    const searchTerm = search.trim();

    const where = {
        clerkUserId,

        ...(searchTerm
            ? {
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
            }
            : {}),

        ...(type !== "all"
            ? {
                type: type as TransactionType,
            }
            : {}),

        ...(category !== "all"
            ? {
                category: {
                    name: category,
                },
            }
            : {}),
    };

    const [transactions, totalCount] = await Promise.all([
        prisma.transaction.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: [
                {
                    date: "desc",
                },
                {
                    createdAt: "desc",
                },
            ],
            skip,
            take: pageSize,
        }),

        prisma.transaction.count({
            where,
        }),
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(totalCount / pageSize),
    );

    return {
        transactions,
        totalCount,
        totalPages,
        currentPage,
        pageSize,
    };
}