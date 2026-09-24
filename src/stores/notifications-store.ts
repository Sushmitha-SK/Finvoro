import { toast } from "sonner";
import { create } from "zustand";

export type NotificationItem = {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
};

type NotificationsState = {
    items: NotificationItem[];
    unreadCount: number;
    status: "idle" | "loading" | "ready" | "error";

    fetch: () => Promise<void>;
    markRead: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
    remove: (id: string) => Promise<void>;
};

let knownIds: Set<string> | null = null;

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
    items: [],
    unreadCount: 0,
    status: "idle",

    fetch: async () => {
        if (get().status === "idle") set({ status: "loading" });

        try {
            const response = await fetch("/api/notifications", { cache: "no-store" });

            if (!response.ok) throw new Error("bad response");

            const data = (await response.json()) as {
                notifications: NotificationItem[];
                unreadCount: number;
            };

            if (knownIds) {
                for (const item of data.notifications) {
                    if (!knownIds.has(item.id) && !item.read) {
                        toast(item.title, { description: item.message });
                    }
                }
            }

            knownIds = new Set(data.notifications.map((item) => item.id));
            set({ items: data.notifications, unreadCount: data.unreadCount, status: "ready" });
        } catch {
            set({ status: get().items.length ? "ready" : "error" });
        }
    },

    markRead: async (id) => {
        const previous = get();
        const target = previous.items.find((item) => item.id === id);

        if (!target || target.read) return;

        set({
            items: previous.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
            unreadCount: Math.max(previous.unreadCount - 1, 0),
        });

        const response = await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        }).catch(() => null);

        if (!response?.ok) {
            set({ items: previous.items, unreadCount: previous.unreadCount });
            toast.error("Couldn't update the notification.");
        }
    },

    markAllRead: async () => {
        const previous = get();

        if (previous.unreadCount === 0) return;

        set({ items: previous.items.map((item) => ({ ...item, read: true })), unreadCount: 0 });

        const response = await fetch("/api/notifications", { method: "PUT" }).catch(() => null);

        if (!response?.ok) {
            set({ items: previous.items, unreadCount: previous.unreadCount });
            toast.error("Couldn't mark notifications as read.");
        }
    },

    remove: async (id) => {
        const previous = get();
        const target = previous.items.find((item) => item.id === id);

        if (!target) return;

        set({
            items: previous.items.filter((item) => item.id !== id),
            unreadCount: target.read ? previous.unreadCount : Math.max(previous.unreadCount - 1, 0),
        });

        const response = await fetch("/api/notifications", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        }).catch(() => null);

        if (!response?.ok) {
            set({ items: previous.items, unreadCount: previous.unreadCount });
            toast.error("Couldn't delete the notification.");
        }
    },
}));
