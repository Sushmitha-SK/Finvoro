import { prisma } from "@/lib/prisma";
import type { BudgetProgress } from "@/types/finance";

export function budgetStatus(percentage: number): BudgetProgress["status"] {
    if (percentage >= 100) return "exceeded";
    if (percentage >= 80) return "warning";
    return "ok";
}

export type BudgetRow = BudgetProgress & {
    amount: number;
    remaining: number;
    month: number;
    year: number;
};

/**
 * Budgets with how much has been spent against each, using ONE aggregate
 * query for every budget (the old implementation ran one query per budget).
 */
export async function getBudgetRows(
    clerkUserId: string,
    filter?: { month: number; year: number },
): Promise<BudgetRow[]> {
    const budgets = await prisma.budget.findMany({
        where: { clerkUserId, ...(filter ?? {}) },
        include: { category: true },
        orderBy: [{ year: "desc" }, { month: "desc" }, { category: { name: "asc" } }],
    });

    if (budgets.length === 0) {
        return [];
    }

    const from = new Date(
        Math.min(...budgets.map((b) => new Date(b.year, b.month - 1, 1).getTime())),
    );
    const to = new Date(
        Math.max(...budgets.map((b) => new Date(b.year, b.month, 1).getTime())),
    );

    const expenses = await prisma.transaction.findMany({
        where: {
            clerkUserId,
            type: "expense",
            date: { gte: from, lt: to },
            categoryId: { in: [...new Set(budgets.map((b) => b.categoryId))] },
        },
        select: { categoryId: true, amount: true, date: true },
    });

    const spentByKey = new Map<string, number>();

    for (const expense of expenses) {
        const key = `${expense.categoryId}:${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`;

        spentByKey.set(key, (spentByKey.get(key) ?? 0) + Number(expense.amount));
    }

    return budgets.map((budget) => {
        const amount = Number(budget.amount);
        const spent = spentByKey.get(`${budget.categoryId}:${budget.year}-${budget.month}`) ?? 0;
        const percentage = amount > 0 ? (spent / amount) * 100 : 0;

        return {
            id: budget.id,
            categoryId: budget.categoryId,
            category: budget.category.name,
            amount,
            limit: amount,
            spent,
            remaining: Math.max(amount - spent, 0),
            percentage,
            status: budgetStatus(percentage),
            month: budget.month,
            year: budget.year,
        };
    });
}
