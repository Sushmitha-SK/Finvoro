"use client";

import { ArrowUp, Check, Loader2, RotateCcw, Sparkles, Square, Trash2, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCopilotStore, type CopilotMessage } from "@/stores/copilot-store";
import { useUIStore } from "@/stores/ui-store";

import { DraftCard } from "./draft-card";
import { Markdown } from "./markdown";

const SUGGESTIONS = [
    "How am I doing this month?",
    "Where can I cut spending?",
    "What subscriptions am I paying for?",
    "Am I on track with my budgets?",
    "Add ₹450 for lunch today",
];

function AssistantMessage({ message, streaming }: { message: CopilotMessage; streaming: boolean }) {
    const waiting = streaming && !message.content && message.tools.every((tool) => tool.status !== "running");

    return (
        <div className="flex gap-2.5">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-3.5" />
            </div>

            <div className="min-w-0 flex-1 text-sm">
                {message.tools.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                        {message.tools.map((tool, index) => (
                            <span
                                key={`${tool.name}-${index}`}
                                className="inline-flex items-center gap-1 rounded-full border bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                                {tool.status === "running" ? (
                                    <Loader2 className="size-3 animate-spin" />
                                ) : tool.status === "done" ? (
                                    <Check className="size-3 text-emerald-600" />
                                ) : (
                                    <TriangleAlert className="size-3 text-amber-600" />
                                )}
                                {tool.label}
                            </span>
                        ))}
                    </div>
                )}

                {message.content && (
                    <div className="rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
                        <Markdown>{message.content}</Markdown>
                    </div>
                )}

                {waiting && (
                    <div className="inline-flex gap-1 rounded-2xl bg-muted px-3.5 py-3" aria-label="Thinking">
                        {[0, 150, 300].map((delay) => (
                            <span
                                key={delay}
                                className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                                style={{ animationDelay: `${delay}ms` }}
                            />
                        ))}
                    </div>
                )}

                {message.drafts.map((draft, index) => (
                    <DraftCard key={index} draft={draft} messageId={message.id} index={index} />
                ))}

                {message.error && (
                    <div className="mt-2 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                        <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                        <span>{message.error.message}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function CopilotChat({ variant }: { variant: "panel" | "page" }) {
    const messages = useCopilotStore((state) => state.messages);
    const status = useCopilotStore((state) => state.status);
    const send = useCopilotStore((state) => state.send);
    const stop = useCopilotStore((state) => state.stop);
    const retry = useCopilotStore((state) => state.retry);
    const clear = useCopilotStore((state) => state.clear);
    const pendingPrompt = useUIStore((state) => state.pendingPrompt);

    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const streaming = status === "streaming";

    // A prompt queued elsewhere in the app (command palette, insight cards) runs here.
    useEffect(() => {
        if (!pendingPrompt) return;

        const prompt = useUIStore.getState().consumePendingPrompt();

        if (prompt) void send(prompt);
    }, [pendingPrompt, send]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: streaming ? "auto" : "smooth", block: "end" });
    }, [messages, streaming]);

    function submit() {
        const text = input.trim();

        if (!text || streaming) return;

        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        void send(text);
    }

    const last = messages[messages.length - 1];
    const canRetry = !streaming && last?.role === "assistant" && !!last.error;

    return (
        <div className={cn("flex min-h-0 flex-1 flex-col", variant === "page" && "mx-auto w-full max-w-3xl")}>
            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4" aria-live="polite">
                {messages.length === 0 ? (
                    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-5 text-center">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Sparkles className="size-6" />
                        </div>
                        <div>
                            <p className="text-base font-semibold">Ask anything about your money</p>
                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                I can look up transactions, compare months, check budgets and even add entries for you.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {SUGGESTIONS.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => void send(suggestion)}
                                    className="rounded-full border bg-background px-3 py-1.5 text-xs transition-colors hover:border-primary/40 hover:bg-primary/5"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) =>
                        message.role === "user" ? (
                            <div key={message.id} className="flex justify-end">
                                <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                                    {message.content}
                                </p>
                            </div>
                        ) : (
                            <AssistantMessage
                                key={message.id}
                                message={message}
                                streaming={streaming && index === messages.length - 1}
                            />
                        ),
                    )
                )}
                <div ref={endRef} />
            </div>

            <div className="border-t bg-background p-3">
                {(messages.length > 0 || canRetry) && (
                    <div className="mb-2 flex items-center justify-between">
                        {canRetry ? (
                            <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => void retry()}>
                                <RotateCcw className="size-3" /> Try again
                            </Button>
                        ) : (
                            <span />
                        )}
                        {messages.length > 0 && (
                            <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs text-muted-foreground" onClick={clear}>
                                <Trash2 className="size-3" /> New chat
                            </Button>
                        )}
                    </div>
                )}

                <div className="flex items-end gap-2 rounded-2xl border bg-background p-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        rows={1}
                        maxLength={4000}
                        placeholder="Ask about spending, budgets, goals…"
                        aria-label="Message the Copilot"
                        className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground"
                        onChange={(event) => {
                            setInput(event.target.value);
                            event.target.style.height = "auto";
                            event.target.style.height = `${Math.min(event.target.scrollHeight, 128)}px`;
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                                event.preventDefault();
                                submit();
                            }
                        }}
                    />

                    {streaming ? (
                        <Button size="icon" variant="secondary" className="size-9 shrink-0 rounded-xl" onClick={stop} aria-label="Stop generating">
                            <Square className="size-3.5 fill-current" />
                        </Button>
                    ) : (
                        <Button size="icon" className="size-9 shrink-0 rounded-xl" onClick={submit} disabled={!input.trim()} aria-label="Send message">
                            <ArrowUp className="size-4" />
                        </Button>
                    )}
                </div>

                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    Powered by Gemini. AI can make mistakes — verify important numbers.
                </p>
            </div>
        </div>
    );
}
