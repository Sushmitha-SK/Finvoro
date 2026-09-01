"use client";

import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatCurrency } from "@/lib/format-currency";

import { TransactionFilters } from "./transaction-filters";

type TransactionWithCategory = {
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    date: Date;
    notes: string | null;
    category: {
        id: string;
        name: string;
        icon: string | null;
        color: string | null;
    };
};

type TransactionsTableProps = {
    transactions: TransactionWithCategory[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    search: string;
    type: string;
    category: string;
    currency: string;
};

export function TransactionsTable({
    transactions,
    totalCount,
    totalPages,
    currentPage,
    search,
    type,
    category,
    currency,
}: TransactionsTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateParams = (
        updates: Record<string, string | null>,
    ) => {
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        Object.entries(updates).forEach(
            ([key, value]) => {
                if (value && value !== "all") {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            },
        );

        params.set("page", "1");

        router.push(
            `/transactions?${params.toString()}`,
        );
    };

    const handleSearchChange = (value: string) => {
        updateParams({
            search: value.trim() || null,
        });
    };

    const handleTypeChange = (value: string) => {
        updateParams({
            type: value === "all" ? null : value,
        });
    };

    const handleCategoryChange = (value: string) => {
        updateParams({
            category:
                value === "all" ? null : value,
        });
    };

    const clearFilters = () => {
        router.push("/transactions");
    };

    const changePage = (page: number) => {
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        if (page === 1) {
            params.delete("page");
        } else {
            params.set("page", String(page));
        }

        router.push(
            `/transactions?${params.toString()}`,
        );
    };

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle>
                        All transactions
                    </CardTitle>

                    <span className="text-sm text-muted-foreground">
                        {totalCount}{" "}
                        {totalCount === 1
                            ? "transaction"
                            : "transactions"}
                    </span>
                </div>

                <TransactionFilters
                    search={search}
                    type={type}
                    category={category}
                    onSearchChange={
                        handleSearchChange
                    }
                    onTypeChange={
                        handleTypeChange
                    }
                    onCategoryChange={
                        handleCategoryChange
                    }
                    onClear={clearFilters}
                />
            </CardHeader>

            <CardContent>
                {transactions.length > 0 ? (
                    <>
                        {/* Mobile: stacked card list */}
                        <div className="space-y-3 sm:hidden">
                            {transactions.map(
                                (transaction) => {
                                    const isIncome =
                                        transaction.type ===
                                        "income";

                                    return (
                                        <div
                                            key={
                                                transaction.id
                                            }
                                            className="rounded-lg border p-3"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${isIncome
                                                        ? "bg-emerald-500/10 text-emerald-600"
                                                        : "bg-muted text-muted-foreground"
                                                        }`}
                                                >
                                                    {isIncome ? (
                                                        <ArrowUpRight className="size-4" />
                                                    ) : (
                                                        <ArrowDownRight className="size-4" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="truncate text-sm font-medium">
                                                            {
                                                                transaction.description
                                                            }
                                                        </p>

                                                        <span
                                                            className={`shrink-0 text-sm font-semibold tabular-nums ${isIncome
                                                                ? "text-emerald-600"
                                                                : "text-foreground"
                                                                }`}
                                                        >
                                                            {isIncome
                                                                ? "+"
                                                                : "-"}
                                                            {formatCurrency(
                                                                transaction.amount,
                                                                currency,
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                                        <Badge variant="secondary">
                                                            {
                                                                transaction
                                                                    .category
                                                                    .name
                                                            }
                                                        </Badge>

                                                        <span className="text-xs text-muted-foreground">
                                                            {transaction.date.toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>

                        {/* Desktop / tablet: full table */}
                        <div className="hidden overflow-x-auto sm:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            Description
                                        </TableHead>

                                        <TableHead>
                                            Category
                                        </TableHead>

                                        <TableHead>
                                            Date
                                        </TableHead>

                                        <TableHead>
                                            Type
                                        </TableHead>

                                        <TableHead className="text-right">
                                            Amount
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {transactions.map(
                                        (transaction) => {
                                            const isIncome =
                                                transaction.type ===
                                                "income";

                                            return (
                                                <TableRow
                                                    key={
                                                        transaction.id
                                                    }
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${isIncome
                                                                    ? "bg-emerald-500/10 text-emerald-600"
                                                                    : "bg-muted text-muted-foreground"
                                                                    }`}
                                                            >
                                                                {isIncome ? (
                                                                    <ArrowUpRight className="size-4" />
                                                                ) : (
                                                                    <ArrowDownRight className="size-4" />
                                                                )}
                                                            </div>

                                                            <span className="font-medium">
                                                                {
                                                                    transaction.description
                                                                }
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge variant="secondary">
                                                            {
                                                                transaction
                                                                    .category
                                                                    .name
                                                            }
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell className="text-muted-foreground">
                                                        {transaction.date.toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                isIncome
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                        >
                                                            {isIncome
                                                                ? "Income"
                                                                : "Expense"}
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell
                                                        className={`text-right font-semibold tabular-nums ${isIncome
                                                            ? "text-emerald-600"
                                                            : ""
                                                            }`}
                                                    >
                                                        {isIncome
                                                            ? "+"
                                                            : "-"}

                                                        {formatCurrency(
                                                            transaction.amount,
                                                            currency
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        },
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Page {currentPage} of{" "}
                                {totalPages}
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 sm:flex-initial"
                                    disabled={
                                        currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        changePage(
                                            currentPage -
                                            1,
                                        )
                                    }
                                >
                                    <ChevronLeft />
                                    Previous
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 sm:flex-initial"
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        changePage(
                                            currentPage +
                                            1,
                                        )
                                    }
                                >
                                    Next
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                        <p className="font-medium">
                            No transactions found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Try adjusting your search
                            or filters.
                        </p>

                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={clearFilters}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}