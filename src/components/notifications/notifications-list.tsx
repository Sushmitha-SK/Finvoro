"use client";

import { BellOff, CheckCheck, Info, OctagonAlert, Trash2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useNotificationsStore, type NotificationItem } from "@/stores/notifications-store";

function visual(type: string) {
    if (type.startsWith("budget-exceeded:")) {
        return { icon: OctagonAlert, tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400" };
    }

    if (type.startsWith("budget-warning:")) {
        return { icon: TriangleAlert, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
    }

    return { icon: Info, tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400" };
}

function Row({ item }: { item: NotificationItem }) {
    const markRead = useNotificationsStore((state) => state.markRead);
    const remove = useNotificationsStore((state) => state.remove);
    const { icon: Icon, tone } = visual(item.type);

    return (
        <li className={cn("flex items-start gap-3 px-4 py-4", !item.read && "bg-primary/5")}>
            <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", tone)}>
                <Icon className="size-4" />
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    {!item.read && <span className="size-2 rounded-full bg-primary" aria-label="Unread" />}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</p>
            </div>

            <div className="flex shrink-0 gap-1">
                {!item.read && (
                    <Button variant="ghost" size="icon" className="size-8" aria-label="Mark as read" title="Mark as read" onClick={() => markRead(item.id)}>
                        <CheckCheck className="size-4" />
                    </Button>
                )}
                <Button variant="ghost" size="icon" className="size-8" aria-label="Delete notification" title="Delete" onClick={() => remove(item.id)}>
                    <Trash2 className="size-4" />
                </Button>
            </div>
        </li>
    );
}

export function NotificationsList() {
    const items = useNotificationsStore((state) => state.items);
    const unreadCount = useNotificationsStore((state) => state.unreadCount);
    const status = useNotificationsStore((state) => state.status);
    const fetchNotifications = useNotificationsStore((state) => state.fetch);
    const markAllRead = useNotificationsStore((state) => state.markAllRead);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    useEffect(() => {
        void fetchNotifications();
    }, [fetchNotifications]);

    const visible = filter === "unread" ? items.filter((item) => !item.read) : items;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Filter notifications">
                    {(["all", "unread"] as const).map((option) => (
                        <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={filter === option}
                            onClick={() => setFilter(option)}
                            className={cn("rounded-md px-4 py-1 text-sm font-medium capitalize", filter === option ? "bg-background shadow-sm" : "text-muted-foreground")}
                        >
                            {option}
                            {option === "unread" && unreadCount > 0 && ` (${unreadCount})`}
                        </button>
                    ))}
                </div>

                <Button variant="outline" size="sm" className="gap-1.5" disabled={unreadCount === 0} onClick={markAllRead}>
                    <CheckCheck className="size-4" /> Mark all read
                </Button>
            </div>

            <Card className="overflow-hidden p-0">
                {status === "loading" || (status === "idle" && items.length === 0) ? (
                    <CardContent className="space-y-4 p-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex gap-3">
                                <Skeleton className="size-9 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                ) : status === "error" ? (
                    <CardContent className="py-12 text-center text-sm text-muted-foreground">
                        Couldn&apos;t load notifications.{" "}
                        <button type="button" className="text-primary hover:underline" onClick={() => void fetchNotifications()}>
                            Retry
                        </button>
                    </CardContent>
                ) : visible.length === 0 ? (
                    <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
                        <BellOff className="size-8 text-muted-foreground" />
                        <p className="font-medium">{filter === "unread" ? "No unread notifications" : "You're all caught up"}</p>
                        <p className="max-w-sm text-sm text-muted-foreground">Budget alerts will appear here when you approach or exceed a limit.</p>
                    </CardContent>
                ) : (
                    <ul className="divide-y">
                        {visible.map((item) => (
                            <Row key={item.id} item={item} />
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}
