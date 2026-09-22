import { create } from "zustand";

import type { Insight } from "@/types/finance";

export type InsightsRequest =
    | { scope: "dashboard" }
    | { scope: "reports"; from: string; to: string };

export type InsightsEntry = {
    status: "loading" | "ready" | "error";
    headline?: string;
    insights: Insight[];
    error?: string;
    code?: string;
    fetchedAt?: number;
};

type InsightsState = {
    entries: Record<string, InsightsEntry>;
    load: (key: string, request: InsightsRequest, options?: { force?: boolean }) => Promise<void>;
    invalidateAll: () => void;
};

/** Gemini calls cost money, so results are reused for a while. */
const TTL_MS = 30 * 60 * 1000;
const inflight = new Map<string, Promise<void>>();

export const useInsightsStore = create<InsightsState>()((set, get) => ({
    entries: {},

    load: async (key, request, options = {}) => {
        const current = get().entries[key];
        const fresh =
            current?.status === "ready" && current.fetchedAt && Date.now() - current.fetchedAt < TTL_MS;

        if (!options.force && fresh) return;

        const pending = inflight.get(key);

        if (pending) return pending;

        set((state) => ({
            entries: {
                ...state.entries,
                [key]: { status: "loading", insights: current?.insights ?? [], headline: current?.headline },
            },
        }));

        const run = (async () => {
            try {
                const response = await fetch("/api/ai/insights", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(request),
                });
                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    set((state) => ({
                        entries: {
                            ...state.entries,
                            [key]: {
                                status: "error",
                                insights: [],
                                error: data.error ?? "Couldn't generate insights.",
                                code: data.code,
                            },
                        },
                    }));

                    return;
                }

                set((state) => ({
                    entries: {
                        ...state.entries,
                        [key]: {
                            status: "ready",
                            headline: data.headline,
                            insights: data.insights,
                            fetchedAt: Date.now(),
                        },
                    },
                }));
            } catch {
                set((state) => ({
                    entries: {
                        ...state.entries,
                        [key]: { status: "error", insights: [], error: "Network error. Please try again." },
                    },
                }));
            } finally {
                inflight.delete(key);
            }
        })();

        inflight.set(key, run);

        return run;
    },

    invalidateAll: () => set({ entries: {} }),
}));
