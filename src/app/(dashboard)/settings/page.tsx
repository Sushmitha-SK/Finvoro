import { currentUser } from "@clerk/nextjs/server";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PreferencesCard } from "@/components/settings/preferences-card";

export default async function SettingsPage() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    const name =
        user.fullName ||
        user.username ||
        "User";

    const email =
        user.primaryEmailAddress?.emailAddress ||
        "No email available";

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your account and Finvoro preferences.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>

                        <CardDescription>
                            Your account information from your Finvoro profile.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium">
                                    Name
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Email
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {email}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <PreferencesCard />
            </div>
        </div>
    );
}