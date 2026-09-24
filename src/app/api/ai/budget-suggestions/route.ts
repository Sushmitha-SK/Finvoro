import { NextResponse } from "next/server";

import { generateJson } from "@/lib/ai/generate";
import { BUCKETS } from "@/lib/ai/rate-limit";
import { aiErrorResponse, guardAi } from "@/lib/ai/route";
import { budgetSuggestionsOutputSchema } from "@/lib/ai/schemas";
import { getCategoryOptions } from "@/lib/data/categories";
import { startOfMonth } from "@/lib/dates";
import { aiEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

/** Round to a "human" number: nearest 50 under 5k, 100 under 50k, else 500. */
function niceAmount(value: number) {
    const step = value < 5000 ? 50 : value < 50000 ? 100 : 500;

    return Math.max(step, Math.round(value / step) * step);
}

export async function POST(request: Request) {
    const guard = await guardAi(BUCKETS.structured);

    if (!guard.ok) return guard.response;

    try {
        const now = new Date();
        const from = startOfMonth(now, -3);
        const to = startOfMonth(now);

        const [expenses, existing, categories] = await Promise.all([
            prisma.transaction.findMany({
                where: { clerkUserId: guard.userId, type: "expense", date: { gte: from, lt: to } },
                select: { amount: true, categoryId: true, date: true },
            }),
            prisma.budget.findMany({
                where: {
                    clerkUserId: guard.userId,
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                },
                select: { categoryId: true },
            }),
            getCategoryOptions(guard.userId),
        ]);

        const budgeted = new Set(existing.map((budget) => budget.categoryId));
        const stats = new Map<string, { total: number; months: Set<string> }>();

        for (const expense of expenses) {
            if (budgeted.has(expense.categoryId)) continue;

            const entry = stats.get(expense.categoryId) ?? { total: 0, months: new Set<string>() };

            entry.total += Number(expense.amount);
            entry.months.add(`${expense.date.getFullYear()}-${expense.date.getMonth()}`);
            stats.set(expense.categoryId, entry);
        }

        const candidates = Array.from(stats.entries())
            .map(([categoryId, entry]) => {
                const category = categories.find((item) => item.id === categoryId);
                const monthlyAverage = entry.total / Math.max(entry.months.size, 1);

                return category
                    ? { categoryId, category: category.name, monthlyAverage, monthsObserved: entry.months.size }
                    : null;
            })
            .filter((item): item is NonNullable<typeof item> => item !== null && item.monthlyAverage > 0)
            .sort((a, b) => b.monthlyAverage - a.monthlyAverage)
            .slice(0, 10);

        if (candidates.length === 0) {
            return NextResponse.json({
                suggestions: [],
                reason:
                    existing.length > 0
                        ? "Every category with recent spending already has a budget."
                        : "Add a few months of expenses first so there's history to learn from.",
            });
        }

        const result = await generateJson({
            model: aiEnv.model,
            system: `You recommend realistic monthly budgets from a user's spending history (currency ${guard.preferences.currency}).
For each candidate category return a recommended monthly limit. Essentials (rent, utilities, groceries) should sit near the average; discretionary categories (dining, shopping, entertainment) should be 5-15% below it to nudge savings. Give a one-sentence rationale citing the average.`,
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `CANDIDATES:\n${JSON.stringify(
                                candidates.map((c) => ({
                                    category: c.category,
                                    monthlyAverage: Math.round(c.monthlyAverage),
                                    monthsObserved: c.monthsObserved,
                                })),
                            )}`,
                        },
                    ],
                },
            ],
            schema: budgetSuggestionsOutputSchema,
            temperature: 0.2,
            signal: request.signal,
        });

        const suggestions = result.suggestions
            .map((suggestion) => {
                const candidate = candidates.find(
                    (item) => item.category.toLowerCase() === suggestion.category.trim().toLowerCase(),
                );

                if (!candidate || !(suggestion.amount > 0)) return null;

                const bounded = Math.min(
                    Math.max(suggestion.amount, candidate.monthlyAverage * 0.5),
                    candidate.monthlyAverage * 1.5,
                );

                return {
                    categoryId: candidate.categoryId,
                    category: candidate.category,
                    amount: niceAmount(bounded),
                    averageSpend: Math.round(candidate.monthlyAverage),
                    rationale: suggestion.rationale,
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);

        return NextResponse.json({
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            suggestions,
        });
    } catch (error) {
        return aiErrorResponse(error);
    }
}
