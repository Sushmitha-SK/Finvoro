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
};

export function TransactionsTable({
    transactions,
    totalCount,
    totalPages,
    currentPage,
    search,
    type,
    category,
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
                <div className="flex items-center justify-between">
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
                        <div className="overflow-x-auto">
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
                                                        className={`text-right font-semibold ${isIncome
                                                                ? "text-emerald-600"
                                                                : ""
                                                            }`}
                                                    >
                                                        {isIncome
                                                            ? "+"
                                                            : "-"}

                                                        {formatCurrency(
                                                            transaction.amount,
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        },
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t pt-4">
                            <p className="text-sm text-muted-foreground">
                                Page {currentPage} of{" "}
                                {totalPages}
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
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
                    <div className="flex min-h-48 flex-col items-center justify-center text-center">
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