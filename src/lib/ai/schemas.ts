import { z } from "zod";

/** Gemini's responseJsonSchema wants plain JSON Schema without the $schema marker. */
export function toGeminiSchema(schema: z.ZodType) {
    const json = z.toJSONSchema(schema) as Record<string, unknown>;

    delete json.$schema;

    return json;
}

const kind = z.enum(["saving", "warning", "trend", "opportunity", "achievement"]);
const impact = z.enum(["high", "medium", "low"]);

export const insightsOutputSchema = z.object({
    headline: z
        .string()
        .describe("One sentence summarising the user's financial picture right now."),
    insights: z
        .array(
            z.object({
                title: z.string().describe("At most 9 words."),
                detail: z
                    .string()
                    .describe("One or two sentences that cite specific numbers from the data."),
                kind,
                impact,
                suggestedAction: z
                    .string()
                    .describe("One concrete next step, or an empty string if none applies."),
            }),
        )
        .min(1)
        .max(5),
});

export const parsedTransactionSchema = z.object({
    description: z.string().describe("Short merchant or purpose, e.g. 'Swiggy dinner'."),
    amount: z.number().describe("Positive amount in the user's currency."),
    type: z.enum(["income", "expense"]),
    category: z.string().describe("Best matching existing category name, else a short new name."),
    isNewCategory: z.boolean().describe("True only if no existing category fits."),
    date: z.string().describe("YYYY-MM-DD"),
    notes: z.string().describe("Extra detail worth keeping, or an empty string."),
    confidence: z.number().describe("0 to 1"),
});

export type ParsedTransaction = z.infer<typeof parsedTransactionSchema>;

export const categorizeOutputSchema = z.object({
    category: z.string(),
    isNewCategory: z.boolean(),
    type: z.enum(["income", "expense"]),
    confidence: z.number(),
});

export const budgetSuggestionsOutputSchema = z.object({
    suggestions: z
        .array(
            z.object({
                category: z.string(),
                amount: z.number().describe("Recommended monthly limit."),
                rationale: z.string().describe("One short sentence citing the user's history."),
            }),
        )
        .max(12),
});

/* ---------------------------- request bodies ---------------------------- */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const chatRequestSchema = z.object({
    messages: z
        .array(
            z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string().max(4000),
            }),
        )
        .min(1)
        .max(40),
    today: isoDate.optional(),
});

export const insightsRequestSchema = z.discriminatedUnion("scope", [
    z.object({ scope: z.literal("dashboard") }),
    z.object({ scope: z.literal("reports"), from: isoDate, to: isoDate }),
]);

export const parseRequestSchema = z.object({
    text: z.string().trim().min(2).max(300),
    today: isoDate.optional(),
});

export const categorizeRequestSchema = z.object({
    description: z.string().trim().min(2).max(120),
});

export const RECEIPT_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"] as const;
export const RECEIPT_MAX_BYTES = 4 * 1024 * 1024;
