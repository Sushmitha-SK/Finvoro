// "use server";

// import { auth } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";

// import { prisma } from "@/lib/prisma";

// import { transactionSchema } from "@/components/transactions/transaction-schema";

// export async function createTransaction(
//     data: unknown,
// ) {
//     const { userId } = await auth();

//     if (!userId) {
//         throw new Error("Unauthorized");
//     }

//     const parsed = transactionSchema.safeParse(data);

//     if (!parsed.success) {
//         throw new Error("Invalid transaction data");
//     }

//     const {
//         description,
//         amount,
//         type,
//         category,
//         date,
//         notes,
//     } = parsed.data;

//     const existingCategory =
//         await prisma.category.findFirst({
//             where: {
//                 name: category,
//                 clerkUserId: userId,
//             },
//         });

//     const transactionCategory =
//         existingCategory ??
//         (await prisma.category.create({
//             data: {
//                 name: category,
//                 clerkUserId: userId,
//             },
//         }));

//     await prisma.transaction.create({
//         data: {
//             clerkUserId: userId,
//             description,
//             amount,
//             type,
//             date: new Date(`${date}T00:00:00`),
//             notes: notes || null,
//             categoryId: transactionCategory.id,
//         },
//     });

//     revalidatePath("/transactions");
// }


"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { transactionSchema } from "@/components/transactions/transaction-schema";
import { formatCurrency } from "@/lib/format-currency";
import { prisma } from "@/lib/prisma";

async function checkBudgetNotification({
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
            clerkUserId_categoryId_month_year: {
                clerkUserId: userId,
                categoryId,
                month,
                year,
            },
        },
    });

    if (!budget) {
        return;
    }

    const startDate = new Date(
        year,
        month - 1,
        1,
    );

    const endDate = new Date(
        year,
        month,
        1,
    );

    const expenseResult =
        await prisma.transaction.aggregate({
            where: {
                clerkUserId: userId,
                categoryId,
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

    const budgetAmount = Number(
        budget.amount,
    );

    if (budgetAmount <= 0) {
        return;
    }

    const percentage =
        (spent / budgetAmount) * 100;

    const categoryName =
        (
            await prisma.category.findUnique({
                where: {
                    id: categoryId,
                },
                select: {
                    name: true,
                },
            })
        )?.name ?? "Category";


    if (percentage >= 100) {
        const notificationType =
            `budget-exceeded:${budget.id}`;

        const existingNotification =
            await prisma.notification.findFirst({
                where: {
                    clerkUserId: userId,
                    type: notificationType,
                },
            });

        if (!existingNotification) {
            const exceededAmount =
                Math.max(
                    spent - budgetAmount,
                    0,
                );

            await prisma.notification.create({
                data: {
                    clerkUserId: userId,
                    title: `${categoryName} budget exceeded`,
                    message: `You've spent ${formatCurrency(
                        spent,
                    )} of your ${formatCurrency(
                        budgetAmount,
                    )} budget. You're ${formatCurrency(
                        exceededAmount,
                    )} over budget.`,
                    type: notificationType,
                },
            });
        }

        return;
    }

    if (percentage >= 80) {
        const notificationType =
            `budget-warning:${budget.id}`;

        const existingNotification =
            await prisma.notification.findFirst({
                where: {
                    clerkUserId: userId,
                    type: notificationType,
                },
            });

        if (!existingNotification) {
            await prisma.notification.create({
                data: {
                    clerkUserId: userId,
                    title: `${categoryName} budget nearing limit`,
                    message: `You've spent ${formatCurrency(
                        spent,
                    )} of your ${formatCurrency(
                        budgetAmount,
                    )} budget. You're at ${Math.round(
                        percentage,
                    )}%.`,
                    type: notificationType,
                },
            });
        }
    }
}

export async function createTransaction(
    data: unknown,
) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const parsed =
        transactionSchema.safeParse(data);

    if (!parsed.success) {
        throw new Error(
            "Invalid transaction data",
        );
    }

    const {
        description,
        amount,
        type,
        category,
        date,
        notes,
    } = parsed.data;

    const existingCategory =
        await prisma.category.findFirst({
            where: {
                name: category,
                clerkUserId: userId,
            },
        });

    const transactionCategory =
        existingCategory ??
        (await prisma.category.create({
            data: {
                name: category,
                clerkUserId: userId,
            },
        }));

    const transactionDate =
        new Date(`${date}T00:00:00`);

    await prisma.transaction.create({
        data: {
            clerkUserId: userId,
            description,
            amount,
            type,
            date: transactionDate,
            notes: notes || null,
            categoryId:
                transactionCategory.id,
        },
    });


    if (type === "expense") {
        await checkBudgetNotification({
            userId,
            categoryId:
                transactionCategory.id,
            transactionDate,
        });
    }

    revalidatePath("/transactions");
    revalidatePath("/budgets");
    revalidatePath("/dashboard");
}