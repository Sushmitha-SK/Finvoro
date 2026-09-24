import type { Content, FunctionCall, GenerateContentResponse, Part } from "@google/genai";

import { aiEnv } from "@/lib/env";

import { thinkingConfig } from "./client";
import { AiError, isThinkingUnsupported, toAiError } from "./errors";
import {
    executeTool,
    TOOL_LABELS,
    toolDeclarations,
    type ChatEvent,
    type ToolContext,
} from "./tools";

/** The slice of the SDK we depend on - lets tests inject a fake. */
export type GeminiLike = {
    models: {
        generateContentStream(params: {
            model: string;
            contents: Content[];
            config?: Record<string, unknown>;
        }): Promise<AsyncIterable<GenerateContentResponse>>;
    };
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_TOOL_ROUNDS = 5;

export function toContents(messages: ChatMessage[]): Content[] {
    const trimmed = messages.slice(-20);
    const firstUser = trimmed.findIndex((message) => message.role === "user");

    return trimmed.slice(Math.max(firstUser, 0)).map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
    }));
}

/**
 * Streams a tool-using conversation.
 *
 * Loop: stream the model -> if it asked for tools, run them on the server,
 * feed results back, and stream again. Text is forwarded as it arrives so the
 * UI feels instant even when tools are involved.
 */
export async function* runChat(options: {
    ai: GeminiLike;
    system: string;
    messages: ChatMessage[];
    ctx: ToolContext;
    signal?: AbortSignal;
    model?: string;
}): AsyncGenerator<ChatEvent> {
    const { ai, system, messages, ctx, signal, model = aiEnv.model } = options;
    const contents = toContents(messages);
    let useThinking = true;

    try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
            if (signal?.aborted) return;

            const parts: Part[] = [];
            const calls: FunctionCall[] = [];
            let emitted = false;

            const config = () => ({
                systemInstruction: system,
                tools: [{ functionDeclarations: toolDeclarations }],
                temperature: 0.4,
                maxOutputTokens: 2048,
                abortSignal: signal,
                ...(useThinking ? { thinkingConfig: thinkingConfig("low") } : {}),
            });

            try {
                const stream = await ai.models.generateContentStream({ model, contents, config: config() });

                for await (const chunk of stream) {
                    for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
                        parts.push(part);

                        if (part.functionCall) {
                            calls.push(part.functionCall);
                        } else if (part.text && !part.thought) {
                            emitted = true;
                            yield { type: "text", text: part.text };
                        }
                    }
                }
            } catch (error) {
                if (useThinking && !emitted && isThinkingUnsupported(error)) {
                    useThinking = false;
                    round -= 1;
                    continue;
                }

                throw error;
            }

            if (calls.length === 0) {
                break;
            }

            if (round === MAX_TOOL_ROUNDS - 1) {
                yield {
                    type: "text",
                    text: "\n\nI hit my step limit while gathering data. Try asking a narrower question.",
                };
                break;
            }

            contents.push({ role: "model", parts });

            const responses: Part[] = [];

            for (const call of calls) {
                const name = call.name ?? "unknown";
                const label = TOOL_LABELS[name] ?? "Working";

                yield { type: "tool", name, label, status: "running" };

                const result = await executeTool(name, call.args, ctx);

                if (result.event) yield result.event;

                const failed =
                    typeof result.output === "object" &&
                    result.output !== null &&
                    "error" in result.output;

                yield { type: "tool", name, label, status: failed ? "error" : "done" };

                responses.push({
                    functionResponse: {
                        name,
                        id: call.id,
                        response: { output: result.output },
                    },
                });
            }

            contents.push({ role: "user", parts: responses });
        }

        yield { type: "done" };
    } catch (error) {
        const aiError: AiError = toAiError(error);

        if (aiError.status === 499) return;

        yield { type: "error", message: aiError.message, code: aiError.code };
    }
}
