import { prisma } from "@/lib/prisma";

const getMonthRange = () => {
    const now = new Date();

    const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
    );

    const startOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1,
    );

    return {
        startOfMonth,
        startOfNextMonth,
    };
};

export async function getDashboardData(
    clerkUserId: string,
) {
    const {
        startOfMonth,
        startOfNextMonth,
    } = getMonthRange();

    const [
        allIncome,
        allExpenses,
        monthlyIncome,
        monthlyExpenses,
        spendingByCategory,
        budgets,
        recentTransactions,
        preference,
    ] = await Promise.all([
        prisma.transaction.aggregate({
            where: {
                clerkUserId,
                type: "income",
            },
            _sum: {
                amount: true,
            },
        }),

        prisma.transaction.aggregate({
            where: {
                clerkUserId,
                type: "expense",
            },
            _sum: {
                amount: true,
            },
        }),

        prisma.transaction.aggregate({
            where: {
                clerkUserId,
                type: "income",
                date: {
                    gte: startOfMonth,
                    lt: startOfNextMonth,
                },
            },
            _sum: {
                amount: true,
            },
        }),

        prisma.transaction.aggregate({
            where: {
                clerkUserId,
                type: "expense",
                date: {
                    gte: startOfMonth,
                    lt: startOfNextMonth,
                },
            },
            _sum: {
                amount: true,
            },
        }),

        prisma.transaction.groupBy({
            by: ["categoryId"],
            where: {
                clerkUserId,
                type: "expense",
                date: {
                    gte: startOfMonth,
                    lt: startOfNextMonth,
                },
            },
            _sum: {
                amount: true,
            },
            orderBy: {
                _sum: {
                    amount: "desc",
                },
            },
        }),

        prisma.budget.findMany({
            where: {
                clerkUserId,
                month:
                    startOfMonth.getMonth() + 1,
                year:
                    startOfMonth.getFullYear(),
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        }),

        prisma.transaction.findMany({
            where: {
                clerkUserId,
            },
            include: {
                category: true,
            },
            orderBy: {
                date: "desc",
            },
            take: 5,
        }),

        prisma.userPreference.findUnique({
            where: {
                clerkUserId,
            },
            select: {
                currency: true,
            },
        }),
    ]);

    const categoryIds =
        spendingByCategory.map(
            (item) => item.categoryId,
        );

    const categories =
        categoryIds.length > 0
            ? await prisma.category.findMany({
                where: {
                    id: {
                        in: categoryIds,
                    },
                    clerkUserId,
                },
            })
            : [];

    const categoryMap = new Map(
        categories.map((category) => [
            category.id,
            category,
        ]),
    );

    const totalIncome =
        Number(allIncome._sum.amount ?? 0);

    const totalExpenses =
        Number(allExpenses._sum.amount ?? 0);

    const currentMonthIncome =
        Number(
            monthlyIncome._sum.amount ?? 0,
        );

    const currentMonthExpenses =
        Number(
            monthlyExpenses._sum.amount ?? 0,
        );

    const balance =
        totalIncome - totalExpenses;

    const savingsRate =
        currentMonthIncome > 0
            ? Math.round(
                ((currentMonthIncome -
                    currentMonthExpenses) /
                    currentMonthIncome) *
                100,
            )
            : 0;

    const totalCategoryExpenses =
        spendingByCategory.reduce(
            (total, item) =>
                total +
                Number(
                    item._sum.amount ?? 0,
                ),
            0,
        );

    const spendingCategories =
        spendingByCategory.map((item) => {
            const amount = Number(
                item._sum.amount ?? 0,
            );

            const category =
                categoryMap.get(
                    item.categoryId,
                );

            return {
                name:
                    category?.name ??
                    "Other",
                amount,
                percentage:
                    totalCategoryExpenses >
                        0
                        ? Math.round(
                            (amount /
                                totalCategoryExpenses) *
                            100,
                        )
                        : 0,
            };
        });

    const budgetOverview =
        await Promise.all(
            budgets.map(
                async (budget) => {
                    const spent =
                        await prisma.transaction.aggregate(
                            {
                                where: {
                                    clerkUserId,
                                    categoryId:
                                        budget.categoryId,
                                    type: "expense",
                                    date: {
                                        gte: startOfMonth,
                                        lt: startOfNextMonth,
                                    },
                                },
                                _sum: {
                                    amount: true,
                                },
                            },
                        );

                    return {
                        id: budget.id,
                        category:
                            budget.category
                                .name,
                        spent: Number(
                            spent._sum
                                .amount ?? 0,
                        ),
                        limit: Number(
                            budget.amount,
                        ),
                    };
                },
            ),
        );

    return {
        currency:
            preference?.currency ?? "INR",

        financialSummary: {
            balance,
            income: currentMonthIncome,
            expenses:
                currentMonthExpenses,
            savingsRate,
        },

        spendingCategories,

        budgets: budgetOverview,

        recentTransactions:
            recentTransactions.map(
                (transaction) => ({
                    id: transaction.id,
                    description:
                        transaction.description,
                    category:
                        transaction.category
                            .name,
                    type: transaction.type,
                    amount: Number(
                        transaction.amount,
                    ),
                    date: transaction.date,
                }),
            ),
    };
}