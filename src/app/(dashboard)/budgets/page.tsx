import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AddBudgetDialog } from "@/components/budgets/add-budget-dialog";
import { AiBudgetSuggestions } from "@/components/budgets/ai-budget-suggestions";
import { BudgetOverview } from "@/components/budgets/budget-overview";
import { getUserId } from "@/lib/auth";
import { getBudgetRows } from "@/lib/data/budgets";
import { getUserPreferences } from "@/lib/data/preferences";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Budgets" };

export default async function BudgetsPage() {
    const userId = await getUserId();

    if (!userId) redirect("/sign-in");

    const [rows, categories, preferences] = await Promise.all([
        getBudgetRows(userId),
        prisma.category.findMany({
            where: { clerkUserId: userId },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
        getUserPreferences(userId),
    ]);

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Budgets</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Set spending limits and keep track of your expenses.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <AiBudgetSuggestions />
                        <AddBudgetDialog categories={categories} />
                    </div>
                </div>

                <BudgetOverview
                    budgets={rows.map((row) => ({
                        id: row.id,
                        category: row.category,
                        categoryId: row.categoryId,
                        amount: row.amount,
                        spent: row.spent,
                        remaining: row.remaining,
                        // The bar is capped at 100%; `spent` still shows the true overspend.
                        percentage: Math.min(row.percentage, 100),
                        month: row.month,
                        year: row.year,
                    }))}
                    categories={categories}
                    currency={preferences.currency}
                />
            </div>
        </div>
    );
}
