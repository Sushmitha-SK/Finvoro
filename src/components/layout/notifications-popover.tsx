"use client";

import {
    Bell,
    Check,
    CheckCheck,
    CircleDollarSign,
    Info,
    TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
};

type NotificationsResponse = {
    notifications: NotificationItem[];
    unreadCount: number;
};

function getNotificationIcon(type: string) {
    if (
        type.startsWith("budget-warning:") ||
        type.startsWith("budget-exceeded:")
    ) {
        return (
            <TriangleAlert className="size-4" />
        );
    }

    if (type === "expense") {
        return (
            <CircleDollarSign className="size-4" />
        );
    }

    return <Info className="size-4" />;
}

function formatNotificationDate(
    date: string,
) {
    const notificationDate = new Date(date);
    const now = new Date();

    const diff =
        now.getTime() -
        notificationDate.getTime();

    const minutes = Math.floor(
        diff / (1000 * 60),
    );

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(
        minutes / 60,
    );

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(
        hours / 24,
    );

    if (days < 7) {
        return `${days}d ago`;
    }

    return notificationDate.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
        },
    );
}

export function NotificationsPopover() {
    const [open, setOpen] = useState(false);

    const [notifications, setNotifications] =
        useState<NotificationItem[]>([]);

    const [unreadCount, setUnreadCount] =
        useState(0);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(false);

    const fetchNotifications =
        async () => {
            try {
                setLoading(true);
                setError(false);

                const response =
                    await fetch(
                        "/api/notifications",
                    );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch notifications",
                    );
                }

                const data: NotificationsResponse =
                    await response.json();

                setNotifications(
                    data.notifications,
                );

                setUnreadCount(
                    data.unreadCount,
                );
            } catch (error) {
                console.error(
                    "Failed to fetch notifications:",
                    error,
                );

                setError(true);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchNotifications();
        }, 0);

        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    const markAsRead = async (
        id: string,
    ) => {
        try {
            const response =
                await fetch(
                    "/api/notifications",
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            id,
                        }),
                    },
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to mark notification as read",
                );
            }

            setNotifications(
                (current) =>
                    current.map(
                        (notification) =>
                            notification.id ===
                                id
                                ? {
                                    ...notification,
                                    read: true,
                                }
                                : notification,
                    ),
            );

            setUnreadCount(
                (current) =>
                    Math.max(
                        current - 1,
                        0,
                    ),
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error,
            );
        }
    };

    const markAllAsRead =
        async () => {
            if (unreadCount === 0) {
                return;
            }

            try {
                const response =
                    await fetch(
                        "/api/notifications",
                        {
                            method: "PUT",
                        },
                    );

                if (!response.ok) {
                    throw new Error(
                        "Failed to mark notifications as read",
                    );
                }

                setNotifications(
                    (current) =>
                        current.map(
                            (
                                notification,
                            ) => ({
                                ...notification,
                                read: true,
                            }),
                        ),
                );

                setUnreadCount(0);
            } catch (error) {
                console.error(
                    "Failed to mark notifications as read:",
                    error,
                );
            }
        };

    return (
        <Popover
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);

                if (nextOpen) {
                    fetchNotifications();
                }
            }}
        >
            <PopoverTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        aria-label={
                            unreadCount > 0
                                ? `Notifications, ${unreadCount} unread`
                                : "Notifications"
                        }
                    />
                }
            >
                <Bell className="size-5" />

                {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-destructive-foreground">
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-[calc(100vw-2rem)] p-0 sm:w-96"
            >
                <div className="flex items-center justify-between px-4 py-3">
                    <div>
                        <h2 className="font-semibold">
                            Notifications
                        </h2>

                        <p className="text-xs text-muted-foreground">
                            {unreadCount > 0
                                ? `${unreadCount} unread`
                                : `You&apos;re all caught up.`}
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={
                                markAllAsRead
                            }
                        >
                            <CheckCheck />
                            Mark all read
                        </Button>
                    )}
                </div>

                <Separator />

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                            Loading notifications...
                        </p>
                    </div>
                ) : error ? (
                    <div className="flex h-64 flex-col items-center justify-center px-6 text-center">
                        <Info className="size-5 text-muted-foreground" />

                        <p className="mt-3 text-sm font-medium">
                            Unable to load notifications
                        </p>

                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={
                                fetchNotifications
                            }
                        >
                            Try again
                        </Button>
                    </div>
                ) : notifications.length ===
                    0 ? (
                    <div className="flex h-64 flex-col items-center justify-center px-6 text-center">
                        <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                            <Bell className="size-5 text-muted-foreground" />
                        </div>

                        <p className="mt-3 text-sm font-medium">
                            No notifications
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            You&apos;re all caught up. New updates will appear here.
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-96">
                        <div className="divide-y">
                            {notifications.map(
                                (
                                    notification,
                                ) => (
                                    <div
                                        key={
                                            notification.id
                                        }
                                        className={`group flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${notification.read
                                            ? ""
                                            : "bg-primary/5"
                                            }`}
                                    >
                                        <div
                                            className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${notification.read
                                                ? "bg-muted text-muted-foreground"
                                                : "bg-primary/10 text-primary"
                                                }`}
                                        >
                                            {getNotificationIcon(
                                                notification.type,
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p
                                                    className={`text-sm ${notification.read
                                                        ? "font-medium"
                                                        : "font-semibold"
                                                        }`}
                                                >
                                                    {
                                                        notification.title
                                                    }
                                                </p>

                                                <span className="shrink-0 text-[11px] text-muted-foreground">
                                                    {formatNotificationDate(
                                                        notification.createdAt,
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="mt-2 h-7 px-2 text-xs"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id,
                                                        )
                                                    }
                                                >
                                                    <Check />
                                                    Mark as read
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </ScrollArea>
                )}
            </PopoverContent>
        </Popover>
    );
}