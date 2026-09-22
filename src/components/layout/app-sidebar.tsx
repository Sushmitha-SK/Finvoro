"use client";

import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FinvoroLogo } from "@/components/layout/finvoro-logo";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    aiNavigation,
    mainNavigation,
    secondaryNavigation,
    type NavItem,
} from "@/config/navigation";
import { useAppStore } from "@/stores/app-store";
import { useNotificationsStore } from "@/stores/notifications-store";

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
    const pathname = usePathname();
    const { isMobile, setOpenMobile } = useSidebar();
    const unread = useNotificationsStore((state) => state.unreadCount);

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive =
                            pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    isActive={isActive}
                                    tooltip={item.title}
                                    render={<Link href={item.href} />}
                                    onClick={() => isMobile && setOpenMobile(false)}
                                >
                                    <item.icon />
                                    <span>{item.title}</span>

                                    {item.href === "/notifications" && unread > 0 && (
                                        <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-4 text-primary-foreground group-data-[collapsible=icon]:hidden">
                                            {unread}
                                        </span>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

export function AppSidebar() {
    const { user } = useUser();
    const aiEnabled = useAppStore((state) => state.aiEnabled);

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" tooltip="Finvoro" render={<Link href="/dashboard" />}>
                            <FinvoroLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavGroup label="Overview" items={mainNavigation} />
                {aiEnabled && <NavGroup label="Intelligence" items={aiNavigation} />}
                <NavGroup label="General" items={secondaryNavigation} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-2 px-2 py-2">
                            <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />

                            <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                                <span className="truncate text-sm font-medium">
                                    {user?.fullName ?? user?.firstName ?? "My Account"}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user?.primaryEmailAddress?.emailAddress ?? "Manage profile"}
                                </span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
