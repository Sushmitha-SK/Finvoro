"use client";

import {
    Search,
} from "lucide-react";

import { UserButton } from "@clerk/nextjs";
import { NotificationsPopover } from "./notifications-popover";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function AppHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80">
            <SidebarTrigger />

            <Separator
                orientation="vertical"
                className="h-6"
            />

            <div className="hidden max-w-md flex-1 md:flex">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search transactions..."
                        className="h-9 w-full rounded-full border-transparent bg-muted pl-9 focus-visible:border-ring focus-visible:bg-background"
                    />
                </div>
            </div>

            <div className="ml-auto flex items-center gap-1">
                <NotificationsPopover />

                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "size-8",
                        },
                    }}
                />
            </div>
        </header>
    );
}