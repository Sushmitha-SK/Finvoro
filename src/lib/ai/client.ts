import { GoogleGenAI, ThinkingLevel } from "@google/genai";

import { aiEnv, isGeminiConfigured } from "@/lib/env";

import { AiError } from "./errors";

let client: GoogleGenAI | null = null;
let clientKey = "";

export function getGemini() {
    if (!isGeminiConfigured()) {
        throw new AiError(
            "not_configured",
            "Gemini isn't configured. Add GEMINI_API_KEY to your environment to enable AI features.",
            503,
        );
    }

    if (!client || clientKey !== aiEnv.apiKey) {
        client = new GoogleGenAI({ apiKey: aiEnv.apiKey });
        clientKey = aiEnv.apiKey;
    }

    return client;
}

/**
 * Gemini 3-family models take a thinking *level*. Keep it low for our
 * latency-sensitive product features. Set GEMINI_THINKING=off to omit it
 * entirely (useful for older models).
 */
export function thinkingConfig(level: "minimal" | "low" = "low") {
    if ((process.env.GEMINI_THINKING ?? "").toLowerCase() === "off") {
        return undefined;
    }

    return {
        thinkingLevel: level === "minimal" ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW,
    };
}
