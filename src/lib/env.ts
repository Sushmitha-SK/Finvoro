/**
 * Central place for optional AI configuration.
 * (Database and Clerk variables are validated by their own SDKs.)
 */
export const aiEnv = {
    get apiKey() {
        return process.env.GEMINI_API_KEY?.trim() || "";
    },
    get model() {
        return process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash";
    },
    get fastModel() {
        return process.env.GEMINI_FAST_MODEL?.trim() || "gemini-3.5-flash-lite";
    },
};

export function isGeminiConfigured() {
    return aiEnv.apiKey.length > 0;
}
