import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { prisma } from "@/lib/prisma";

import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "@/generated/prisma/client";

const ITEMS_PER_PAGE = 5;

type TransactionsPageProps = {
    searchParams: Promise<{
        search?: string;
        type?: string;
        category?: string;
        page?: string;
    }>;
};

export default async function TransactionsPage({
    searchParams,
}: TransactionsPageProps) {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const params = await searchParams;

    const search = params.search?.trim() ?? "";
    const type = params.type ?? "all";
    const category = params.category ?? "all";

    const parsedPage = Number(params.page);

    const currentPage =
        Number.isInteger(parsedPage) &&
            parsedPage > 0
            ? parsedPage
            : 1;

    const where = {
        clerkUserId: userId,

        ...(search
            ? {
                OR: [
                    {
                        description: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        category: {
                            name: {
                                contains: search,
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

    const totalCount =
        await prisma.transaction.count({
            where,
        });

    const totalPages = Math.max(
        1,
        Math.ceil(
            totalCount / ITEMS_PER_PAGE,
        ),
    );

    const safePage = Math.min(
        currentPage,
        totalPages,
    );

    const transactions =
        await prisma.transaction.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: {
                date: "desc",
            },
            skip:
                (safePage - 1) *
                ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
        });

    const serializedTransactions =
        transactions.map((transaction) => ({
            ...transaction,
            amount: Number(transaction.amount),
        }));

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Transactions
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Track and manage your income
                            and expenses.
                        </p>
                    </div>

                    <AddTransactionDialog />
                </div>

                <TransactionsTable
                    transactions={
                        serializedTransactions
                    }
                    totalCount={totalCount}
                    totalPages={totalPages}
                    currentPage={safePage}
                    search={search}
                    type={type}
                    category={category}
                />
            </div>
        </div>
    );
}