import { NextResponse } from "next/server";
import { z } from "zod";

import { getUserId, unauthorized } from "@/lib/auth";
import { isSupportedCurrency } from "@/lib/currencies";
import { getUserPreferences } from "@/lib/data/preferences";
import { prisma } from "@/lib/prisma";

const patchSchema = z
    .object({
        currency: z
            .string()
            .transform((value) => value.toUpperCase())
            .refine(isSupportedCurrency, "Unsupported currency.")
            .optional(),
        aiEnabled: z.boolean().optional(),
    })
    .refine((value) => value.currency !== undefined || value.aiEnabled !== undefined, {
        message: "Nothing to update.",
    });

export async function GET() {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    return NextResponse.json(await getUserPreferences(userId));
}

export async function PATCH(request: Request) {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    const body = patchSchema.safeParse(await request.json().catch(() => null));

    if (!body.success) {
        return NextResponse.json(
            { error: body.error.issues[0]?.message ?? "Invalid request." },
            { status: 400 },
        );
    }

    try {
        const preference = await prisma.userPreference.upsert({
            where: { clerkUserId: userId },
            create: { clerkUserId: userId, ...body.data },
            update: body.data,
        });

        return NextResponse.json({
            currency: preference.currency,
            aiEnabled: preference.aiEnabled,
        });
    } catch (error) {
        console.error("Failed to update preferences:", error);

        return NextResponse.json({ error: "Unable to update preferences." }, { status: 500 });
    }
}
