import type { Prisma } from "@/generated/prisma/client";
import { isValidDateInput, parseDateInput } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export type TransactionSortField = "date" | "amount" | "description";
export type SortDirection = "asc" | "desc";

export type TransactionFilters = {
    search?: string;
    type?: string;
    category?: string;
    from?: string;
    to?: string;
};

export function buildTransactionWhere(
    clerkUserId: string,
    filters: TransactionFilters = {},
): Prisma.TransactionWhereInput {
    const search = filters.search?.trim();
    const dateFilter: Prisma.DateTimeFilter = {};

    if (isValidDateInput(filters.from)) {
        dateFilter.gte = parseDateInput(filters.from);
    }

    if (isValidDateInput(filters.to)) {
        const end = parseDateInput(filters.to);

        end.setDate(end.getDate() + 1);
        dateFilter.lt = end;
    }

    return {
        clerkUserId,

        ...(search
            ? {
                OR: [
                    { description: { contains: search, mode: "insensitive" } },
                    { notes: { contains: search, mode: "insensitive" } },
                    { category: { name: { contains: search, mode: "insensitive" } } },
                ],
            }
            : {}),

        ...(filters.type === "income" || filters.type === "expense"
            ? { type: filters.type }
            : {}),

        ...(filters.category && filters.category !== "all"
            ? { category: { name: filters.category } }
            : {}),

        ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
    };
}

type GetTransactionsParams = TransactionFilters & {
    clerkUserId: string;
    page?: number;
    pageSize?: number;
    sort?: TransactionSortField;
    dir?: SortDirection;
};

export async function getTransactions({
    clerkUserId,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    sort = "date",
    dir = "desc",
    ...filters
}: GetTransactionsParams) {
    const where = buildTransactionWhere(clerkUserId, filters);

    const [totalCount, totals] = await Promise.all([
        prisma.transaction.count({ where }),
        prisma.transaction.groupBy({
            by: ["type"],
            where,
            _sum: { amount: true },
        }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const transactions = await prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: [{ [sort]: dir }, { createdAt: "desc" }],
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
    });

    return {
        transactions: transactions.map((transaction) => ({
            ...transaction,
            amount: Number(transaction.amount),
        })),
        totalCount,
        totalPages,
        currentPage,
        pageSize,
        totals: {
            income: Number(totals.find((t) => t.type === "income")?._sum.amount ?? 0),
            expenses: Number(totals.find((t) => t.type === "expense")?._sum.amount ?? 0),
        },
    };
}
