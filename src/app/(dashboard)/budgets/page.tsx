import { currentUser } from "@clerk/nextjs/server";
import { unstable_noStore as noStore } from "next/cache";

import { AddBudgetDialog } from "@/components/budgets/add-budget-dialog";
import { BudgetOverview } from "@/components/budgets/budget-overview";

import { prisma } from "@/lib/prisma";

export default async function BudgetsPage() {
    noStore();

    const user = await currentUser();

    if (!user) {
        return null;
    }

    const [budgets, categories, preference] =
        await Promise.all([
            prisma.budget.findMany({
                where: {
                    clerkUserId: user.id,
                },
                include: {
                    category: true,
                },
                orderBy: [
                    {
                        year: "desc",
                    },
                    {
                        month: "desc",
                    },
                    {
                        category: {
                            name: "asc",
                        },
                    },
                ],
            }),

            prisma.category.findMany({
                where: {
                    clerkUserId: user.id,
                },
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    name: "asc",
                },
            }),

            prisma.userPreference.findUnique({
                where: {
                    clerkUserId: user.id,
                },
                select: {
                    currency: true,
                },
            }),
        ]);

    const currency =
        preference?.currency ?? "INR";

    const budgetData = await Promise.all(
        budgets.map(async (budget) => {
            const startDate = new Date(
                budget.year,
                budget.month - 1,
                1,
            );

            const endDate = new Date(
                budget.year,
                budget.month,
                1,
            );

            const expenseResult =
                await prisma.transaction.aggregate({
                    where: {
                        clerkUserId: user.id,
                        categoryId: budget.categoryId,
                        type: "expense",
                        date: {
                            gte: startDate,
                            lt: endDate,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                });

            const spent = Number(
                expenseResult._sum.amount ?? 0,
            );

            const amount = Number(budget.amount);

            const remaining = Math.max(
                amount - spent,
                0,
            );

            const percentage =
                amount > 0
                    ? Math.min(
                        (spent / amount) * 100,
                        100,
                    )
                    : 0;

            return {
                id: budget.id,
                category: budget.category.name,
                categoryId: budget.categoryId,
                amount,
                spent,
                remaining,
                percentage,
                month: budget.month,
                year: budget.year,
            };
        }),
    );

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Budgets
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Set spending limits and keep track of
                            your expenses.
                        </p>
                    </div>

                    <AddBudgetDialog
                        categories={categories}
                    />
                </div>

                <BudgetOverview
                    budgets={budgetData}
                    categories={categories}
                    currency={currency}
                />
            </div>
        </div>
    );
}