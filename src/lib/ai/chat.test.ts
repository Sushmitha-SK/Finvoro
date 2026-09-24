/* eslint-disable @typescript-eslint/no-explicit-any -- test doubles inspect untyped request/JSON payloads */
import type { GenerateContentResponse } from "@google/genai";
import { ApiError } from "@google/genai";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

const executeTool = vi.fn();

vi.mock("./tools", async (importOriginal) => {
    const original = await importOriginal<typeof import("./tools")>();

    return { ...original, executeTool: (...args: unknown[]) => executeTool(...args) };
});

import { runChat, toContents, type GeminiLike } from "./chat";
import type { ChatEvent } from "./tools";

const chunk = (parts: object[]) =>
    ({ candidates: [{ content: { role: "model", parts } }] }) as unknown as GenerateContentResponse;

async function* stream(chunks: GenerateContentResponse[]) {
    for (const item of chunks) yield item;
}

/** Fake client that returns one scripted stream per call and records the requests. */
function fakeAi(script: Array<GenerateContentResponse[] | Error>) {
    const calls: Array<{ contents: any[]; config: any }> = [];
    let index = 0;

    const ai: GeminiLike = {
        models: {
            async generateContentStream(params) {
                calls.push({ contents: JSON.parse(JSON.stringify(params.contents)), config: params.config });

                const next = script[index++];

                if (next instanceof Error) throw next;

                return stream(next ?? []);
            },
        },
    };

    return { ai, calls };
}

async function collect(gen: AsyncGenerator<ChatEvent>) {
    const events: ChatEvent[] = [];

    for await (const event of gen) events.push(event);

    return events;
}

const base = {
    system: "sys",
    messages: [{ role: "user" as const, content: "hi" }],
    ctx: { userId: "u1", today: "2026-09-21" },
};

describe("toContents", () => {
    it("maps roles, starts at the first user turn and keeps the last 20", () => {
        const many = Array.from({ length: 30 }, (_, i) => ({
            role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
            content: String(i),
        }));
        const contents = toContents(many);

        expect(contents.length).toBeLessThanOrEqual(20);
        expect(contents[0].role).toBe("user");
        expect(contents.some((c) => c.role === "model")).toBe(true);
    });

    it("drops a leading assistant message", () => {
        const contents = toContents([
            { role: "assistant", content: "welcome" },
            { role: "user", content: "hello" },
        ]);

        expect(contents).toHaveLength(1);
        expect(contents[0].role).toBe("user");
    });
});

