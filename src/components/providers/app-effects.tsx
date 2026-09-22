"use client";

import { useEffect } from "react";

import { useNotificationPolling } from "@/components/layout/notifications-popover";
import { useAppStore } from "@/stores/app-store";
import { useCopilotStore } from "@/stores/copilot-store";
import { useUIStore } from "@/stores/ui-store";

/**
 * Side effects that belong to the signed-in shell:
 *  - restore the Copilot conversation (per user) from localStorage
 *  - poll notifications
 *  - global keyboard shortcuts
 */
export function AppEffects({ userId }: { userId: string }) {
    const aiEnabled = useAppStore((state) => state.aiEnabled);

    useNotificationPolling();

    useEffect(() => {
        void Promise.resolve(useCopilotStore.persist.rehydrate()).then(() => {
            useCopilotStore.getState().claim(userId);
        });
    }, [userId]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const mod = event.metaKey || event.ctrlKey;

            if (!mod) return;

            const key = event.key.toLowerCase();

            if (key === "k") {
                event.preventDefault();
                useUIStore.getState().toggleCommand();
            } else if (key === "j" && aiEnabled) {
                event.preventDefault();
                useUIStore.getState().toggleCopilot();
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [aiEnabled]);

    return null;
}
