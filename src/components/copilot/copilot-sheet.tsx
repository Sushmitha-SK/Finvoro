"use client";

import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppStore } from "@/stores/app-store";
import { useUIStore } from "@/stores/ui-store";

import { CopilotChat } from "./copilot-chat";

/** Slide-over Copilot available on every page (⌘J). The /copilot page has its own full-size chat. */
export function CopilotSheet() {
    const pathname = usePathname();
    const aiEnabled = useAppStore((state) => state.aiEnabled);
    const open = useUIStore((state) => state.copilotOpen);
    const setOpen = useUIStore((state) => state.setCopilotOpen);

    if (!aiEnabled) return null;

    return (
        <Sheet open={open && pathname !== "/copilot"} onOpenChange={setOpen}>
            <SheetContent side="right" className="w-full gap-0 p-0 data-[side=right]:sm:max-w-md">
                <SheetHeader className="border-b p-4">
                    <SheetTitle className="flex items-center gap-2">
                        <Sparkles className="size-4 text-primary" /> AI Copilot
                    </SheetTitle>
                    <SheetDescription>Ask about your spending, budgets and goals.</SheetDescription>
                </SheetHeader>

                <CopilotChat variant="panel" />
            </SheetContent>
        </Sheet>
    );
}
