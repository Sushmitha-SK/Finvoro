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
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                {name.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <CardTitle>Profile</CardTitle>

                                <CardDescription>
                                    Your account information from your Finvoro profile.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium">
                                    Name
                                </p>

                                <p className="mt-1 truncate text-sm text-muted-foreground">
                                    {name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Email
                                </p>

                                <p className="mt-1 truncate text-sm text-muted-foreground">
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