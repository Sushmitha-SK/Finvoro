import type { Content } from "@google/genai";

import { getCategoryOptions } from "@/lib/data/categories";
import { isValidDateInput, toDateInput } from "@/lib/dates";
import { aiEnv } from "@/lib/env";

import { UNTRUSTED_DATA_RULE } from "./context";
import { generateJson } from "./generate";
import { parsedTransactionSchema, type ParsedTransaction } from "./schemas";

const SYSTEM = (categories: string[], today: string, currency: string) => `You extract ONE financial transaction from the user's input.
- Currency is ${currency}; amounts are plain numbers with no symbol.
- Today's date is ${today}. Resolve "today", "yesterday", "last friday" etc. relative to it. Default to today if no date is given.
- Existing categories: ${categories.length ? categories.join(", ") : "(none yet)"}.
  Choose the closest existing category. Only invent a new short category (1-2 words, Title Case) if none fits, and then set isNewCategory=true.
- "type" is "income" for salary, refunds, payments received, otherwise "expense".
- "description" is a short merchant/purpose, not the whole sentence.
- If a value is truly unknown use a sensible default and lower "confidence".
- ${UNTRUSTED_DATA_RULE}`;

/** Validates model output against the user's real categories and today's date. */
export async function normaliseParsed(
    parsed: ParsedTransaction,
    userId: string,
    today: string,
) {
    const categories = await getCategoryOptions(userId);
    const match = categories.find(
        (category) => category.name.toLowerCase() === parsed.category.trim().toLowerCase(),
    );

    return {
        description: parsed.description.trim().slice(0, 100),
        amount: Math.abs(Math.round(parsed.amount * 100) / 100),
        type: parsed.type,
        category: match?.name ?? parsed.category.trim().slice(0, 50),
        isNewCategory: !match,
        date: isValidDateInput(parsed.date) ? parsed.date : today,
        notes: parsed.notes.trim().slice(0, 250),
        confidence: Math.min(Math.max(parsed.confidence, 0), 1),
    };
}

export async function parseTransactionParts(
    parts: Content["parts"],
    userId: string,
    currency: string,
    today = toDateInput(new Date()),
    signal?: AbortSignal,
) {
    const categories = await getCategoryOptions(userId);

    const parsed = await generateJson({
        model: aiEnv.fastModel,
        system: SYSTEM(categories.map((category) => category.name), today, currency),
        contents: [{ role: "user", parts }],
        schema: parsedTransactionSchema,
        temperature: 0,
        signal,
    });

    return normaliseParsed(parsed, userId, today);
}
