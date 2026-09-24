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
        <div className="flex gap-3 animate-in fade-in-50 duration-200">
            <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
                <Sparkles className="size-4" />
            </div>

            <div className="min-w-0 flex-1 space-y-2 text-sm">
                {message.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {message.tools.map((tool, index) => (
                            <span
                                key={`${tool.name}-${index}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs"
                            >
                                {tool.status === "running" ? (
                                    <Loader2 className="size-3 animate-spin text-primary" />
                                ) : tool.status === "done" ? (
                                    <Check className="size-3 text-emerald-500" />
                                ) : (
                                    <TriangleAlert className="size-3 text-amber-500" />
                                )}
                                {tool.label}
                            </span>
                        ))}
                    </div>
                )}

                {message.content && (
                    <div className="rounded-2xl rounded-tl-sm bg-muted/70 border border-border/40 px-4 py-3 shadow-2xs leading-relaxed">
                        <Markdown>{message.content}</Markdown>
                    </div>
                )}

                {waiting && (
                    <div className="inline-flex gap-1.5 rounded-2xl rounded-tl-sm bg-muted/70 border border-border/40 px-4 py-3.5" aria-label="Thinking">
                        {[0, 150, 300].map((delay) => (
                            <span
                                key={delay}
                                className="size-2 animate-bounce rounded-full bg-primary/60"
                                style={{ animationDelay: `${delay}ms` }}
                            />
                        ))}
                    </div>
                )}

                {message.drafts.map((draft, index) => (
                    <DraftCard key={index} draft={draft} messageId={message.id} index={index} />
                ))}

                {message.error && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
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
        <div className={cn("flex min-h-0 flex-1 flex-col bg-background relative", variant === "page" && "mx-auto w-full max-w-3xl")}>
            {/* Message Stream with Thin Scrollbar */}
            <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent" aria-live="polite">
                {messages.length === 0 ? (
                    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-6 text-center px-4">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner border border-primary/10">
                            <Sparkles className="size-7" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-lg font-semibold tracking-tight">Ask anything about your money</p>
                            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
                                I can look up transactions, compare budgets, analyze spending, and add entries for you instantly.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 max-w-md pt-2">
                            {SUGGESTIONS.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => void send(suggestion)}
                                    className="rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2 text-xs font-medium transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary shadow-2xs"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) =>
                        message.role === "user" ? (
                            <div key={message.id} className="flex justify-end animate-in fade-in-50 duration-200">
                                <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-xs leading-relaxed">
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

            {/* Input Toolbar Area */}
            <div className="p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
                {(messages.length > 0 || canRetry) && (
                    <div className="mb-3 flex items-center justify-between px-1">
                        {canRetry ? (
                            <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground" onClick={() => void retry()}>
                                <RotateCcw className="size-3" /> Try again
                            </Button>
                        ) : (
                            <span />
                        )}
                        {messages.length > 0 && (
                            <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-destructive transition-colors" onClick={clear}>
                                <Trash2 className="size-3" /> New chat
                            </Button>
                        )}
                    </div>
                )}

                <div className="relative flex items-end gap-2 rounded-2xl border border-border/80 bg-muted/40 p-2 shadow-sm backdrop-blur-md focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        rows={1}
                        maxLength={4000}
                        placeholder="Ask about spending, budgets, goals..."
                        aria-label="Message the Copilot"
                        className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70"
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
                        <Button size="icon" variant="secondary" className="size-9 shrink-0 rounded-xl shadow-2xs hover:bg-secondary/80" onClick={stop} aria-label="Stop generating">
                            <Square className="size-3.5 fill-current" />
                        </Button>
                    ) : (
                        <Button size="icon" className="size-9 shrink-0 rounded-xl shadow-xs transition-transform active:scale-95" onClick={submit} disabled={!input.trim()} aria-label="Send message">
                            <ArrowUp className="size-4" />
                        </Button>
                    )}
                </div>

                <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
                    Powered by Gemini. AI can make mistakes — verify important financial entries.
                </p>
            </div>
        </div>
    );
}