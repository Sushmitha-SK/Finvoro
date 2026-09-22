import { ApiError } from "@google/genai";

export type AiErrorCode =
    | "not_configured"
    | "ai_disabled"
    | "rate_limited"
    | "upstream_busy"
    | "bad_model"
    | "bad_key"
    | "bad_output"
    | "bad_request"
    | "unknown";

export class AiError extends Error {
    constructor(
        public code: AiErrorCode,
        message: string,
        public status = 500,
    ) {
        super(message);
        this.name = "AiError";
    }
}

/** Turns anything thrown by the Gemini SDK into a safe, user-facing AiError. */
export function toAiError(error: unknown): AiError {
    if (error instanceof AiError) {
        return error;
    }

    if (error instanceof Error && error.name === "AbortError") {
        return new AiError("unknown", "Request cancelled.", 499);
    }

    if (error instanceof ApiError) {
        const message = error.message ?? "";

        if (error.status === 429) {
            return new AiError(
                "upstream_busy",
                "Gemini is rate limiting requests right now. Please try again in a moment.",
                429,
            );
        }

        if (error.status === 404 || /model.*not found|is not found/i.test(message)) {
            return new AiError(
                "bad_model",
                "The configured Gemini model isn't available. Check GEMINI_MODEL in your environment.",
                502,
            );
        }

        if (
            error.status === 401 ||
            error.status === 403 ||
            /api key not valid|API_KEY_INVALID|permission/i.test(message)
        ) {
            return new AiError(
                "bad_key",
                "Gemini rejected the API key. Check GEMINI_API_KEY in your environment.",
                502,
            );
        }

        if (error.status >= 500) {
            return new AiError(
                "upstream_busy",
                "Gemini is temporarily unavailable. Please try again shortly.",
                503,
            );
        }

        return new AiError("bad_request", "Gemini couldn't process that request.", 502);
    }

    console.error("Unexpected AI error:", error);

    return new AiError("unknown", "Something went wrong while contacting the AI service.", 500);
}

/** Some model families reject thinkingConfig; we detect that and retry without it. */
export function isThinkingUnsupported(error: unknown) {
    return (
        error instanceof ApiError &&
        error.status === 400 &&
        /thinking/i.test(error.message ?? "")
    );
}
