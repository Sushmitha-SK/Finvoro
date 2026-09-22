import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import { CopilotChat } from "@/components/copilot/copilot-chat";
import { getUserId } from "@/lib/auth";
import { getUserPreferences } from "@/lib/data/preferences";

export const metadata: Metadata = { title: "AI Copilot" };

export default async function CopilotPage() {
    const userId = await getUserId();

    if (!userId) redirect("/sign-in");

    const { aiEnabled } = await getUserPreferences(userId);

    if (!aiEnabled) {
        return (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-24 text-center">
                <Sparkles className="size-8 text-muted-foreground" />
                <h2 className="text-lg font-semibold">AI features are turned off</h2>
                <p className="text-sm text-muted-foreground">
                    Enable them in Settings → AI & privacy to chat with the Copilot.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col">
            <CopilotChat variant="page" />
        </div>
    );
}
