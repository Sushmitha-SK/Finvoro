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
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-sidebar px-4 backdrop-blur-md supports-backdrop-filter:bg-sideba/60 sm:px-6">
            {/* Left Section: Navigation & Page Title */}
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-muted-foreground transition-colors hover:text-foreground" />
                <Separator orientation="vertical" className="h-5" />
                <h1 className="hidden text-sm font-medium tracking-tight text-foreground sm:block">
                    {titleForPath(pathname)}
                </h1>
            </div>

            {/* Center Section: Command Search Bar */}
            <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="group flex h-9 w-full max-w-sm items-center gap-2 rounded-xl border border-border/60 bg-muted/50 px-3.5 text-sm text-muted-foreground shadow-xs transition-all hover:border-border hover:bg-muted/80 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 sm:w-64 lg:w-80"
                aria-label="Search or jump to (Ctrl or Cmd + K)"
            >
                <Search className="size-4 shrink-0 transition-colors group-hover:text-foreground" />
                <span className="truncate text-left">Search or jump to…</span>
                <kbd className="ml-auto hidden rounded-md border border-border/80 bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-2xs sm:block">
                    ⌘K
                </kbd>
            </button>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Primary Action Button */}
                <Button 
                    size="sm" 
                    className="hidden gap-1.5 rounded-lg shadow-xs transition-all hover:shadow-sm sm:flex" 
                    onClick={() => openTransactionDialog()}
                >
                    <Plus className="size-4" /> 
                    <span>Add</span>
                </Button>
                <Button 
                    size="icon" 
                    variant="default"
                    className="size-9 rounded-lg shadow-xs sm:hidden" 
                    aria-label="Add transaction" 
                    onClick={() => openTransactionDialog()}
                >
                    <Plus className="size-4" />
                </Button>

                <div className="mx-0.5 hidden h-5 w-[1px] bg-border/65 sm:block" />

                {/* AI Copilot Toggle with Subtle Highlight */}
                {aiEnabled && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleCopilot}
                        aria-label="Ask AI Copilot (Ctrl or Cmd + J)"
                        title="Ask AI Copilot (⌘J)"
                        className="relative size-9 rounded-lg hover:bg-primary/10 hover:text-primary"
                    >
                        <Sparkles className="size-4 text-primary" />
                        <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary animate-pulse" />
                    </Button>
                )}

                {/* Hide / Show Sensitive Amounts Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleHideAmounts}
                    aria-label={hideAmounts ? "Show amounts" : "Hide amounts"}
                    aria-pressed={hideAmounts}
                    title={hideAmounts ? "Show amounts" : "Hide amounts"}
                    className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
                >
                    {hideAmounts ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>

                <ThemeToggle />
                <NotificationsPopover />

                {/* User Avatar */}
                <div className="ml-1 hidden items-center sm:flex">
                    <UserButton appearance={{ elements: { avatarBox: "size-8 rounded-full ring-1 ring-border" } }} />
                </div>
            </div>
        </header>
    );
}