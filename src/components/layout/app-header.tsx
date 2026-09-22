"use client";

import { UserButton } from "@clerk/nextjs";
import { Eye, EyeOff, Plus, Search, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import { NotificationsPopover } from "@/components/layout/notifications-popover";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { titleForPath } from "@/config/navigation";
import { useAppStore } from "@/stores/app-store";
import { useUIStore } from "@/stores/ui-store";

export function AppHeader() {
    const pathname = usePathname();
    const aiEnabled = useAppStore((state) => state.aiEnabled);
    const hideAmounts = useAppStore((state) => state.hideAmounts);
    const toggleHideAmounts = useAppStore((state) => state.toggleHideAmounts);
    const setCommandOpen = useUIStore((state) => state.setCommandOpen);
    const toggleCopilot = useUIStore((state) => state.toggleCopilot);
    const openTransactionDialog = useUIStore((state) => state.openTransactionDialog);

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 px-3 backdrop-blur supports-backdrop-filter:bg-background/70 sm:gap-3 sm:px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />

            <h1 className="hidden text-sm font-semibold sm:block">{titleForPath(pathname)}</h1>

            <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="ml-auto flex h-9 w-full max-w-xs items-center gap-2 rounded-full border border-transparent bg-muted px-3 text-sm text-muted-foreground transition-colors hover:border-border sm:ml-4 sm:w-64 lg:w-80"
                aria-label="Search or jump to (Ctrl or Cmd + K)"
            >
                <Search className="size-4 shrink-0" />
                <span className="truncate">Search or jump to…</span>
                <kbd className="ml-auto hidden rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium sm:block">
                    ⌘K
                </kbd>
            </button>

            <div className="flex items-center gap-0.5 sm:gap-1">
                <Button size="sm" className="hidden gap-1.5 sm:flex" onClick={() => openTransactionDialog()}>
                    <Plus className="size-4" /> Add
                </Button>
                <Button size="icon" className="sm:hidden" aria-label="Add transaction" onClick={() => openTransactionDialog()}>
                    <Plus className="size-4" />
                </Button>

                {aiEnabled && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleCopilot}
                        aria-label="Ask AI Copilot (Ctrl or Cmd + J)"
                        title="Ask AI Copilot (⌘J)"
                    >
                        <Sparkles className="size-4 text-primary" />
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleHideAmounts}
                    aria-label={hideAmounts ? "Show amounts" : "Hide amounts"}
                    aria-pressed={hideAmounts}
                    title={hideAmounts ? "Show amounts" : "Hide amounts"}
                >
                    {hideAmounts ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>

                <ThemeToggle />
                <NotificationsPopover />

                <div className="ml-1 hidden sm:block">
                    <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
                </div>
            </div>
        </header>
    );
}
