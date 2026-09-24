import type { Metadata } from "next";

import { NotificationsList } from "@/components/notifications/notifications-list";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
    return (
   
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Notifications
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Stay up to date with budget alerts and important activity.
                    </p>
                </div>

                <NotificationsList />
            </div>
        </div>
    );
}
