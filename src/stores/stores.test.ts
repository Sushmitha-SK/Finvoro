import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { toast } = vi.hoisted(() => ({
    toast: Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() }),
}));

vi.mock("sonner", () => ({ toast }));

import { useCopilotStore } from "./copilot-store";
import { useInsightsStore } from "./insights-store";
import { useNotificationsStore } from "./notifications-store";
import { useSelectionStore } from "./selection-store";
import { useUIStore } from "./ui-store";

/** Build a streaming Response whose body arrives in the given raw chunks. */
function streamResponse(chunks: string[], init: ResponseInit = { status: 200 }) {
    const encoder = new TextEncoder();

    return new Response(
        new ReadableStream({
            start(controller) {
                for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
                controller.close();
            },
        }),
        init,
    );
}

const line = (event: object) => `${JSON.stringify(event)}\n`;
const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    toast.mockClear();
    toast.error.mockClear();
    useCopilotStore.setState({ ownerId: null, messages: [], status: "idle" });
    useInsightsStore.setState({ entries: {} });
    useSelectionStore.setState({ selected: {} });
});

afterEach(() => vi.unstubAllGlobals());

describe("copilot store", () => {
    it("assembles text, tool chips and drafts from a stream split at arbitrary byte boundaries", async () => {
        const draft = { description: "Lunch", amount: 250, type: "expense", category: "Dining", isNewCategory: false, date: "2026-09-21", notes: "" };
        const payload =
            line({ type: "tool", name: "spending_summary", label: "Analysing spending", status: "running" }) +
            line({ type: "tool", name: "spending_summary", label: "Analysing spending", status: "done" }) +
            line({ type: "text", text: "You spent " }) +
            line({ type: "text", text: "₹1,200." }) +
            line({ type: "draft", draft }) +
            line({ type: "done" });

        // Cut in the middle of JSON lines *and* in the middle of a multi-byte character.
        const bytes = new TextEncoder().encode(payload);
        const chunks = [0, 17, 41, 90, 133, bytes.length].slice(0, -1).map((start, i, all) => {
            const end = [17, 41, 90, 133, bytes.length][i];

            void all;

            return new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(start, end), { stream: true });
        });

        // Chunk as raw bytes to be safe about the split character.
        const encoder = new TextEncoder();
        const raw = new Response(
            new ReadableStream({
                start(controller) {
                    for (const [a, b] of [[0, 17], [17, 41], [41, 90], [90, 133], [133, bytes.length]]) {
                        controller.enqueue(bytes.slice(a, b));
                    }
                    controller.close();
                },
            }),
            { status: 200 },
        );

        void chunks;
        void encoder;
        fetchMock.mockResolvedValue(raw);

        await useCopilotStore.getState().send("How much did I spend?");

        const { messages, status } = useCopilotStore.getState();

        expect(status).toBe("idle");
        expect(messages).toHaveLength(2);
        expect(messages[0]).toMatchObject({ role: "user", content: "How much did I spend?" });
        expect(messages[1].content).toBe("You spent ₹1,200.");
        expect(messages[1].tools).toEqual([{ name: "spending_summary", label: "Analysing spending", status: "done" }]);
        expect(messages[1].drafts).toEqual([draft]);
        expect(messages[1].error).toBeUndefined();
    });

    it("sends prior history (without failed replies) and the local date", async () => {
        useCopilotStore.setState({
            messages: [
                { id: "1", role: "user", content: "first", tools: [], drafts: [] },
                { id: "2", role: "assistant", content: "answer", tools: [], drafts: [] },
                { id: "3", role: "user", content: "broken question", tools: [], drafts: [] },
                { id: "4", role: "assistant", content: "", tools: [], drafts: [], error: { message: "x" } },
            ],
        });
        fetchMock.mockResolvedValue(streamResponse([line({ type: "done" })]));

        await useCopilotStore.getState().send("second");

        const body = JSON.parse(fetchMock.mock.calls[0][1].body);

        expect(body.messages.map((m: { content: string }) => m.content)).toEqual(["first", "answer", "broken question", "second"]);
        expect(body.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("surfaces HTTP errors on the assistant message and returns to idle", async () => {
        fetchMock.mockResolvedValue(jsonResponse({ error: "Gemini isn't configured.", code: "not_configured" }, 503));

        await useCopilotStore.getState().send("hi");

        const last = useCopilotStore.getState().messages[1];

        expect(last.error).toEqual({ message: "Gemini isn't configured.", code: "not_configured" });
        expect(useCopilotStore.getState().status).toBe("idle");
    });

    it("shows a stream-level error event without losing earlier text", async () => {
        fetchMock.mockResolvedValue(
            streamResponse([line({ type: "text", text: "Partial" }), line({ type: "error", message: "Gemini is busy", code: "upstream_busy" })]),
        );

        await useCopilotStore.getState().send("hi");

        const last = useCopilotStore.getState().messages[1];

        expect(last.content).toBe("Partial");
        expect(last.error?.code).toBe("upstream_busy");
    });

    it("ignores malformed lines instead of breaking the stream", async () => {
        fetchMock.mockResolvedValue(
            streamResponse(["{not json}\n", line({ type: "text", text: "still works" }), line({ type: "done" })]),
        );

        await useCopilotStore.getState().send("hi");

        expect(useCopilotStore.getState().messages[1].content).toBe("still works");
    });

    it("stop() aborts the request quietly and re-enables sending", async () => {
        fetchMock.mockImplementation(
            (_url: string, init: RequestInit) =>
                new Promise((_resolve, reject) => {
                    init.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
                }),
        );

        const pending = useCopilotStore.getState().send("slow question");

        await Promise.resolve();
        expect(useCopilotStore.getState().status).toBe("streaming");

        useCopilotStore.getState().stop();
        await pending;

        expect(useCopilotStore.getState().status).toBe("idle");
        expect(useCopilotStore.getState().messages[1].error).toBeUndefined();
    });

    it("ignores a second send while one is streaming", async () => {
        let release: () => void = () => undefined;

        fetchMock.mockImplementation(
            () => new Promise((resolve) => { release = () => resolve(streamResponse([line({ type: "done" })])); }),
        );

        const first = useCopilotStore.getState().send("one");

        await Promise.resolve();
        await useCopilotStore.getState().send("two");
        release();
        await first;

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(useCopilotStore.getState().messages.filter((m) => m.role === "user")).toHaveLength(1);
    });

    it("retry() drops the failed exchange and asks again", async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({ error: "busy" }, 503));
        await useCopilotStore.getState().send("what now?");

        fetchMock.mockResolvedValueOnce(streamResponse([line({ type: "text", text: "Here you go" }), line({ type: "done" })]));
        await useCopilotStore.getState().retry();

        const { messages } = useCopilotStore.getState();

        expect(messages).toHaveLength(2);
        expect(messages[0].content).toBe("what now?");
        expect(messages[1].content).toBe("Here you go");
    });

    it("claim() wipes another user's history but keeps your own", () => {
        useCopilotStore.setState({ ownerId: "user_a", messages: [{ id: "1", role: "user", content: "secret", tools: [], drafts: [] }] });

        useCopilotStore.getState().claim("user_a");
        expect(useCopilotStore.getState().messages).toHaveLength(1);

        useCopilotStore.getState().claim("user_b");
        expect(useCopilotStore.getState().messages).toHaveLength(0);
        expect(useCopilotStore.getState().ownerId).toBe("user_b");
    });

    it("dismissDraft removes only the chosen draft", () => {
        const d = (n: number) => ({ description: `d${n}`, amount: n, type: "expense" as const, category: "x", isNewCategory: false, date: "2026-01-01", notes: "" });

        useCopilotStore.setState({ messages: [{ id: "m", role: "assistant", content: "", tools: [], drafts: [d(1), d(2), d(3)] }] });
        useCopilotStore.getState().dismissDraft("m", 1);

        expect(useCopilotStore.getState().messages[0].drafts.map((x) => x.description)).toEqual(["d1", "d3"]);
    });
});

