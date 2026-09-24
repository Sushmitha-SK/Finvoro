"use client";

import { useUser } from "@clerk/nextjs";
import { Plus, Sparkles } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { useUIStore } from "@/stores/ui-store";

const subscribeNever = () => () => undefined;

function greetingNow() {
    const hour = new Date().getHours();

    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

export function DashboardHeader({ monthLabel }: { monthLabel: string }) {
    const firstName = useUser().user?.firstName;
    const greeting = useSyncExternalStore(subscribeNever, greetingNow, () => "Welcome back");
    const aiEnabled = useAppStore((state) => state.aiEnabled);
    const openDialog = useUIStore((state) => state.openTransactionDialog);
    const askCopilot = useUIStore((state) => state.askCopilot);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                    {greeting}
                    {firstName ? `, ${firstName}` : ""}
                </h2>
                <p className="text-sm text-muted-foreground">Here&apos;s your financial picture for {monthLabel}.</p>
            </div>

            <div className="flex gap-2">
                {aiEnabled && (
                    <Button variant="outline" className="gap-1.5" onClick={() => askCopilot("Give me a quick summary of how I'm doing this month and one thing to focus on.")}>
                        <Sparkles className="size-4 text-primary" /> Ask Copilot
                    </Button>
                )}
                <Button className="gap-1.5" onClick={() => openDialog()}>
                    <Plus className="size-4" /> Add transaction
                </Button>
            </div>
        </div>
    );
}
