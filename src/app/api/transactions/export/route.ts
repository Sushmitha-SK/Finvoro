import { getUserId, unauthorized } from "@/lib/auth";
import { transactionsCsvResponse } from "@/lib/data/transaction-export";

/** Exports exactly what the transactions table is currently filtered to. */
export async function GET(request: Request) {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    const params = new URL(request.url).searchParams;
    const stamp = new Date().toISOString().slice(0, 10);

    return transactionsCsvResponse(
        userId,
        {
            search: params.get("search") ?? undefined,
            type: params.get("type") ?? undefined,
            category: params.get("category") ?? undefined,
            from: params.get("from") ?? undefined,
            to: params.get("to") ?? undefined,
        },
        `finvoro-transactions-${stamp}.csv`,
    );
}
