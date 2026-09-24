"use client";

import { Download, Search, X, SlidersHorizontal, Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

import { useUrlParams } from "./use-url-params";

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
        <div className={cn(
            "group relative flex flex-col gap-3 rounded-xl border border-border/40 bg-card/40 p-4 backdrop-blur-xl transition-all duration-200",
            pending && "opacity-60 pointer-events-none"
        )}>
            {/* Top Row: Search, Segmented Tabs, and Export */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between">
                
                {/* Linear-style Search Input */}
                <div className="relative flex-1 lg:max-w-md">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-foreground" />
                    <Input
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        placeholder="Search description, notes or category..."
                        className="h-9 pl-9 pr-12 bg-background/50 border-border/60 text-xs shadow-2xs transition-all focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring"
                        aria-label="Search transactions"
                    />
                    <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none rounded border border-border/80 bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground">
                        ⌘K
                    </kbd>
                </div>

                {/* Vercel-style Segmented Control */}
                <div className="flex items-center gap-x-2">
                    <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted/60 p-1 border border-border/40" role="radiogroup" aria-label="Transaction type">
                        {TYPES.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                role="radio"
                                aria-checked={type === option.value}
                                onClick={() => update({ type: option.value })}
                                className={cn(
                                    "inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-medium transition-all",
                                    type === option.value 
                                        ? "bg-background text-foreground shadow-xs font-semibold" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/40",
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5 text-xs font-medium border-border/60 bg-background/50 hover:bg-muted/50 shadow-2xs"
                        nativeButton={false}
                        render={<a href={`/api/transactions/export${exportParams.size ? `?${exportParams}` : ""}`} />}
                    >
                        <Download className="size-3.5 text-muted-foreground" /> 
                        <span>Export</span>
                    </Button>
                </div>
            </div>

            {/* Bottom Row: Secondary Filters (Category & Date Range) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/30">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-3.5 text-muted-foreground ml-0.5 mr-1" />
                    
                    {/* Custom Styled Select Trigger Replacement */}
                    <select
                        className="h-8 rounded-lg border border-border/60 bg-background/50 px-2.5 text-xs text-foreground outline-none transition-all hover:border-border focus:border-ring focus:ring-1 focus:ring-ring"
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
                </div>

                {/* Date Range Inputs */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                    <div className="relative">
                        <Input 
                            type="date" 
                            value={from} 
                            max={to || undefined} 
                            onChange={(event) => update({ from: event.target.value })} 
                            className="h-8 w-36 text-xs bg-background/50 border-border/60" 
                            aria-label="From date" 
                        />
                    </div>
                    <span className="text-muted-foreground/60">to</span>
                    <div className="relative">
                        <Input 
                            type="date" 
                            value={to} 
                            min={from || undefined} 
                            onChange={(event) => update({ to: event.target.value })} 
                            className="h-8 w-36 text-xs bg-background/50 border-border/60" 
                            aria-label="To date" 
                        />
                    </div>

                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 ml-1"
                            onClick={() => {
                                setTerm("");
                                update({ search: null, type: null, category: null, from: null, to: null });
                            }}
                        >
                            <X className="size-3 text-muted-foreground" /> 
                            <span>Reset</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}