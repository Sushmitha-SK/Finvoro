import { Bell } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { NotificationsList } from "@/components/notifications/notifications-list";

export default async function NotificationsPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                            <Bell className="size-5 text-primary" />
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight">
                            Notifications
                        </h1>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Stay up to date with your financial activity
                        and important alerts.
                    </p>
                </div>

                <NotificationsList />
            </div>
        </div>
    );
}