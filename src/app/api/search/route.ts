import { NextResponse } from "next/server";

import { getUserId, unauthorized } from "@/lib/auth";
import { toDateInput } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { buildTransactionWhere } from "@/lib/transactions/get-transactions";

/** Lightweight transaction search used by the command palette. */
export async function GET(request: Request) {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

    if (query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    const rows = await prisma.transaction.findMany({
        where: buildTransactionWhere(userId, { search: query.slice(0, 80) }),
        include: { category: { select: { name: true } } },
        orderBy: { date: "desc" },
        take: 6,
    });

    return NextResponse.json({
        results: rows.map((row) => ({
            id: row.id,
            description: row.description,
            category: row.category.name,
            type: row.type,
            amount: Number(row.amount),
            date: toDateInput(row.date),
        })),
    });
}
