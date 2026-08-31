import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const supportedCurrencies = [
    "INR",
    "USD",
    "EUR",
    "GBP",
    "AED",
];

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const preference =
            await prisma.userPreference.findUnique({
                where: {
                    clerkUserId: user.id,
                },
            });

        return NextResponse.json({
            currency:
                preference?.currency ?? "INR",
        });
    } catch (error) {
        console.error(
            "Failed to fetch preferences:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to fetch preferences.",
            },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: Request,
) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const currency = String(
            body.currency ?? "",
        ).toUpperCase();

        if (
            !supportedCurrencies.includes(
                currency,
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        "Unsupported currency.",
                },
                { status: 400 },
            );
        }

        const preference =
            await prisma.userPreference.upsert({
                where: {
                    clerkUserId: user.id,
                },
                create: {
                    clerkUserId: user.id,
                    currency,
                },
                update: {
                    currency,
                },
            });

        return NextResponse.json({
            currency:
                preference.currency,
        });
    } catch (error) {
        console.error(
            "Failed to update preferences:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to update preferences.",
            },
            { status: 500 },
        );
    }
}