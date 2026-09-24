import { SettingsView } from "@/components/settings/settings-view";
import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your account and Finvoro preferences.
                    </p>
                </div>

                <SettingsView
                    name={user.fullName || user.username || "User"}
                    email={user.primaryEmailAddress?.emailAddress || "No email available"}
                />
            </div>
        </div>

    );
}
