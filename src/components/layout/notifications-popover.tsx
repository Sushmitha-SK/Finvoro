"use client";

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatRelativeTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useNotificationsStore } from "@/stores/notifications-store";

export function NotificationsPopover() {
    const items = useNotificationsStore((state) => state.items);
    const unreadCount = useNotificationsStore((state) => state.unreadCount);
    const status = useNotificationsStore((state) => state.status);
    const markRead = useNotificationsStore((state) => state.markRead);
    const markAllRead = useNotificationsStore((state) => state.markAllRead);

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                    />
                }
            >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 gap-0 p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <p className="text-sm font-semibold">Notifications</p>

                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={markAllRead}>
                            <CheckCheck className="size-3.5" /> Mark all read
                        </Button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {status !== "ready" && items.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                            {status === "error" ? "Couldn't load notifications." : "Loading…"}
                        </p>
                    ) : items.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                            You&apos;re all caught up.
                        </p>
                    ) : (
                        items.slice(0, 6).map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => markRead(item.id)}
                                className={cn(
                                    "flex w-full gap-3 border-b px-4 py-3 text-left text-sm transition-colors last:border-b-0 hover:bg-muted/60",
                                    !item.read && "bg-primary/5",
                                )}
                            >
                                <span
                                    className={cn(
                                        "mt-1.5 size-2 shrink-0 rounded-full",
                                        item.read ? "bg-transparent" : "bg-primary",
                                    )}
                                />
                                <span className="min-w-0">
                                    <span className="block font-medium">{item.title}</span>
                                    <span className="line-clamp-2 block text-xs text-muted-foreground">
                                        {item.message}
                                    </span>
                                    <span className="mt-1 block text-[11px] text-muted-foreground">
                                        {formatRelativeTime(item.createdAt)}
                                    </span>
                                </span>
                            </button>
                        ))
                    )}
                </div>

                <div className="border-t p-2">
                    <Button variant="ghost" size="sm" className="w-full" nativeButton={false} render={<Link href="/notifications" />}>
                        View all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

/** Loads notifications and keeps them fresh while the tab is visible. */
export function useNotificationPolling(intervalMs = 60_000) {
    const fetchNotifications = useNotificationsStore((state) => state.fetch);

    useEffect(() => {
        void fetchNotifications();

        const tick = () => {
            if (document.visibilityState === "visible") void fetchNotifications();
        };

        const timer = window.setInterval(tick, intervalMs);

        document.addEventListener("visibilitychange", tick);

        return () => {
            window.clearInterval(timer);
            document.removeEventListener("visibilitychange", tick);
        };
    }, [fetchNotifications, intervalMs]);
}
