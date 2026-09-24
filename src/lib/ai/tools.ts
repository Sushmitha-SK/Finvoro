import type { FunctionDeclaration } from "@google/genai";
import { z } from "zod";

import { getBudgetRows } from "@/lib/data/budgets";
import { getCategoryOptions } from "@/lib/data/categories";
import { isValidDateInput, monthKey, parseDateInput, toDateInput } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { buildTransactionWhere } from "@/lib/transactions/get-transactions";

export type TransactionDraft = {
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    isNewCategory: boolean;
    date: string;
    notes: string;
};

export type ChatEvent =
    | { type: "text"; text: string }
    | { type: "tool"; name: string; label: string; status: "running" | "done" | "error" }
    | { type: "draft"; draft: TransactionDraft }
    | { type: "error"; message: string; code?: string }
    | { type: "done" };

export const TOOL_LABELS: Record<string, string> = {
    search_transactions: "Searching transactions",
    spending_summary: "Analysing spending",
    budget_status: "Checking budgets",
    draft_transaction: "Preparing a transaction",
};

const dateString = {
    type: "string",
    description: "Date as YYYY-MM-DD",
} as const;

export const toolDeclarations: FunctionDeclaration[] = [
    {
        name: "search_transactions",
        description:
            "Find individual transactions matching filters. Returns up to `limit` rows plus the total count and sum of ALL matches.",
        parametersJsonSchema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Text to match in description, notes or category." },
                type: { type: "string", enum: ["income", "expense"] },
                category: { type: "string", description: "Exact category name." },
                from: dateString,
                to: { ...dateString, description: "Inclusive end date, YYYY-MM-DD" },
                min_amount: { type: "number" },
                max_amount: { type: "number" },
                sort: { type: "string", enum: ["date_desc", "date_asc", "amount_desc", "amount_asc"] },
                limit: { type: "integer", description: "1-25, default 10" },
            },
        },
    },
    {
        name: "spending_summary",
        description:
            "Total and breakdown of income or expenses over a date range, grouped by category, month, day or merchant.",
        parametersJsonSchema: {
            type: "object",
            properties: {
                from: dateString,
                to: { ...dateString, description: "Inclusive end date, YYYY-MM-DD" },
                type: { type: "string", enum: ["expense", "income"], description: "Default expense" },
                group_by: { type: "string", enum: ["category", "month", "day", "merchant"] },
            },
            required: ["from", "to", "group_by"],
        },
    },
    {
        name: "budget_status",
        description: "Budgets with amount spent and remaining for a given month (defaults to the current month).",
        parametersJsonSchema: {
            type: "object",
            properties: {
                month: { type: "integer", description: "1-12" },
                year: { type: "integer" },
            },
        },
    },
    {
        name: "draft_transaction",
        description:
            "Prepare a transaction for the user to confirm. It is NOT saved until the user clicks confirm.",
        parametersJsonSchema: {
            type: "object",
            properties: {
                description: { type: "string" },
                amount: { type: "number", description: "Positive number" },
                type: { type: "string", enum: ["income", "expense"] },
                category: { type: "string" },
                date: dateString,
                notes: { type: "string" },
            },
            required: ["description", "amount", "type", "category"],
        },
    },
];

/* ------------------------------ arg validation ------------------------------ */

const optionalDate = z
    .string()
    .optional()
    .refine((value) => value === undefined || isValidDateInput(value), "Use YYYY-MM-DD");

const searchArgs = z.object({
    query: z.string().max(100).optional(),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().max(60).optional(),
    from: optionalDate,
    to: optionalDate,
    min_amount: z.number().nonnegative().optional(),
    max_amount: z.number().nonnegative().optional(),
    sort: z.enum(["date_desc", "date_asc", "amount_desc", "amount_asc"]).optional(),
    limit: z.number().int().min(1).max(25).optional(),
});

const summaryArgs = z.object({
    from: z.string().refine(isValidDateInput, "Use YYYY-MM-DD"),
    to: z.string().refine(isValidDateInput, "Use YYYY-MM-DD"),
    type: z.enum(["expense", "income"]).optional(),
    group_by: z.enum(["category", "month", "day", "merchant"]),
});

const budgetArgs = z.object({
    month: z.number().int().min(1).max(12).optional(),
    year: z.number().int().min(2000).max(2100).optional(),
});

const draftArgs = z.object({
    description: z.string().trim().min(2).max(100),
    amount: z.number().positive().max(1_000_000_000),
    type: z.enum(["income", "expense"]),
    category: z.string().trim().min(1).max(50),
    date: optionalDate,
    notes: z.string().max(250).optional(),
});

/* -------------------------------- executors -------------------------------- */

export type ToolContext = { userId: string; today: string };
export type ToolResult = { output: unknown; event?: ChatEvent };

const round = (value: number) => Math.round(value * 100) / 100;

