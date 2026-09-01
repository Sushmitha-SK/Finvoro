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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

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
        return <TriangleAlert className="size-5" />;
    }

    if (type === "expense") {
        return <CircleDollarSign className="size-5" />;
    }

    return <Info className="size-5" />;
}

function getNotificationIconClass(
    type: string,
    read: boolean,
) {
    if (read) {
        return "bg-muted text-muted-foreground";
    }

    if (
        type.startsWith("budget-warning:") ||
        type.startsWith("budget-exceeded:")
    ) {
        return "bg-destructive/10 text-destructive";
    }

    if (type === "expense") {
        return "bg-primary/10 text-primary";
    }

    return "bg-primary/10 text-primary";
}

function formatNotificationDate(date: string) {
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

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return notificationDate.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    );
}

export function NotificationsList() {
    const [notifications, setNotifications] =
        useState<NotificationItem[]>([]);

    const [unreadCount, setUnreadCount] =
        useState(0);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(false);

            const response = await fetch(
                "/api/notifications",
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch notifications",
                );
            }

            const data: NotificationsResponse =
                await response.json();

            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
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
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch(
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

            setNotifications((current) =>
                current.map((notification) =>
                    notification.id === id
                        ? {
                            ...notification,
                            read: true,
                        }
                        : notification,
                ),
            );

            setUnreadCount((current) =>
                Math.max(current - 1, 0),
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error,
            );
        }
    };

    const markAllAsRead = async () => {
        if (unreadCount === 0) {
            return;
        }

        try {
            const response = await fetch(
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

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    read: true,
                })),
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(
                "Failed to mark notifications as read:",
                error,
            );
        }
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map(
                    (_, index) => (
                        <Card key={index}>
                            <CardContent className="p-5">
                                <div className="flex gap-4">
                                    <Skeleton className="size-10 shrink-0 rounded-full" />

                                    <div className="flex-1 space-y-3">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-4 w-4/5" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ),
                )}
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                        <Info className="size-5 text-muted-foreground" />
                    </div>

                    <h2 className="mt-4 font-semibold">
                        Unable to load notifications
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Something went wrong while loading your
                        notifications.
                    </p>

                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={fetchNotifications}
                    >
                        Try again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        {notifications.length === 0
                            ? "No notifications yet"
                            : `${notifications.length} ${notifications.length === 1
                                ? "notification"
                                : "notifications"
                            }`}
                    </p>

                    {unreadCount > 0 && (
                        <Badge
                            variant="secondary"
                            className="mt-2"
                        >
                            {unreadCount} unread
                        </Badge>
                    )}
                </div>

                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllAsRead}
                    >
                        <CheckCheck />
                        Mark all as read
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <Card>
                    <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                            <Bell className="size-6 text-muted-foreground" />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold">
                            You're all caught up
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            Important updates about your budgets,
                            expenses, and account activity will
                            appear here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {notifications.map(
                                (notification) => (
                                    <div
                                        key={
                                            notification.id
                                        }
                                        className={`flex gap-4 p-5 transition-colors hover:bg-muted/50 ${notification.read
                                            ? ""
                                            : "bg-primary/5"
                                            }`}
                                    >
                                        <div
                                            className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ${getNotificationIconClass(
                                                notification.type,
                                                notification.read,
                                            )}`}
                                        >
                                            {getNotificationIcon(
                                                notification.type,
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                                <div className="flex items-center gap-2">
                                                    <h3
                                                        className={`text-sm ${notification.read
                                                            ? "font-medium"
                                                            : "font-semibold"
                                                            }`}
                                                    >
                                                        {
                                                            notification.title
                                                        }
                                                    </h3>

                                                    {!notification.read && (
                                                        <span className="size-2 shrink-0 rounded-full bg-primary" />
                                                    )}
                                                </div>

                                                <span className="shrink-0 text-xs text-muted-foreground">
                                                    {formatNotificationDate(
                                                        notification.createdAt,
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            {!notification.read && (
                                                <>
                                                    <Separator className="my-3" />

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2"
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification.id,
                                                            )
                                                        }
                                                    >
                                                        <Check />
                                                        Mark as read
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}