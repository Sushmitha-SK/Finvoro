import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { CommandPalette } from "@/components/command/command-palette";
import { CopilotSheet } from "@/components/copilot/copilot-sheet";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppEffects } from "@/components/providers/app-effects";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCategoryOptions } from "@/lib/data/categories";
import { getUserPreferences } from "@/lib/data/preferences";
import { AppStoreProvider } from "@/stores/app-store";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const [preferences, categories] = await Promise.all([
        getUserPreferences(userId),
        getCategoryOptions(userId),
    ]);

    return (
        <AppStoreProvider
            init={{ currency: preferences.currency, aiEnabled: preferences.aiEnabled, categories }}
        >
            <SidebarProvider>
                <AppSidebar />

                <SidebarInset>
                    <AppHeader />

                    <main className="flex-1">{children}</main>
                </SidebarInset>
            </SidebarProvider>

            <AppEffects userId={userId} />
            <TransactionDialog />
            <CommandPalette />
            <CopilotSheet />
            <Toaster />
        </AppStoreProvider>
    );
}
