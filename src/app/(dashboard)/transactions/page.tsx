import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { TransactionsSummary } from "@/components/transactions/transactions-summary";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { TransactionsToolbar } from "@/components/transactions/transactions-toolbar";
import { getUserId } from "@/lib/auth";
import { toDateInput } from "@/lib/dates";
import { colorForName } from "@/lib/colors";
import {
    DEFAULT_PAGE_SIZE,
    PAGE_SIZE_OPTIONS,
    getTransactions,
    type SortDirection,
    type TransactionSortField,
} from "@/lib/transactions/get-transactions";

export const metadata: Metadata = { title: "Transactions" };

type PageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function TransactionsPage({ searchParams }: PageProps) {
    const userId = await getUserId();

    if (!userId) redirect("/sign-in");

    const params = await searchParams;

    const sortParam = first(params.sort);
    const sort: TransactionSortField =
        sortParam === "amount" || sortParam === "description" ? sortParam : "date";
    const dir: SortDirection = first(params.dir) === "asc" ? "asc" : "desc";

    const requestedSize = Number(first(params.pageSize));
    const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(requestedSize)
        ? requestedSize
        : DEFAULT_PAGE_SIZE;

    const filters = {
        search: first(params.search),
        type: first(params.type),
        category: first(params.category),
        from: first(params.from),
        to: first(params.to),
    };

    const result = await getTransactions({
        clerkUserId: userId,
        ...filters,
        page: Number(first(params.page)) || 1,
        pageSize,
        sort,
        dir,
    });

    const filtered = Object.values(filters).some((value) => value && value !== "all");

    return (
        <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Transactions</h2>
                <p className="text-sm text-muted-foreground">Search, filter, edit and export everything you&apos;ve logged.</p>
            </div>

            <TransactionsSummary
                count={result.totalCount}
                income={result.totals.income}
                expenses={result.totals.expenses}
                filtered={filtered}
            />

            <TransactionsToolbar />

            <TransactionsTable
                rows={result.transactions.map((transaction) => ({
                    id: transaction.id,
                    description: transaction.description,
                    amount: transaction.amount,
                    type: transaction.type,
                    date: toDateInput(transaction.date),
                    notes: transaction.notes,
                    category: transaction.category.name,
                    categoryColor: transaction.category.color ?? colorForName(transaction.category.name),
                }))}
                totalCount={result.totalCount}
                currentPage={result.currentPage}
                totalPages={result.totalPages}
                pageSize={result.pageSize}
                sort={sort}
                dir={dir}
                filtered={filtered}
            />
        </div>
    );
}
