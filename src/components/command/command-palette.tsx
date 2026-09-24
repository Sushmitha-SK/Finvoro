"use client";

import { Command } from "cmdk";
import {
    Download,
    Eye,
    Loader2,
    MessageSquare,
    Moon,
    Plus,
    Search,
    Sparkles,
    Wand2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { allNavigation } from "@/config/navigation";
import { toDateInput } from "@/lib/dates";
import { useAppStore, useMoney } from "@/stores/app-store";
import { useUIStore } from "@/stores/ui-store";

type SearchResult = {
    id: string;
    description: string;
    category: string;
    type: "income" | "expense";
    amount: number;
    date: string;
};

const itemClass =
    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground outline-none data-[selected=true]:bg-muted [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground";

const groupClass =
    "px-1 py-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground";

function matches(query: string, ...fields: Array<string | undefined>) {
    const q = query.trim().toLowerCase();

    return !q || fields.some((field) => field?.toLowerCase().includes(q));
}

export function CommandPalette() {
    const open = useUIStore((state) => state.commandOpen);
    const setOpen = useUIStore((state) => state.setCommandOpen);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                showCloseButton={false}
                className="top-[20%] max-w-[calc(100%-2rem)] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
            >
                <DialogTitle className="sr-only">Command palette</DialogTitle>
                <DialogDescription className="sr-only">
                    Search transactions, jump to a page, or ask the AI Copilot.
                </DialogDescription>

                {/* Mounted only while open, so query/results reset every time. */}
                <PaletteBody />
            </DialogContent>
        </Dialog>
    );
}

function PaletteBody() {
    const router = useRouter();
    const { resolvedTheme, setTheme } = useTheme();
    const money = useMoney();
    const setOpen = useUIStore((state) => state.setCommandOpen);
    const askCopilot = useUIStore((state) => state.askCopilot);
    const openTransactionDialog = useUIStore((state) => state.openTransactionDialog);
    const aiEnabled = useAppStore((state) => state.aiEnabled);
    const toggleHideAmounts = useAppStore((state) => state.toggleHideAmounts);

    const [query, setQuery] = useState("");
    const [found, setFound] = useState<{ term: string; results: SearchResult[] }>({ term: "", results: [] });

    const term = query.trim();
    const active = term.length >= 2;
    const results = active && found.term === term ? found.results : [];
    const searching = active && found.term !== term;

    useEffect(() => {
        if (!active) return;

        const controller = new AbortController();

        const timer = window.setTimeout(async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
                    signal: controller.signal,
                });
                const data = await response.json();

                setFound({ term, results: data.results ?? [] });
            } catch {
            }
        }, 250);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [term, active]);

    const close = () => setOpen(false);

    function run(action: () => void) {
        close();
        action();
    }

    async function quickAddWithAi(text: string) {
        close();

        const promise = fetch("/api/ai/parse-transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, today: toDateInput(new Date()) }),
        }).then(async (response) => {
            const data = await response.json().catch(() => ({}));

            if (!response.ok) throw new Error(data.error ?? "Couldn't understand that.");

            return data.transaction as {
                description: string;
                amount: number;
                type: "income" | "expense";
                category: string;
                date: string;
                notes: string;
            };
        });

        toast.promise(promise, {
            loading: "Reading that…",
            success: "Review and save",
            error: (error: Error) => error.message,
        });

        try {
            const parsed = await promise;

            openTransactionDialog({
                source: "ai",
                prefill: { ...parsed, amount: String(parsed.amount) },
            });
        } catch {
        }
    }

    const pages = useMemo(
        () => allNavigation.filter((item) => matches(query, item.title, item.keywords)),
        [query],
    );

    const trimmed = term;
    const showAiRows = aiEnabled && trimmed.length >= 3;

    const actions: Array<{ id: string; label: string; icon: ReactNode; keywords: string; run: () => void; hint?: string }> = [
        {
            id: "add",
            label: "Add transaction",
            icon: <Plus />,
            keywords: "new create expense income",
            run: () => openTransactionDialog(),
        },
        ...(aiEnabled
            ? [
                {
                    id: "copilot",
                    label: "Open AI Copilot",
                    icon: <Sparkles />,
                    keywords: "assistant chat gemini ask",
                    hint: "⌘J",
                    run: () => useUIStore.getState().setCopilotOpen(true),
                },
            ]
            : []),
        {
            id: "theme",
            label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
            icon: <Moon />,
            keywords: "dark light mode appearance",
            run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
        },
        {
            id: "privacy",
            label: "Toggle hide amounts",
            icon: <Eye />,
            keywords: "privacy mask balance hide show",
            run: toggleHideAmounts,
        },
        {
            id: "export",
            label: "Export transactions (CSV)",
            icon: <Download />,
            keywords: "download csv backup",
            run: () => {
                const link = document.createElement("a");

                link.href = "/api/transactions/export";
                link.click();
            },
        },
    ].filter((action) => matches(query, action.label, action.keywords));

    return (
        <>
            <Command shouldFilter={false} loop label="Command palette">
                <div className="flex items-center gap-2 border-b px-4">
                    {searching ? (
                        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                    ) : (
                        <Search className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <Command.Input
                        value={query}
                        onValueChange={setQuery}
                        placeholder="Search transactions, jump to a page, or ask AI…"
                        className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">Esc</kbd>
                </div>

                <Command.List className="max-h-[min(60vh,26rem)] overflow-y-auto p-1">
                    {showAiRows && (
                        <Command.Group heading="Ask AI" className={groupClass}>
                            <Command.Item
                                value="ask-ai"
                                className={itemClass}
                                onSelect={() => run(() => askCopilot(trimmed))}
                            >
                                <MessageSquare />
                                <span className="truncate">Ask Copilot: “{trimmed}”</span>
                            </Command.Item>
                            <Command.Item
                                value="quick-add"
                                className={itemClass}
                                onSelect={() => void quickAddWithAi(trimmed)}
                            >
                                <Wand2 />
                                <span className="truncate">Add as a transaction with AI: “{trimmed}”</span>
                            </Command.Item>
                        </Command.Group>
                    )}

                    {results.length > 0 && (
                        <Command.Group heading="Transactions" className={groupClass}>
                            {results.map((result) => (
                                <Command.Item
                                    key={result.id}
                                    value={`txn-${result.id}`}
                                    className={itemClass}
                                    onSelect={() =>
                                        run(() =>
                                            router.push(
                                                `/transactions?search=${encodeURIComponent(result.description)}`,
                                            ),
                                        )
                                    }
                                >
                                    <Search />
                                    <span className="min-w-0 flex-1 truncate">
                                        {result.description}
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            {result.category} · {result.date}
                                        </span>
                                    </span>
                                    <span
                                        className={
                                            result.type === "income"
                                                ? "text-xs font-medium text-emerald-600"
                                                : "text-xs font-medium"
                                        }
                                    >
                                        {result.type === "income" ? "+" : "−"}
                                        {money(result.amount)}
                                    </span>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}

                    {actions.length > 0 && (
                        <Command.Group heading="Actions" className={groupClass}>
                            {actions.map((action) => (
                                <Command.Item
                                    key={action.id}
                                    value={action.id}
                                    className={itemClass}
                                    onSelect={() => run(action.run)}
                                >
                                    {action.icon}
                                    <span className="flex-1">{action.label}</span>
                                    {action.hint && (
                                        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                            {action.hint}
                                        </kbd>
                                    )}
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}

                    {pages.length > 0 && (
                        <Command.Group heading="Go to" className={groupClass}>
                            {pages.map((page) => (
                                <Command.Item
                                    key={page.href}
                                    value={`page-${page.href}`}
                                    className={itemClass}
                                    onSelect={() => run(() => router.push(page.href))}
                                >
                                    <page.icon />
                                    {page.title}
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}

                    {!showAiRows && pages.length === 0 && actions.length === 0 && results.length === 0 && (
                        <p className="px-3 py-10 text-center text-sm text-muted-foreground">
                            {searching ? "Searching…" : "No results found."}
                        </p>
                    )}
                </Command.List>
            </Command>
        </>
    );
}