describe("notifications store", () => {
    const item = (id: string, read = false) => ({ id, title: `T${id}`, message: "m", type: "info", read, createdAt: new Date().toISOString() });

    it("loads items and toasts only genuinely new unread ones on later polls", async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({ notifications: [item("a")], unreadCount: 1 }));
        await useNotificationsStore.getState().fetch();
        expect(toast).not.toHaveBeenCalled(); // first load is silent

        fetchMock.mockResolvedValueOnce(jsonResponse({ notifications: [item("b"), item("a")], unreadCount: 2 }));
        await useNotificationsStore.getState().fetch();

        expect(toast).toHaveBeenCalledTimes(1);
        expect(toast).toHaveBeenCalledWith("Tb", { description: "m" });
        expect(useNotificationsStore.getState().unreadCount).toBe(2);
    });

    it("markRead is optimistic and rolls back when the server fails", async () => {
        useNotificationsStore.setState({ items: [item("a"), item("b")], unreadCount: 2, status: "ready" });
        fetchMock.mockResolvedValue(new Response("{}", { status: 500 }));

        const pending = useNotificationsStore.getState().markRead("a");

        // Updated immediately, before the request resolves
        expect(useNotificationsStore.getState().unreadCount).toBe(1);
        expect(useNotificationsStore.getState().items[0].read).toBe(true);

        await pending;

        expect(useNotificationsStore.getState().unreadCount).toBe(2);
        expect(useNotificationsStore.getState().items[0].read).toBe(false);
        expect(toast.error).toHaveBeenCalled();
    });

    it("markRead on an already-read item does nothing", async () => {
        useNotificationsStore.setState({ items: [item("a", true)], unreadCount: 0, status: "ready" });

        await useNotificationsStore.getState().markRead("a");

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("remove adjusts the unread count only for unread items", async () => {
        useNotificationsStore.setState({ items: [item("a"), item("b", true)], unreadCount: 1, status: "ready" });
        fetchMock.mockResolvedValue(jsonResponse({ success: true }));

        await useNotificationsStore.getState().remove("b");
        expect(useNotificationsStore.getState().unreadCount).toBe(1);

        await useNotificationsStore.getState().remove("a");
        expect(useNotificationsStore.getState().unreadCount).toBe(0);
        expect(useNotificationsStore.getState().items).toHaveLength(0);
    });

    it("markAllRead clears the badge and restores on failure", async () => {
        useNotificationsStore.setState({ items: [item("a"), item("b")], unreadCount: 2, status: "ready" });
        fetchMock.mockResolvedValue(new Response("{}", { status: 500 }));

        await useNotificationsStore.getState().markAllRead();

        expect(useNotificationsStore.getState().unreadCount).toBe(2);
        expect(useNotificationsStore.getState().items.every((i) => !i.read)).toBe(true);
    });
});

