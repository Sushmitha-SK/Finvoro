import { ApiError } from "@google/genai";
import { describe, expect, it } from "vitest";

import { AiError, isThinkingUnsupported, toAiError } from "./errors";

const api = (status: number, message: string) => new ApiError({ status, message });

describe("toAiError", () => {
    it("maps upstream statuses to safe messages without leaking raw errors", () => {
        expect(toAiError(api(429, "quota")).code).toBe("upstream_busy");
        expect(toAiError(api(404, "models/x is not found")).code).toBe("bad_model");
        expect(toAiError(api(400, "API key not valid. Please pass a valid API key.")).code).toBe("bad_key");
        expect(toAiError(api(503, "overloaded")).code).toBe("upstream_busy");
        expect(toAiError(api(429, "SECRET-DETAIL")).message).not.toContain("SECRET-DETAIL");
    });

    it("passes AiError through and hides unknown errors", () => {
        const own = new AiError("ai_disabled", "off", 403);

        expect(toAiError(own)).toBe(own);
        expect(toAiError(new Error("boom: password=hunter2")).message).not.toContain("hunter2");
    });

    it("recognises the thinking-unsupported 400", () => {
        expect(isThinkingUnsupported(api(400, "Thinking level is not supported for this model"))).toBe(true);
        expect(isThinkingUnsupported(api(400, "something else"))).toBe(false);
        expect(isThinkingUnsupported(new Error("thinking"))).toBe(false);
    });
});
