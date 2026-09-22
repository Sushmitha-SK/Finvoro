import { NextResponse } from "next/server";

import { BUCKETS } from "@/lib/ai/rate-limit";
import { parseTransactionParts } from "@/lib/ai/parse-transaction";
import { aiErrorResponse, guardAi } from "@/lib/ai/route";
import { RECEIPT_MAX_BYTES, RECEIPT_MIME_TYPES } from "@/lib/ai/schemas";
import { isValidDateInput, toDateInput } from "@/lib/dates";

export const maxDuration = 60;

export async function POST(request: Request) {
    const guard = await guardAi(BUCKETS.vision);

    if (!guard.ok) return guard.response;

    let form: FormData;

    try {
        form = await request.formData();
    } catch {
        return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
    }

    const file = form.get("image");

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "Attach a receipt image." }, { status: 400 });
    }

    if (!(RECEIPT_MIME_TYPES as readonly string[]).includes(file.type)) {
        return NextResponse.json({ error: "Use a JPEG, PNG, WebP or HEIC image." }, { status: 415 });
    }

    if (file.size > RECEIPT_MAX_BYTES) {
        return NextResponse.json({ error: "That image is over 4 MB. Try a smaller photo." }, { status: 413 });
    }

    try {
        const todayInput = form.get("today");
        const today = typeof todayInput === "string" && isValidDateInput(todayInput)
            ? todayInput
            : toDateInput(new Date());

        const data = Buffer.from(await file.arrayBuffer()).toString("base64");

        const transaction = await parseTransactionParts(
            [
                { inlineData: { mimeType: file.type, data } },
                {
                    text:
                        "This is a photo of a receipt or bill. Extract the single overall transaction: merchant as the description, the final total paid as the amount, and the printed date. If several totals appear use the grand total including tax.",
                },
            ],
            guard.userId,
            guard.preferences.currency,
            today,
            request.signal,
        );

        if (transaction.amount <= 0) {
            return NextResponse.json(
                { error: "I couldn't read a total on that receipt. Try a clearer photo." },
                { status: 422 },
            );
        }

        return NextResponse.json({ transaction });
    } catch (error) {
        return aiErrorResponse(error);
    }
}
