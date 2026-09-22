import { NextResponse } from "next/server";
import type { z } from "zod";

import { getUserId, unauthorized } from "@/lib/auth";
import { getUserPreferences } from "@/lib/data/preferences";
import { isGeminiConfigured } from "@/lib/env";

import { AiError, toAiError } from "./errors";
import { checkRateLimit, type BUCKETS } from "./rate-limit";

export function aiErrorResponse(error: unknown) {
    const aiError = toAiError(error);

    return NextResponse.json(
        { error: aiError.message, code: aiError.code },
        { status: aiError.status === 499 ? 400 : aiError.status },
    );
}

/**
 * Every AI endpoint goes through this: session -> user opt-in -> configuration
 * -> rate limit. Returns a ready-made Response when any check fails.
 */
export async function guardAi(bucket: (typeof BUCKETS)[keyof typeof BUCKETS]) {
    const userId = await getUserId();

    if (!userId) {
        return { ok: false as const, response: unauthorized() };
    }

    const preferences = await getUserPreferences(userId);

    if (!preferences.aiEnabled) {
        return {
            ok: false as const,
            response: aiErrorResponse(
                new AiError("ai_disabled", "AI features are turned off in your settings.", 403),
            ),
        };
    }

    if (!isGeminiConfigured()) {
        return {
            ok: false as const,
            response: aiErrorResponse(
                new AiError(
                    "not_configured",
                    "Gemini isn't configured. Add GEMINI_API_KEY to enable AI features.",
                    503,
                ),
            ),
        };
    }

    const limit = checkRateLimit(userId, bucket);

    if (!limit.allowed) {
        const response = NextResponse.json(
            {
                error: "You're going a little fast. Please wait a moment and try again.",
                code: "rate_limited",
            },
            { status: 429 },
        );

        response.headers.set("Retry-After", String(limit.retryAfterSeconds));

        return { ok: false as const, response };
    }

    return { ok: true as const, userId, preferences };
}

export async function readJson<S extends z.ZodType>(request: Request, schema: S) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return { ok: false as const, response: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }) };
    }

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
        return {
            ok: false as const,
            response: NextResponse.json(
                { error: "Invalid request.", issues: parsed.error.issues.map((i) => i.message) },
                { status: 400 },
            ),
        };
    }

    return { ok: true as const, data: parsed.data as z.infer<S> };
}
