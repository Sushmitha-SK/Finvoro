import { SettingsView } from "@/components/settings/settings-view";
import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    return (
        <SettingsView
            name={user.fullName || user.username || "User"}
            email={user.primaryEmailAddress?.emailAddress || "No email available"}
        />
    );
}
