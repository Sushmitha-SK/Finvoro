import { NextResponse } from "next/server";

import { BUCKETS } from "@/lib/ai/rate-limit";
import { aiErrorResponse, guardAi, readJson } from "@/lib/ai/route";
import { parseRequestSchema } from "@/lib/ai/schemas";
import { parseTransactionParts } from "@/lib/ai/parse-transaction";
import { isValidDateInput, toDateInput } from "@/lib/dates";

export async function POST(request: Request) {
    const guard = await guardAi(BUCKETS.structured);

    if (!guard.ok) return guard.response;

    const body = await readJson(request, parseRequestSchema);

    if (!body.ok) return body.response;

    try {
        const today = isValidDateInput(body.data.today) ? body.data.today : toDateInput(new Date());

        const transaction = await parseTransactionParts(
            [{ text: `INPUT: ${body.data.text}` }],
            guard.userId,
            guard.preferences.currency,
            today,
            request.signal,
        );

        if (transaction.amount <= 0) {
            return NextResponse.json(
                { error: "I couldn't find an amount in that. Try including one, e.g. “Coffee 180”." },
                { status: 422 },
            );
        }

        return NextResponse.json({ transaction });
    } catch (error) {
        return aiErrorResponse(error);
    }
}
