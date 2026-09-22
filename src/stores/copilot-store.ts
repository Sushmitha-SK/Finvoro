import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ChatEvent, TransactionDraft } from "@/lib/ai/tools";
import { toDateInput } from "@/lib/dates";

export type CopilotTool = {
    name: string;
    label: string;
    status: "running" | "done" | "error";
};

export type CopilotMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    tools: CopilotTool[];
    drafts: TransactionDraft[];
    error?: { message: string; code?: string };
};

type CopilotState = {
    /** Clerk user the persisted history belongs to. */
    ownerId: string | null;
    messages: CopilotMessage[];
    status: "idle" | "streaming";

    claim: (userId: string) => void;
    send: (text: string) => Promise<void>;
    stop: () => void;
    retry: () => Promise<void>;
    clear: () => void;
    dismissDraft: (messageId: string, index: number) => void;
};

let controller: AbortController | null = null;

const uid = () => Math.random().toString(36).slice(2, 10);
const MAX_PERSISTED = 40;

export const useCopilotStore = create<CopilotState>()(
    persist(
        (set, get) => {
            const patch = (id: string, update: (message: CopilotMessage) => CopilotMessage) =>
                set((state) => ({
                    messages: state.messages.map((message) =>
                        message.id === id ? update(message) : message,
                    ),
                }));

            const apply = (id: string, event: ChatEvent) => {
                switch (event.type) {
                    case "text":
                        patch(id, (m) => ({ ...m, content: m.content + event.text }));
                        break;
                    case "tool":
                        patch(id, (m) => {
                            const rest = m.tools.filter(
                                (tool) => !(tool.name === event.name && tool.status === "running"),
                            );

                            return {
                                ...m,
                                tools: [...rest, { name: event.name, label: event.label, status: event.status }],
                            };
                        });
                        break;
                    case "draft":
                        patch(id, (m) => ({ ...m, drafts: [...m.drafts, event.draft] }));
                        break;
                    case "error":
                        patch(id, (m) => ({ ...m, error: { message: event.message, code: event.code } }));
                        break;
                    case "done":
                        break;
                }
            };

            return {
                ownerId: null,
                messages: [],
                status: "idle",

                claim: (userId) => {
                    if (get().ownerId !== userId) {
                        set({ ownerId: userId, messages: [], status: "idle" });
                    }
                },

                send: async (text) => {
                    const content = text.trim();

                    if (!content || get().status === "streaming") return;

                    const assistantId = uid();
                    const history = get()
                        .messages.filter((message) => message.content && !message.error)
                        .map((message) => ({ role: message.role, content: message.content }));

                    set((state) => ({
                        status: "streaming",
                        messages: [
                            ...state.messages,
                            { id: uid(), role: "user", content, tools: [], drafts: [] },
                            { id: assistantId, role: "assistant", content: "", tools: [], drafts: [] },
                        ],
                    }));

                    controller = new AbortController();

                    try {
                        const response = await fetch("/api/ai/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                messages: [...history, { role: "user", content }],
                                today: toDateInput(new Date()),
                            }),
                            signal: controller.signal,
                        });

                        if (!response.ok || !response.body) {
                            const data = await response.json().catch(() => ({}));

                            patch(assistantId, (m) => ({
                                ...m,
                                error: {
                                    message: data.error ?? "The Copilot couldn't respond. Please try again.",
                                    code: data.code,
                                },
                            }));

                            return;
                        }

                        const reader = response.body.getReader();
                        const decoder = new TextDecoder();
                        let buffer = "";

                        for (;;) {
                            const { value, done } = await reader.read();

                            if (done) break;

                            buffer += decoder.decode(value, { stream: true });

                            let newline = buffer.indexOf("\n");

                            while (newline !== -1) {
                                const line = buffer.slice(0, newline).trim();

                                buffer = buffer.slice(newline + 1);
                                newline = buffer.indexOf("\n");

                                if (!line) continue;

                                try {
                                    apply(assistantId, JSON.parse(line) as ChatEvent);
                                } catch {
                                    // ignore a malformed line rather than killing the stream
                                }
                            }
                        }
                    } catch (error) {
                        if ((error as Error).name !== "AbortError") {
                            patch(assistantId, (m) => ({
                                ...m,
                                error: { message: "Connection lost. Please try again." },
                            }));
                        }
                    } finally {
                        controller = null;
                        set({ status: "idle" });
                    }
                },

                stop: () => controller?.abort(),

                retry: async () => {
                    const { messages, status } = get();

                    if (status === "streaming") return;

                    const lastUser = messages.map((m) => m.role).lastIndexOf("user");

                    if (lastUser < 0) return;

                    const text = messages[lastUser].content;

                    set({ messages: messages.slice(0, lastUser) });
                    await get().send(text);
                },

                clear: () => {
                    controller?.abort();
                    set({ messages: [], status: "idle" });
                },

                dismissDraft: (messageId, index) =>
                    patch(messageId, (m) => ({
                        ...m,
                        drafts: m.drafts.filter((_, i) => i !== index),
                    })),
            };
        },
        {
            name: "finvoro:copilot",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                ownerId: state.ownerId,
                messages: state.messages.slice(-MAX_PERSISTED),
            }),
            skipHydration: true,
        },
    ),
);
