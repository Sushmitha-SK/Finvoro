import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <AppHeader />

                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}