"use client";

import { UserButton } from "@clerk/nextjs";
import {
    Eye,
    EyeOff,
    Search,
    Sparkles,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { NotificationsPopover } from "@/components/layout/notifications-popover";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { titleForPath } from "@/config/navigation";
import { useAppStore } from "@/stores/app-store";
import { useUIStore } from "@/stores/ui-store";

export function AppHeader() {
    const pathname = usePathname();

    const aiEnabled = useAppStore((state) => state.aiEnabled);
    const hideAmounts = useAppStore((state) => state.hideAmounts);
    const toggleHideAmounts = useAppStore(
        (state) => state.toggleHideAmounts,
    );

    const setCommandOpen = useUIStore((state) => state.setCommandOpen);
    const toggleCopilot = useUIStore((state) => state.toggleCopilot);

    return (
            <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/40 bg-background/60 px-4 backdrop-blur-xl supports-backdrop-filter:bg-background/40 sm:px-6">
           <div className="flex w-full items-center justify-between gap-3">
                {/* Left */}
                <div className="flex min-w-0 items-center gap-2.5">
                    <SidebarTrigger
                        className="size-9 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Toggle sidebar"
                    />

                    <div className="hidden h-5 w-px bg-border sm:block" />

                    <div className="hidden min-w-0 sm:block">
                        <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">
                            {titleForPath(pathname)}
                        </h1>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setCommandOpen(true)}
                    aria-label="Search or jump to (Ctrl or Cmd + K)"
                    className="group absolute left-1/2 hidden h-9 w-full max-w-70 -translate-x-1/2 items-center gap-2 rounded-lg border border-border/70 bg-background/70 px-3 text-sm text-muted-foreground shadow-xs transition-all hover:border-border hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 md:flex lg:max-w-sm"
                >
                    <Search className="size-4 shrink-0 transition-colors group-hover:text-foreground" />

                    <span className="truncate">
                        Search transactions, pages...
                    </span>

                    <kbd className="ml-auto flex shrink-0 items-center gap-0.5 rounded-md border border-border/70 bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-xs">
                        <span>⌘</span>
                        <span>K</span>
                    </kbd>
                </button>

                {/* Right */}
                <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
                    {/* Mobile Search */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCommandOpen(true)}
                        aria-label="Search"
                        className="size-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
                    >
                        <Search className="size-4" />
                    </Button>

                    {aiEnabled && (
                        <>
                            <div className="mx-1 hidden h-5 w-px bg-border/70 sm:block" />

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleCopilot}
                                aria-label="Ask AI Copilot (Ctrl or Cmd + J)"
                                title="AI Copilot · ⌘J"
                                className="group relative size-9 rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                                <Sparkles className="size-4 transition-transform duration-200 group-hover:scale-110" />

                                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary ring-2 ring-background" />
                            </Button>
                        </>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleHideAmounts}
                        aria-label={
                            hideAmounts ? "Show amounts" : "Hide amounts"
                        }
                        aria-pressed={hideAmounts}
                        title={
                            hideAmounts
                                ? "Show amounts"
                                : "Hide amounts"
                        }
                        className="size-9 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        {hideAmounts ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                    </Button>

                    <ThemeToggle />

                    <NotificationsPopover />

                    <div className="mx-1 hidden h-6 w-px bg-border/70 sm:block" />

                    <div className="ml-0.5 flex items-center">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox:
                                        "size-8 rounded-full ring-1 ring-border/70 transition-shadow hover:ring-2 hover:ring-primary/20",
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}

