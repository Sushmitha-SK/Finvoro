import { NextResponse } from "next/server";

import { buildSnapshot, UNTRUSTED_DATA_RULE } from "@/lib/ai/context";
import { generateJson } from "@/lib/ai/generate";
import { BUCKETS } from "@/lib/ai/rate-limit";
import { aiErrorResponse, guardAi, readJson } from "@/lib/ai/route";
import { insightsOutputSchema, insightsRequestSchema } from "@/lib/ai/schemas";
import { getDashboardData } from "@/lib/data/dashboard";
import { parseDateInput, toDateInput } from "@/lib/dates";
import { aiEnv } from "@/lib/env";
import { getReportsData } from "@/lib/reports-data";
import type { Insight } from "@/types/finance";

export const maxDuration = 60;

const SYSTEM = `You are a sharp personal-finance analyst inside a budgeting app.
Produce 3 to 5 insights, ranked by impact, based ONLY on the JSON data provided.
- Every insight must cite specific numbers from the data.
- Prefer non-obvious observations (changes vs last period, concentration, pace, recurring costs) over restating totals.
- "achievement" is for genuinely good behaviour; "warning" for risks; "opportunity" for concrete ways to save.
- Keep titles under 9 words and details under 30 words.
- ${UNTRUSTED_DATA_RULE}`;

export async function POST(request: Request) {
    const guard = await guardAi(BUCKETS.structured);

    if (!guard.ok) return guard.response;

    const body = await readJson(request, insightsRequestSchema);

    if (!body.ok) return body.response;

    try {
        const today = toDateInput(new Date());
        let payload: unknown;

        if (body.data.scope === "dashboard") {
            payload = buildSnapshot(await getDashboardData(guard.userId), today);
        } else {
            const to = parseDateInput(body.data.to);

            to.setDate(to.getDate() + 1);

            const report = await getReportsData(guard.userId, {
                from: parseDateInput(body.data.from),
                to,
            });

            payload = {
                today,
                currency: guard.preferences.currency,
                period: { from: body.data.from, to: body.data.to },
                totals: {
                    income: report.totalIncome,
                    expenses: report.totalExpenses,
                    net: report.netBalance,
                    savingsRatePercent: Math.round(report.savingsRate),
                    transactionCount: report.transactionCount,
                },
                vsPreviousPeriod: {
                    incomeChangePercent: Math.round(report.comparison.incomeChange),
                    expenseChangePercent: Math.round(report.comparison.expenseChange),
                },
                topCategories: report.spendingByCategory.slice(0, 8).map((c) => ({
                    category: c.name,
                    amount: Math.round(c.amount),
                    sharePercent: Math.round(c.percentage),
                })),
                monthlyTrend: report.financialTrend,
                largestExpense: report.insights.largestExpense,
                highestSpendingDay: report.insights.highestSpendingDay,
            };
        }

        const result = await generateJson({
            model: aiEnv.model,
            system: SYSTEM,
            contents: [{ role: "user", parts: [{ text: `DATA:\n${JSON.stringify(payload)}` }] }],
            schema: insightsOutputSchema,
            temperature: 0.3,
            signal: request.signal,
        });

        const insights: Insight[] = result.insights.map((insight, index) => ({
            id: `ai-${index}`,
            title: insight.title,
            detail: insight.detail,
            kind: insight.kind,
            impact: insight.impact,
            suggestedAction: insight.suggestedAction || undefined,
        }));

        return NextResponse.json({ headline: result.headline, insights, generatedAt: new Date().toISOString() });
    } catch (error) {
        return aiErrorResponse(error);
    }
}