describe("runChat", () => {
    beforeEach(() => executeTool.mockReset());

    it("streams text chunks then done", async () => {
        const { ai } = fakeAi([[chunk([{ text: "Hel" }]), chunk([{ text: "lo" }])]]);
        const events = await collect(runChat({ ai, ...base }));

        expect(events).toEqual([
            { type: "text", text: "Hel" },
            { type: "text", text: "lo" },
            { type: "done" },
        ]);
    });

    it("never surfaces thought parts to the user", async () => {
        const { ai } = fakeAi([[chunk([{ text: "secret reasoning", thought: true }, { text: "Answer" }])]]);
        const events = await collect(runChat({ ai, ...base }));

        expect(events.filter((e) => e.type === "text")).toEqual([{ type: "text", text: "Answer" }]);
    });

    it("runs a tool, feeds the result back and preserves the model turn verbatim", async () => {
        executeTool.mockResolvedValue({ output: { total: 1234 } });

        const modelTurn = [{ functionCall: { name: "spending_summary", args: { group_by: "category" }, id: "call-1" }, thoughtSignature: "SIG" }];
        const { ai, calls } = fakeAi([[chunk(modelTurn)], [chunk([{ text: "You spent 1,234." }])]]);

        const events = await collect(runChat({ ai, ...base }));

        expect(executeTool).toHaveBeenCalledWith("spending_summary", { group_by: "category" }, base.ctx);
        expect(events.map((e) => e.type)).toEqual(["tool", "tool", "text", "done"]);
        expect(events[0]).toMatchObject({ type: "tool", status: "running", label: "Analysing spending" });
        expect(events[1]).toMatchObject({ type: "tool", status: "done" });

        expect(calls).toHaveLength(2);

        const second = calls[1].contents;

        expect(second[second.length - 2]).toEqual({ role: "model", parts: modelTurn });
        expect(second[second.length - 1].parts[0].functionResponse).toEqual({
            name: "spending_summary",
            id: "call-1",
            response: { output: { total: 1234 } },
        });
    });

    it("forwards draft events from tools", async () => {
        const draft = { description: "Lunch", amount: 250, type: "expense", category: "Dining", isNewCategory: false, date: "2026-09-21", notes: "" };

        executeTool.mockResolvedValue({ output: { status: "draft_shown_to_user" }, event: { type: "draft", draft } });

        const { ai } = fakeAi([
            [chunk([{ functionCall: { name: "draft_transaction", args: {} } }])],
            [chunk([{ text: "Please confirm." }])],
        ]);
        const events = await collect(runChat({ ai, ...base }));

        expect(events.find((e) => e.type === "draft")).toEqual({ type: "draft", draft });
    });

    it("marks a tool as errored when it reports an error", async () => {
        executeTool.mockResolvedValue({ output: { error: "Invalid arguments" } });

        const { ai } = fakeAi([[chunk([{ functionCall: { name: "search_transactions", args: {} } }])], [chunk([{ text: "Sorry." }])]]);
        const events = await collect(runChat({ ai, ...base }));

        expect(events.filter((e) => e.type === "tool").map((e: any) => e.status)).toEqual(["running", "error"]);
    });

    it("stops after the max number of tool rounds instead of looping forever", async () => {
        executeTool.mockResolvedValue({ output: {} });

        const looping = Array.from({ length: 10 }, () => [chunk([{ functionCall: { name: "budget_status", args: {} } }])]);
        const { ai, calls } = fakeAi(looping);
        const events = await collect(runChat({ ai, ...base }));

        expect(calls.length).toBe(5);
        expect(events[events.length - 1]).toEqual({ type: "done" });
        expect(events.some((e) => e.type === "text" && /step limit/.test(e.text))).toBe(true);
    });

    it("retries once without thinkingConfig when the model rejects it", async () => {
        const rejection = new ApiError({ status: 400, message: "Thinking level is not supported for this model" });
        const { ai, calls } = fakeAi([rejection, [chunk([{ text: "ok" }])]]);
        const events = await collect(runChat({ ai, ...base }));

        expect(calls).toHaveLength(2);
        expect(calls[0].config.thinkingConfig).toBeDefined();
        expect(calls[1].config.thinkingConfig).toBeUndefined();
        expect(events).toEqual([{ type: "text", text: "ok" }, { type: "done" }]);
    });

    it("turns upstream failures into a friendly error event", async () => {
        const { ai } = fakeAi([new ApiError({ status: 429, message: "RESOURCE_EXHAUSTED secret-quota-info" })]);
        const events = await collect(runChat({ ai, ...base }));

        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({ type: "error", code: "upstream_busy" });
        expect(JSON.stringify(events[0])).not.toContain("secret-quota-info");
    });

    it("exposes only read-only tools plus a confirm-first draft tool", async () => {
        const { ai, calls } = fakeAi([[chunk([{ text: "x" }])]]);

        await collect(runChat({ ai, ...base }));

        const names = calls[0].config.tools[0].functionDeclarations.map((d: any) => d.name).sort();

        expect(names).toEqual(["budget_status", "draft_transaction", "search_transactions", "spending_summary"]);
    });

    it("emits nothing after the caller aborts", async () => {
        const controller = new AbortController();

        controller.abort();

        const { ai, calls } = fakeAi([[chunk([{ text: "late" }])]]);
        const events = await collect(runChat({ ai, ...base, signal: controller.signal }));

        expect(events).toEqual([]);
        expect(calls).toHaveLength(0);
    });
});
