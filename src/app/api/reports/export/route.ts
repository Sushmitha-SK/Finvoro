import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function parseDate(value: string | null) {
    if (!value) {
        return null;
    }

    const date = new Date(`${value}T00:00:00`);

    return Number.isNaN(date.getTime())
        ? null
        : date;
}

function escapeCsvValue(
    value: string | number,
) {
    const stringValue = String(value);

    if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
    ) {
        return `"${stringValue.replace(
            /"/g,
            '""',
        )}"`;
    }

    return stringValue;
}

export async function GET(
    request: Request,
) {
    const user = await currentUser();

    if (!user) {
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            {
                status: 401,
            },
        );
    }

    const { searchParams } =
        new URL(request.url);

    const from = parseDate(
        searchParams.get("from"),
    );

    const toValue = parseDate(
        searchParams.get("to"),
    );

    if (!from || !toValue) {
        return NextResponse.json(
            {
                error:
                    "A valid date range is required.",
            },
            {
                status: 400,
            },
        );
    }

    if (from > toValue) {
        return NextResponse.json(
            {
                error:
                    "The start date must be before the end date.",
            },
            {
                status: 400,
            },
        );
    }

    const to = new Date(
        toValue.getFullYear(),
        toValue.getMonth(),
        toValue.getDate() + 1,
    );

    const transactions =
        await prisma.transaction.findMany({
            where: {
                clerkUserId: user.id,
                date: {
                    gte: from,
                    lt: to,
                },
            },
            select: {
                date: true,
                type: true,
                description: true,
                amount: true,
                notes: true,
                category: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                date: "asc",
            },
        });

    const headers = [
        "Date",
        "Type",
        "Description",
        "Category",
        "Amount",
        "Notes",
    ];

    const rows = transactions.map(
        (transaction) => [
            transaction.date
                .toISOString()
                .slice(0, 10),
            transaction.type,
            transaction.description,
            transaction.category.name,
            Number(transaction.amount).toFixed(2),
            transaction.notes ?? "",
        ],
    );

    const csv = [
        headers,
        ...rows,
    ]
        .map((row) =>
            row
                .map(escapeCsvValue)
                .join(","),
        )
        .join("\n");

    const filename = `finvoro-report-${from
        .toISOString()
        .slice(0, 10)}-to-${toValue
            .toISOString()
            .slice(0, 10)}.csv`;

    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type":
                "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control":
                "no-store",
        },
    });
}