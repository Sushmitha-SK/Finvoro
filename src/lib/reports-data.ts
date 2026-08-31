import { prisma } from "@/lib/prisma";

type ReportsDateRange = {
    from: Date;
    to: Date;
};

type CategoryTotal = {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    amount: number;
};

type InsightTransaction = {
    amount: number;
    description: string;
    category: string;
};

function calculatePercentage(
    current: number,
    previous: number,
) {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }

    return ((current - previous) / previous) * 100;
}

function getMonthKey(date: Date) {
    return `${date.getFullYear()}-${String(
        date.getMonth() + 1,
    ).padStart(2, "0")}`;
}

function formatMonth(date: Date) {
    return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        year: "numeric",
    }).format(date);
}

function getFinancialTrend(
    transactions: Array<{
        amount: unknown;
        type: string;
        date: Date;
    }>,
    from: Date,
    to: Date,
) {
    const totals = new Map<
        string,
        {
            month: string;
            income: number;
            expenses: number;
            net: number;
        }
    >();

    const cursor = new Date(
        from.getFullYear(),
        from.getMonth(),
        1,
    );

    const end = new Date(
        to.getFullYear(),
        to.getMonth(),
        1,
    );

    while (cursor < end) {
        const key = getMonthKey(cursor);

        totals.set(key, {
            month: formatMonth(cursor),
            income: 0,
            expenses: 0,
            net: 0,
        });

        cursor.setMonth(cursor.getMonth() + 1);
    }

    for (const transaction of transactions) {
        const key = getMonthKey(transaction.date);
        const existing = totals.get(key);

        if (!existing) {
            continue;
        }

        const amount = Number(transaction.amount);

        if (transaction.type === "income") {
            existing.income += amount;
        } else {
            existing.expenses += amount;
        }

        existing.net =
            existing.income -
            existing.expenses;
    }

    return Array.from(totals.values());
}

export async function getReportsData(
    userId: string,
    { from, to }: ReportsDateRange,
) {
    const transactions =
        await prisma.transaction.findMany({
            where: {
                clerkUserId: userId,
                date: {
                    gte: from,
                    lt: to,
                },
            },
            select: {
                amount: true,
                type: true,
                date: true,
                description: true,
                categoryId: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                        color: true,
                    },
                },
            },
            orderBy: {
                date: "asc",
            },
        });

    let totalIncome = 0;
    let totalExpenses = 0;

    let expenseCount = 0;

    const categoryTotals = new Map<
        string,
        CategoryTotal
    >();

    let largestIncome:
        | InsightTransaction
        | null = null;

    let largestExpense:
        | InsightTransaction
        | null = null;

    const dailyExpenses = new Map<
        string,
        number
    >();

    for (const transaction of transactions) {
        const amount = Number(transaction.amount);

        if (transaction.type === "income") {
            totalIncome += amount;

            if (
                !largestIncome ||
                amount > largestIncome.amount
            ) {
                largestIncome = {
                    amount,
                    description:
                        transaction.description,
                    category:
                        transaction.category.name,
                };
            }

            continue;
        }

        totalExpenses += amount;
        expenseCount += 1;

        const existing =
            categoryTotals.get(
                transaction.categoryId,
            );

        if (existing) {
            existing.amount += amount;
        } else {
            categoryTotals.set(
                transaction.categoryId,
                {
                    id: transaction.category.id,
                    name: transaction.category.name,
                    icon: transaction.category.icon,
                    color: transaction.category.color,
                    amount,
                },
            );
        }

        if (
            !largestExpense ||
            amount > largestExpense.amount
        ) {
            largestExpense = {
                amount,
                description:
                    transaction.description,
                category:
                    transaction.category.name,
            };
        }

        const dateKey =
            transaction.date
                .toISOString()
                .slice(0, 10);

        dailyExpenses.set(
            dateKey,
            (dailyExpenses.get(dateKey) ?? 0) +
            amount,
        );
    }

    const netBalance =
        totalIncome - totalExpenses;

    const savingsRate =
        totalIncome > 0
            ? (netBalance / totalIncome) * 100
            : 0;

    const spendingByCategory =
        Array.from(
            categoryTotals.values(),
        )
            .sort(
                (a, b) =>
                    b.amount - a.amount,
            )
            .map((category) => ({
                ...category,
                percentage:
                    totalExpenses > 0
                        ? (category.amount /
                            totalExpenses) *
                        100
                        : 0,
            }));

    const topSpendingCategory =
        spendingByCategory[0] ?? null;

    const highestSpendingDay =
        Array.from(
            dailyExpenses.entries(),
        )
            .sort(
                ([, amountA], [, amountB]) =>
                    amountB - amountA,
            )
            .map(([date, amount]) => ({
                date,
                amount,
            }))[0] ?? null;

    const averageTransaction =
        transactions.length > 0
            ? (totalIncome +
                totalExpenses) /
            transactions.length
            : 0;

    const averageExpense =
        expenseCount > 0
            ? totalExpenses / expenseCount
            : 0;

    const financialTrend =
        getFinancialTrend(
            transactions,
            from,
            to,
        );

    const rangeLength =
        to.getTime() -
        from.getTime();

    const previousFrom = new Date(
        from.getTime() - rangeLength,
    );

    const previousTo = new Date(
        from.getTime(),
    );

    const previousTransactions =
        await prisma.transaction.findMany({
            where: {
                clerkUserId: userId,
                date: {
                    gte: previousFrom,
                    lt: previousTo,
                },
            },
            select: {
                amount: true,
                type: true,
            },
        });

    let previousIncome = 0;
    let previousExpenses = 0;

    for (const transaction of previousTransactions) {
        const amount = Number(transaction.amount);

        if (transaction.type === "income") {
            previousIncome += amount;
        } else {
            previousExpenses += amount;
        }
    }

    const previousNetBalance =
        previousIncome -
        previousExpenses;

    const previousSavingsRate =
        previousIncome > 0
            ? (previousNetBalance /
                previousIncome) *
            100
            : 0;

    const incomeChange =
        calculatePercentage(
            totalIncome,
            previousIncome,
        );

    const expenseChange =
        calculatePercentage(
            totalExpenses,
            previousExpenses,
        );

    const savingsRateChange =
        savingsRate -
        previousSavingsRate;

    return {
        totalIncome,
        totalExpenses,
        netBalance,
        savingsRate,

        transactionCount:
            transactions.length,

        spendingByCategory,

        financialTrend,

        insights: {
            transactionCount:
                transactions.length,

            averageTransaction,

            averageExpense,

            largestIncome,

            largestExpense,

            topSpendingCategory,

            highestSpendingDay,
        },

        comparison: {
            previousIncome,
            previousExpenses,
            previousSavingsRate,
            incomeChange,
            expenseChange,
            savingsRateChange,
        },
    };
}