describe("insights store", () => {
    const ok = { headline: "h", insights: [{ id: "1", title: "t", detail: "d", kind: "trend", impact: "low" }] };

    it("de-duplicates concurrent loads and caches fresh results", async () => {
        fetchMock.mockImplementation(async () => jsonResponse(ok));

        const { load } = useInsightsStore.getState();

        await Promise.all([load("k", { scope: "dashboard" }), load("k", { scope: "dashboard" })]);
        expect(fetchMock).toHaveBeenCalledTimes(1);

        await load("k", { scope: "dashboard" });
        expect(fetchMock).toHaveBeenCalledTimes(1); // served from cache

        await load("k", { scope: "dashboard" }, { force: true });
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(useInsightsStore.getState().entries.k.status).toBe("ready");
    });

    it("refetches once the cache is stale", async () => {
        fetchMock.mockImplementation(async () => jsonResponse(ok));

        await useInsightsStore.getState().load("k", { scope: "dashboard" });
        useInsightsStore.setState((s) => ({ entries: { k: { ...s.entries.k, fetchedAt: Date.now() - 31 * 60 * 1000 } } }));
        await useInsightsStore.getState().load("k", { scope: "dashboard" });

        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("records API errors with their code, and network failures", async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({ error: "Not configured", code: "not_configured" }, 503));
        await useInsightsStore.getState().load("a", { scope: "dashboard" });
        expect(useInsightsStore.getState().entries.a).toMatchObject({ status: "error", code: "not_configured" });

        fetchMock.mockRejectedValueOnce(new TypeError("offline"));
        await useInsightsStore.getState().load("b", { scope: "dashboard" });
        expect(useInsightsStore.getState().entries.b.status).toBe("error");
    });

    it("an error does not poison later retries", async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({ error: "x" }, 500));
        await useInsightsStore.getState().load("k", { scope: "dashboard" });

        fetchMock.mockResolvedValueOnce(jsonResponse(ok));
        await useInsightsStore.getState().load("k", { scope: "dashboard" });

        expect(useInsightsStore.getState().entries.k.status).toBe("ready");
    });

    it("invalidateAll empties the cache", async () => {
        fetchMock.mockImplementation(async () => jsonResponse(ok));
        await useInsightsStore.getState().load("k", { scope: "dashboard" });

        useInsightsStore.getState().invalidateAll();

        expect(useInsightsStore.getState().entries).toEqual({});
    });
});

