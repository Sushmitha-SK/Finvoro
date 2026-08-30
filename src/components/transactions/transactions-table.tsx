"use client";

import { useMemo, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

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

import type { Transaction, Category } from "@/generated/prisma/client";

import { formatCurrency } from "@/lib/format-currency";

import { TransactionFilters } from "./transaction-filters";

const ITEMS_PER_PAGE = 5;

type TransactionWithCategory = Omit<
    Transaction,
    "amount"
> & {
    amount: number;
    category: Category;
};

export function TransactionsTable({
    transactions,
}: {
    transactions: TransactionWithCategory[];
}) {
    const [search, setSearch] = useState("");
    const [type, setType] = useState("all");
    const [category, setCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredTransactions = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        return transactions.filter((transaction) => {
            const matchesSearch =
                !searchTerm ||
                transaction.description
                    .toLowerCase()
                    .includes(searchTerm) ||
                transaction.category.name
                    .toLowerCase()
                    .includes(searchTerm);

            const matchesType =
                type === "all" || transaction.type === type;

            const matchesCategory =
                category === "all" ||
                transaction.category.name === category;

            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            );
        });
    }, [transactions, search, type, category]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredTransactions.length / ITEMS_PER_PAGE,
        ),
    );

    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const clearFilters = () => {
        setSearch("");
        setType("all");
        setCategory("all");
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleTypeChange = (value: string) => {
        setType(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        setCurrentPage(1);
    };

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                    <CardTitle>All transactions</CardTitle>

                    <span className="text-sm text-muted-foreground">
                        {filteredTransactions.length}{" "}
                        {filteredTransactions.length === 1
                            ? "transaction"
                            : "transactions"}
                    </span>
                </div>

                <TransactionFilters
                    search={search}
                    type={type}
                    category={category}
                    onSearchChange={handleSearchChange}
                    onTypeChange={handleTypeChange}
                    onCategoryChange={
                        handleCategoryChange
                    }
                    onClear={clearFilters}
                />
            </CardHeader>

            <CardContent>
                {paginatedTransactions.length > 0 ? (
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
                                    {paginatedTransactions.map(
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
                                                                transaction.category.name
                                                            }
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell className="text-muted-foreground">
                                                        {transaction.date.toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
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
                                                        {formatCurrency(transaction.amount)}
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
                                        currentPage === 1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                page - 1,
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
                                        setCurrentPage(
                                            (page) =>
                                                page + 1,
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
                            Try adjusting your search or
                            filters.
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