async function searchTransactions(args: z.infer<typeof searchArgs>, ctx: ToolContext) {
    const baseWhere = buildTransactionWhere(ctx.userId, {
        search: args.query,
        type: args.type,
        category: args.category,
        from: args.from,
        to: args.to,
    });

    const where = {
        ...baseWhere,
        ...(args.min_amount !== undefined || args.max_amount !== undefined
            ? {
                amount: {
                    ...(args.min_amount !== undefined ? { gte: args.min_amount } : {}),
                    ...(args.max_amount !== undefined ? { lte: args.max_amount } : {}),
                },
            }
            : {}),
    };

    const [sort, direction] = (args.sort ?? "date_desc").split("_") as ["date" | "amount", "asc" | "desc"];

    const [rows, aggregate] = await Promise.all([
        prisma.transaction.findMany({
            where,
            include: { category: { select: { name: true } } },
            orderBy: [{ [sort]: direction }, { createdAt: "desc" }],
            take: args.limit ?? 10,
        }),
        prisma.transaction.aggregate({ where, _sum: { amount: true }, _count: true }),
    ]);

    return {
        totalMatches: aggregate._count,
        sumOfAllMatches: round(Number(aggregate._sum.amount ?? 0)),
        showing: rows.length,
        transactions: rows.map((row) => ({
            date: toDateInput(row.date),
            description: row.description,
            category: row.category.name,
            type: row.type,
            amount: round(Number(row.amount)),
        })),
    };
}

async function spendingSummary(args: z.infer<typeof summaryArgs>, ctx: ToolContext) {
    const end = parseDateInput(args.to);

    end.setDate(end.getDate() + 1);

    const rows = await prisma.transaction.findMany({
        where: {
            clerkUserId: ctx.userId,
            type: args.type ?? "expense",
            date: { gte: parseDateInput(args.from), lt: end },
        },
        select: {
            amount: true,
            date: true,
            description: true,
            category: { select: { name: true } },
        },
        take: 5000,
    });

    const groups = new Map<string, { total: number; count: number }>();

    for (const row of rows) {
        const key =
            args.group_by === "category"
                ? row.category.name
                : args.group_by === "month"
                    ? monthKey(row.date)
                    : args.group_by === "day"
                        ? toDateInput(row.date)
                        : row.description.trim().toLowerCase();

        const group = groups.get(key) ?? { total: 0, count: 0 };

        group.total += Number(row.amount);
        group.count += 1;
        groups.set(key, group);
    }

    const sorted = Array.from(groups.entries())
        .map(([name, group]) => ({ name, total: round(group.total), count: group.count }))
        .sort((a, b) =>
            args.group_by === "month" || args.group_by === "day"
                ? a.name.localeCompare(b.name)
                : b.total - a.total,
        );

    return {
        type: args.type ?? "expense",
        from: args.from,
        to: args.to,
        total: round(rows.reduce((sum, row) => sum + Number(row.amount), 0)),
        transactionCount: rows.length,
        groupedBy: args.group_by,
        groups: sorted.slice(0, 20),
        truncated: sorted.length > 20,
    };
}

async function budgetStatus(args: z.infer<typeof budgetArgs>, ctx: ToolContext) {
    const now = parseDateInput(ctx.today);
    const month = args.month ?? now.getMonth() + 1;
    const year = args.year ?? now.getFullYear();
    const rows = await getBudgetRows(ctx.userId, { month, year });

    return {
        month,
        year,
        budgets: rows.map((row) => ({
            category: row.category,
            limit: round(row.amount),
            spent: round(row.spent),
            remaining: round(row.remaining),
            percentUsed: Math.round(row.percentage),
            status: row.status,
        })),
    };
}

async function draftTransaction(args: z.infer<typeof draftArgs>, ctx: ToolContext): Promise<ToolResult> {
    const categories = await getCategoryOptions(ctx.userId);
    const match = categories.find(
        (category) => category.name.toLowerCase() === args.category.toLowerCase(),
    );

    const draft: TransactionDraft = {
        description: args.description,
        amount: round(args.amount),
        type: args.type,
        category: match?.name ?? args.category,
        isNewCategory: !match,
        date: args.date ?? ctx.today,
        notes: args.notes ?? "",
    };

    return {
        output: {
            status: "draft_shown_to_user",
            note: "The user must click confirm. Do not say it was saved.",
            availableCategories: categories.map((category) => category.name),
        },
        event: { type: "draft", draft },
    };
}

export async function executeTool(
    name: string,
    rawArgs: Record<string, unknown> | undefined,
    ctx: ToolContext,
): Promise<ToolResult> {
    try {
        switch (name) {
            case "search_transactions":
                return { output: await searchTransactions(searchArgs.parse(rawArgs ?? {}), ctx) };
            case "spending_summary":
                return { output: await spendingSummary(summaryArgs.parse(rawArgs ?? {}), ctx) };
            case "budget_status":
                return { output: await budgetStatus(budgetArgs.parse(rawArgs ?? {}), ctx) };
            case "draft_transaction":
                return await draftTransaction(draftArgs.parse(rawArgs ?? {}), ctx);
            default:
                return { output: { error: `Unknown tool: ${name}` } };
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                output: {
                    error: "Invalid arguments",
                    issues: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
                },
            };
        }

        console.error(`Tool ${name} failed:`, error);

        return { output: { error: "The tool failed to run." } };
    }
}
