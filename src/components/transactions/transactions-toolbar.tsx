"use client";

import { Download, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

import { useUrlParams } from "./use-url-params";

const selectClass =
    "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const TYPES = [
    { value: "all", label: "All" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expenses" },
] as const;

export function TransactionsToolbar() {
    const categories = useAppStore((state) => state.categories);
    const { searchParams, update, pending } = useUrlParams();

    const urlSearch = searchParams.get("search") ?? "";
    const type = searchParams.get("type") ?? "all";
    const category = searchParams.get("category") ?? "all";
    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";

    const [term, setTerm] = useState(urlSearch);

    // The last value *we* pushed to the URL. A URL change that differs from it came from
    // elsewhere (e.g. the command palette); one that equals it is just our own debounce
    // landing and must not overwrite what the user has typed since.
    const pushed = useRef(urlSearch);

    useEffect(() => {
        if (urlSearch !== pushed.current) {
            pushed.current = urlSearch;
            setTerm(urlSearch);
        }
    }, [urlSearch]);

    useEffect(() => {
        if (term.trim() === urlSearch) return;

        const timer = window.setTimeout(() => {
            pushed.current = term.trim();
            update({ search: term.trim() });
        }, 300);

        return () => window.clearTimeout(timer);
    }, [term, urlSearch, update]);

    const hasFilters = Boolean(urlSearch || from || to || category !== "all" || type !== "all");

    const exportParams = new URLSearchParams();

    for (const key of ["search", "type", "category", "from", "to"]) {
        const value = searchParams.get(key);

        if (value) exportParams.set(key, value);
    }

    return (
        <div className={cn("space-y-3 transition-opacity", pending && "opacity-70")}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1 lg:max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        placeholder="Search description, notes or category"
                        className="pl-9"
                        aria-label="Search transactions"
                    />
                </div>

                <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Transaction type">
                    {TYPES.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={type === option.value}
                            onClick={() => update({ type: option.value })}
                            className={cn(
                                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                                type === option.value ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    className="gap-1.5 lg:ml-auto"
                    nativeButton={false}
                    render={<a href={`/api/transactions/export${exportParams.size ? `?${exportParams}` : ""}`} />}
                >
                    <Download className="size-4" /> Export CSV
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <select
                    className={selectClass}
                    value={category}
                    onChange={(event) => update({ category: event.target.value })}
                    aria-label="Filter by category"
                >
                    <option value="all">All categories</option>
                    {categories.map((item) => (
                        <option key={item.id} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Input type="date" value={from} max={to || undefined} onChange={(event) => update({ from: event.target.value })} className="w-40" aria-label="From date" />
                    <span>to</span>
                    <Input type="date" value={to} min={from || undefined} onChange={(event) => update({ to: event.target.value })} className="w-40" aria-label="To date" />
                </div>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                            setTerm("");
                            update({ search: null, type: null, category: null, from: null, to: null });
                        }}
                    >
                        <X className="size-3.5" /> Clear filters
                    </Button>
                )}
            </div>
        </div>
    );
}
