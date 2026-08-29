// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarGroup,
//     SidebarGroupContent,
//     SidebarGroupLabel,
//     SidebarHeader,
//     SidebarMenu,
//     SidebarMenuButton,
//     SidebarMenuItem,
//     SidebarRail,
// } from "@/components/ui/sidebar";

// import { FinvoroLogo } from "@/components/layout/finvoro-logo";
// import {
//     mainNavigation,
//     secondaryNavigation,
// } from "@/config/navigation";

// export function AppSidebar() {
//     const pathname = usePathname();

//     const isActiveRoute = (href: string) => {
//         if (href === "/dashboard") {
//             return pathname === "/dashboard";
//         }

//         return pathname.startsWith(href);
//     };

//     return (
//         <Sidebar collapsible="icon" variant="sidebar">
//             <SidebarHeader>
//                 <SidebarMenu>
//                     <SidebarMenuItem>
//                         <SidebarMenuButton
//                             // asChild
//                             size="lg"
//                             tooltip="Finvoro"
//                         >
//                             <Link href="/dashboard">
//                                 <FinvoroLogo />
//                             </Link>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 </SidebarMenu>
//             </SidebarHeader>

//             <SidebarContent>
//                 <SidebarGroup>
//                     <SidebarGroupLabel>Overview</SidebarGroupLabel>

//                     <SidebarGroupContent>
//                         <SidebarMenu>
//                             {mainNavigation.map((item) => {
//                                 const isActive = isActiveRoute(item.href);

//                                 return (
//                                     <SidebarMenuItem key={item.href}>
//                                         <SidebarMenuButton
//                                             // asChild
//                                             isActive={isActive}
//                                             tooltip={item.title}
//                                         >
//                                             <Link href={item.href}>
//                                                 <item.icon />
//                                                 <span>{item.title}</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 );
//                             })}
//                         </SidebarMenu>
//                     </SidebarGroupContent>
//                 </SidebarGroup>

//                 <SidebarGroup>
//                     <SidebarGroupLabel>General</SidebarGroupLabel>

//                     <SidebarGroupContent>
//                         <SidebarMenu>
//                             {secondaryNavigation.map((item) => {
//                                 const isActive = isActiveRoute(item.href);

//                                 return (
//                                     <SidebarMenuItem key={item.href}>
//                                         <SidebarMenuButton
//                                             // asChild
//                                             isActive={isActive}
//                                             tooltip={item.title}
//                                         >
//                                             <Link href={item.href}>
//                                                 <item.icon />
//                                                 <span>{item.title}</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 );
//                             })}
//                         </SidebarMenu>
//                     </SidebarGroupContent>
//                 </SidebarGroup>
//             </SidebarContent>

//             <SidebarFooter>
//                 <SidebarMenu>
//                     <SidebarMenuItem>
//                         <SidebarMenuButton tooltip="Account">
//                             <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
//                                 A
//                             </div>

//                             <div className="flex min-w-0 flex-col items-start">
//                                 <span className="truncate text-sm font-medium">
//                                     Account
//                                 </span>

//                                 <span className="truncate text-xs text-muted-foreground">
//                                     Manage profile
//                                 </span>
//                             </div>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 </SidebarMenu>
//             </SidebarFooter>

//             <SidebarRail />
//         </Sidebar>
//     );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

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
} from "@/components/ui/sidebar";

import { FinvoroLogo } from "@/components/layout/finvoro-logo";
import {
    mainNavigation,
    secondaryNavigation,
} from "@/config/navigation";

export function AppSidebar() {
    const pathname = usePathname();

    const isActiveRoute = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }

        return pathname.startsWith(href);
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            // asChild
                            size="lg"
                            tooltip="Finvoro"
                        >
                            <Link href="/dashboard">
                                <FinvoroLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Overview</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavigation.map((item) => {
                                const isActive = isActiveRoute(item.href);

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            // asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>General</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondaryNavigation.map((item) => {
                                const isActive = isActiveRoute(item.href);

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            // asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-2 px-2 py-2">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "size-8",
                                    },
                                }}
                            />

                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-medium">
                                    My Account
                                </span>

                                <span className="truncate text-xs text-muted-foreground">
                                    Manage profile
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