import { NextResponse } from "next/server";

import { generateJson } from "@/lib/ai/generate";
import { BUCKETS } from "@/lib/ai/rate-limit";
import { aiErrorResponse, guardAi, readJson } from "@/lib/ai/route";
import { categorizeOutputSchema, categorizeRequestSchema } from "@/lib/ai/schemas";
import { UNTRUSTED_DATA_RULE } from "@/lib/ai/context";
import { getCategoryOptions } from "@/lib/data/categories";
import { aiEnv } from "@/lib/env";

export async function POST(request: Request) {
    const guard = await guardAi(BUCKETS.structured);

    if (!guard.ok) return guard.response;

    const body = await readJson(request, categorizeRequestSchema);

    if (!body.ok) return body.response;

    try {
        const categories = await getCategoryOptions(guard.userId);
        const names = categories.map((category) => category.name);

        const result = await generateJson({
            model: aiEnv.fastModel,
            system: `Pick the best category for a transaction description.
Existing categories: ${names.length ? names.join(", ") : "(none)"}.
Use an existing category whenever one reasonably fits. Otherwise propose a short Title Case name (1-2 words) and set isNewCategory=true.
Set type to "income" for salary/refund/received payments, else "expense". ${UNTRUSTED_DATA_RULE}`,
            contents: [{ role: "user", parts: [{ text: `DESCRIPTION: ${body.data.description}` }] }],
            schema: categorizeOutputSchema,
            temperature: 0,
            signal: request.signal,
        });

        const match = categories.find(
            (category) => category.name.toLowerCase() === result.category.trim().toLowerCase(),
        );

        return NextResponse.json({
            category: match?.name ?? result.category.trim().slice(0, 50),
            isNewCategory: !match,
            type: result.type,
            confidence: Math.min(Math.max(result.confidence, 0), 1),
        });
    } catch (error) {
        return aiErrorResponse(error);
    }
}
