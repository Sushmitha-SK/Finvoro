import { getGemini } from "@/lib/ai/client";
import { runChat } from "@/lib/ai/chat";
import { buildSnapshot, chatSystemPrompt } from "@/lib/ai/context";
import { BUCKETS } from "@/lib/ai/rate-limit";
import { aiErrorResponse, guardAi, readJson } from "@/lib/ai/route";
import { chatRequestSchema } from "@/lib/ai/schemas";
import { getDashboardData } from "@/lib/data/dashboard";
import { isValidDateInput, toDateInput } from "@/lib/dates";

export const maxDuration = 60;

export async function POST(request: Request) {
    const guard = await guardAi(BUCKETS.chat);

    if (!guard.ok) return guard.response;

    const body = await readJson(request, chatRequestSchema);

    if (!body.ok) return body.response;

    try {
        const ai = getGemini();
        const today = isValidDateInput(body.data.today) ? body.data.today : toDateInput(new Date());
        const dashboard = await getDashboardData(guard.userId);
        const system = chatSystemPrompt(buildSnapshot(dashboard, today));

        const events = runChat({
            ai,
            system,
            messages: body.data.messages,
            ctx: { userId: guard.userId, today },
            signal: request.signal,
        });

        const encoder = new TextEncoder();

        const stream = new ReadableStream<Uint8Array>({
            async pull(controller) {
                const { value, done } = await events.next();

                if (done) {
                    controller.close();
                    return;
                }

                controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));
            },
            async cancel() {
                await events.return(undefined);
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "application/x-ndjson; charset=utf-8",
                "Cache-Control": "no-store, no-transform",
                "X-Accel-Buffering": "no",
            },
        });
    } catch (error) {
        return aiErrorResponse(error);
    }
}
