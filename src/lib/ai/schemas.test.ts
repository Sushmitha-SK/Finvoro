/* eslint-disable @typescript-eslint/no-explicit-any -- test doubles inspect untyped request/JSON payloads */
import { describe, expect, it } from "vitest";

import {
    chatRequestSchema,
    insightsOutputSchema,
    insightsRequestSchema,
    parsedTransactionSchema,
    toGeminiSchema,
} from "./schemas";

describe("toGeminiSchema", () => {
    it("emits plain JSON Schema without the $schema marker", () => {
        const json = toGeminiSchema(insightsOutputSchema) as Record<string, any>;

        expect(json.$schema).toBeUndefined();
        expect(json.type).toBe("object");
        expect(json.required).toEqual(expect.arrayContaining(["headline", "insights"]));
        expect(json.properties.insights.maxItems).toBe(5);
        expect(json.properties.insights.items.properties.kind.enum).toContain("warning");
    });

    it("keeps field descriptions so the model gets guidance", () => {
        const json = toGeminiSchema(parsedTransactionSchema) as Record<string, any>;

        expect(json.properties.date.description).toContain("YYYY-MM-DD");
    });
});

describe("request schemas", () => {
    it("caps chat size and content length", () => {
        expect(chatRequestSchema.safeParse({ messages: [] }).success).toBe(false);
        expect(chatRequestSchema.safeParse({ messages: [{ role: "user", content: "x".repeat(4001) }] }).success).toBe(false);
        expect(chatRequestSchema.safeParse({ messages: [{ role: "system", content: "hi" }] }).success).toBe(false);
        expect(chatRequestSchema.safeParse({ messages: [{ role: "user", content: "hi" }] }).success).toBe(true);
    });

    it("requires dates for report insights", () => {
        expect(insightsRequestSchema.safeParse({ scope: "reports" }).success).toBe(false);
        expect(insightsRequestSchema.safeParse({ scope: "reports", from: "2026-01-01", to: "2026-01-31" }).success).toBe(true);
        expect(insightsRequestSchema.safeParse({ scope: "dashboard" }).success).toBe(true);
    });
});
