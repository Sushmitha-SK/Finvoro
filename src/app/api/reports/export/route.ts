import { NextResponse } from "next/server";

import { getUserId, unauthorized } from "@/lib/auth";
import { isValidDateInput } from "@/lib/dates";
import { transactionsCsvResponse } from "@/lib/data/transaction-export";

export async function GET(request: Request) {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!isValidDateInput(from) || !isValidDateInput(to)) {
        return NextResponse.json({ error: "A valid date range is required." }, { status: 400 });
    }

    if (from > to) {
        return NextResponse.json(
            { error: "The start date must be before the end date." },
            { status: 400 },
        );
    }

    return transactionsCsvResponse(userId, { from, to }, `finvoro-report-${from}-to-${to}.csv`);
}
