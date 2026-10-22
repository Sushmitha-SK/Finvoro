
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { featureTransactions } from "@/config/landing-content";

type TransactionFilter = "all" | "income" | "expense";

const filters: TransactionFilter[] = ["all", "income", "expense"];

const currency = (amount: string) => {
    const parsed = Number(amount.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed)
        ? new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Math.abs(parsed))
        : amount;
};

export default function TransactionExplorer() {
    const [txFilter, setTxFilter] = useState<TransactionFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTransactions = useMemo(() => {
        const query = searchQuery.trim().toLocaleLowerCase("en-IN");

        return featureTransactions.filter((tx) => {
            const matchesFilter =
                txFilter === "all" || tx.type === txFilter;

            const matchesSearch =
                !query ||
                [tx.name, tx.category, tx.type ?? ""].some((value) =>
                    value.toLocaleLowerCase("en-IN").includes(query),
                );

            return matchesFilter && matchesSearch;
        });
    }, [txFilter, searchQuery]);

    return (
        <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-4">
            <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 flex-1">
                    <label
                        htmlFor="transaction-search"
                        className="mb-2 block text-sm font-medium"
                    >
                        Search transactions
                    </label>

                    <div className="relative">
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            id="transaction-search"
                            type="search"
                            autoComplete="off"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Name, category, or type"
                            className="min-h-11 w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        />
                    </div>
                </div>

                <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label="Filter transactions by type"
                >
                    {filters.map((filter) => {
                        const selected = txFilter === filter;

                        return (
                            <button
                                key={filter}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setTxFilter(filter)}
                                className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${selected
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-background text-foreground hover:bg-muted"
                                    }`}
                            >
                                {filter}
                            </button>
                        );
                    })}
                </div>
            </div>

            <p
                className="py-3 text-sm text-muted-foreground"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {filteredTransactions.length === 0
                    ? "No transactions found."
                    : `${filteredTransactions.length} ${filteredTransactions.length === 1
                        ? "transaction"
                        : "transactions"
                    } found.`}
            </p>

            <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                    <caption className="sr-only">
                        Transaction history showing descriptions, categories, types,
                        and amounts.
                    </caption>

                    <thead className="bg-muted/70">
                        <tr>
                            <th
                                scope="col"
                                className="px-3 py-3 font-semibold"
                            >
                                Description
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3 font-semibold"
                            >
                                Category
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3 text-right font-semibold"
                            >
                                Amount
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {filteredTransactions.map((tx) => {
                            const isIncome = tx.type === "income";

                            return (
                                <tr key={tx.id} className="bg-background">
                                    <th
                                        scope="row"
                                        className="max-w-48 px-3 py-3 text-left font-medium"
                                    >
                                        <span className="block break-words">
                                            {tx.name}
                                        </span>
                                        <span className="mt-1 block text-xs font-normal capitalize text-muted-foreground">
                                            {tx.type}
                                        </span>
                                    </th>

                                    <td className="px-3 py-3 text-muted-foreground">
                                        {tx.category}
                                    </td>

                                    <td
                                        className={`whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums ${isIncome
                                                ? "text-emerald-800 dark:text-emerald-300"
                                                : "text-foreground"
                                            }`}
                                    >
                                        <span className="sr-only">
                                            {isIncome ? "Income: " : "Expense: "}
                                        </span>
                                        {isIncome ? "+" : "-"}
                                        {currency(tx.amount)}
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-3 py-10 text-center text-muted-foreground"
                                >
                                    Try a different search term or transaction filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