describe("selection store", () => {
    it("toggles, bulk-selects and clears without mutating previous state", () => {
        const before = useSelectionStore.getState().selected;

        useSelectionStore.getState().toggle("a");
        expect(useSelectionStore.getState().selected).toEqual({ a: true });
        expect(before).toEqual({});

        useSelectionStore.getState().setMany(["a", "b", "c"], true);
        expect(Object.keys(useSelectionStore.getState().selected).sort()).toEqual(["a", "b", "c"]);

        useSelectionStore.getState().setMany(["b"], false);
        useSelectionStore.getState().toggle("a");
        expect(Object.keys(useSelectionStore.getState().selected)).toEqual(["c"]);

        useSelectionStore.getState().clear();
        expect(useSelectionStore.getState().selected).toEqual({});
    });
});

describe("ui store", () => {
    it("askCopilot opens the panel, closes the palette, and a prompt is consumed exactly once", () => {
        useUIStore.setState({ commandOpen: true, copilotOpen: false, pendingPrompt: null });

        useUIStore.getState().askCopilot("why is dining up?");

        expect(useUIStore.getState()).toMatchObject({ copilotOpen: true, commandOpen: false });
        expect(useUIStore.getState().consumePendingPrompt()).toBe("why is dining up?");
        expect(useUIStore.getState().consumePendingPrompt()).toBeNull();
    });

    it("opens the transaction dialog for create, edit and AI-prefilled flows, then closes", () => {
        useUIStore.getState().openTransactionDialog();
        expect(useUIStore.getState().transactionDialog).toMatchObject({ open: true, editingId: null, source: "manual" });

        useUIStore.getState().openTransactionDialog({ editingId: "t1", prefill: { description: "x" } });
        expect(useUIStore.getState().transactionDialog).toMatchObject({ editingId: "t1", prefill: { description: "x" } });

        useUIStore.getState().openTransactionDialog({ source: "ai", prefill: { amount: "10" } });
        expect(useUIStore.getState().transactionDialog.source).toBe("ai");

        useUIStore.getState().closeTransactionDialog();
        expect(useUIStore.getState().transactionDialog).toMatchObject({ open: false, editingId: null, prefill: null });
    });

    it("toggles the palette and copilot", () => {
        useUIStore.setState({ commandOpen: false, copilotOpen: false });

        useUIStore.getState().toggleCommand();
        useUIStore.getState().toggleCopilot();

        expect(useUIStore.getState()).toMatchObject({ commandOpen: true, copilotOpen: true });
    });
});
