import { csvResponse, toCsv } from "@/lib/csv";
import { toDateInput } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import {
    buildTransactionWhere,
    type TransactionFilters,
} from "@/lib/transactions/get-transactions";

const MAX_EXPORT_ROWS = 50_000;

export async function transactionsCsvResponse(
    clerkUserId: string,
    filters: TransactionFilters,
    filename: string,
) {
    const rows = await prisma.transaction.findMany({
        where: buildTransactionWhere(clerkUserId, filters),
        select: {
            date: true,
            type: true,
            description: true,
            amount: true,
            notes: true,
            category: { select: { name: true } },
        },
        orderBy: { date: "asc" },
        take: MAX_EXPORT_ROWS,
    });

    const csv = toCsv(
        ["Date", "Type", "Description", "Category", "Amount", "Notes"],
        rows.map((row) => [
            toDateInput(row.date),
            row.type,
            row.description,
            row.category.name,
            Number(row.amount).toFixed(2),
            row.notes ?? "",
        ]),
    );

    return csvResponse(csv, filename);
}
