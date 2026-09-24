import type { Content } from "@google/genai";
import type { z } from "zod";

import { getGemini, thinkingConfig } from "./client";
import { AiError, isThinkingUnsupported, toAiError } from "./errors";
import { toGeminiSchema } from "./schemas";

type GenerateJsonOptions<S extends z.ZodType> = {
    model: string;
    system: string;
    contents: Content[];
    schema: S;
    temperature?: number;
    signal?: AbortSignal;
};

/**
 * Structured output: Gemini is constrained to our JSON schema, and the result
 * is still validated with zod before it goes anywhere near the UI.
 */
export async function generateJson<S extends z.ZodType>({
    model,
    system,
    contents,
    schema,
    temperature = 0.2,
    signal,
}: GenerateJsonOptions<S>): Promise<z.infer<S>> {
    const ai = getGemini();
    let useThinking = true;
    let lastError: unknown;

    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents,
                config: {
                    systemInstruction: system,
                    responseMimeType: "application/json",
                    responseJsonSchema: toGeminiSchema(schema),
                    temperature,
                    maxOutputTokens: 2048,
                    abortSignal: signal,
                    ...(useThinking ? { thinkingConfig: thinkingConfig("minimal") } : {}),
                },
            });

            const text = response.text;

            if (!text) {
                throw new AiError("bad_output", "The AI returned an empty response.", 502);
            }

            return schema.parse(JSON.parse(text)) as z.infer<S>;
        } catch (error) {
            if (isThinkingUnsupported(error) && useThinking) {
                useThinking = false;
                attempt -= 1;
                continue;
            }

            if (error instanceof SyntaxError || (error as { name?: string })?.name === "ZodError") {
                lastError = error;
                continue;
            }

            throw toAiError(error);
        }
    }

    console.error("AI returned invalid structured output:", lastError);

    throw new AiError("bad_output", "The AI returned an unexpected response. Please try again.", 502);
}
