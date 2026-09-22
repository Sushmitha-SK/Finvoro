import { getUserId, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Full account export (JSON) - the "your data is yours" feature. */
export async function GET() {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    const [preferences, categories, transactions, budgets, goals] = await Promise.all([
        prisma.userPreference.findUnique({ where: { clerkUserId: userId } }),
        prisma.category.findMany({ where: { clerkUserId: userId } }),
        prisma.transaction.findMany({ where: { clerkUserId: userId }, orderBy: { date: "asc" } }),
        prisma.budget.findMany({ where: { clerkUserId: userId } }),
        prisma.goal.findMany({ where: { clerkUserId: userId } }),
    ]);

    const payload = {
        exportedAt: new Date().toISOString(),
        app: "Finvoro",
        preferences: preferences ? { currency: preferences.currency, aiEnabled: preferences.aiEnabled } : null,
        categories,
        transactions,
        budgets,
        goals,
    };

    return new Response(JSON.stringify(payload, null, 2), {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Content-Disposition": `attachment; filename="finvoro-export-${new Date().toISOString().slice(0, 10)}.json"`,
            "Cache-Control": "no-store",
        },
    });
}
