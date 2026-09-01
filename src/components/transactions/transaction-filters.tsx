"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TransactionFiltersProps = {
    search: string;
    type: string;
    category: string;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onClear: () => void;
};

const categories = [
    "Food",
    "Entertainment",
    "Transport",
    "Freelance",
    "Utilities",
    "Shopping",
    "Health",
    "Salary",
];

export function TransactionFilters({
    search,
    type,
    category,
    onSearchChange,
    onTypeChange,
    onCategoryChange,
    onClear,
}: TransactionFiltersProps) {
    const [searchValue, setSearchValue] =
        useState(search);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchValue !== search) {
                onSearchChange(searchValue);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [
        searchValue,
        search,
        onSearchChange,
    ]);

    const hasFilters =
        search ||
        type !== "all" ||
        category !== "all";

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    value={searchValue}
                    onChange={(event) =>
                        setSearchValue(event.target.value)
                    }
                    placeholder="Search transactions..."
                    className="pl-9"
                />
            </div>

            <div className="grid grid-cols-2 gap-3 lg:flex lg:shrink-0">
                <select
                    value={type}
                    onChange={(event) =>
                        onTypeChange(event.target.value)
                    }
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label="Filter by transaction type"
                >
                    <option value="all">All types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <select
                    value={category}
                    onChange={(event) =>
                        onCategoryChange(event.target.value)
                    }
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label="Filter by category"
                >
                    <option value="all">All categories</option>

                    {categories.map((item) => (
                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            {hasFilters && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="self-start lg:self-auto"
                    onClick={() => {
                        setSearchValue("");
                        onClear();
                    }}
                >
                    <X />
                    Clear
                </Button>
            )}
        </div>
    );
}
