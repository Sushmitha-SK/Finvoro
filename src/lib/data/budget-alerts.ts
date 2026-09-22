import { formatCurrency } from "@/lib/format-currency";
import { prisma } from "@/lib/prisma";

import { getUserPreferences } from "./preferences";

/**
 * After an expense changes, raise a one-off notification when the category's
 * budget for that month crosses 80% or 100%.
 */
export async function checkBudgetNotification({
    userId,
    categoryId,
    transactionDate,
}: {
    userId: string;
    categoryId: string;
    transactionDate: Date;
}) {
    const month = transactionDate.getMonth() + 1;
    const year = transactionDate.getFullYear();

    const budget = await prisma.budget.findUnique({
        where: {
            clerkUserId_categoryId_month_year: { clerkUserId: userId, categoryId, month, year },
        },
        include: { category: { select: { name: true } } },
    });

    if (!budget || Number(budget.amount) <= 0) return;

    const spentResult = await prisma.transaction.aggregate({
        where: {
            clerkUserId: userId,
            categoryId,
            type: "expense",
            date: { gte: new Date(year, month - 1, 1), lt: new Date(year, month, 1) },
        },
        _sum: { amount: true },
    });

    const spent = Number(spentResult._sum.amount ?? 0);
    const limit = Number(budget.amount);
    const percentage = (spent / limit) * 100;

    if (percentage < 80) return;

    const exceeded = percentage >= 100;
    const type = `${exceeded ? "budget-exceeded" : "budget-warning"}:${budget.id}`;

    const existing = await prisma.notification.findFirst({
        where: { clerkUserId: userId, type },
        select: { id: true },
    });

    if (existing) return;

    const { currency } = await getUserPreferences(userId);
    const money = (value: number) => formatCurrency(value, currency);

    await prisma.notification.create({
        data: {
            clerkUserId: userId,
            type,
            title: exceeded
                ? `${budget.category.name} budget exceeded`
                : `${budget.category.name} budget nearing limit`,
            message: exceeded
                ? `You've spent ${money(spent)} of your ${money(limit)} budget. You're ${money(spent - limit)} over.`
                : `You've spent ${money(spent)} of your ${money(limit)} budget. You're at ${Math.round(percentage)}%.`,
        },
    });
}
