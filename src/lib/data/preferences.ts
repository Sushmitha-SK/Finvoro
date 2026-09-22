import { DEFAULT_CURRENCY } from "@/lib/currencies";
import { prisma } from "@/lib/prisma";

export type UserPreferences = {
    currency: string;
    aiEnabled: boolean;
};

export async function getUserPreferences(
    clerkUserId: string,
): Promise<UserPreferences> {
    const preference = await prisma.userPreference.findUnique({
        where: { clerkUserId },
        select: { currency: true, aiEnabled: true },
    });

    return {
        currency: preference?.currency ?? DEFAULT_CURRENCY,
        aiEnabled: preference?.aiEnabled ?? true,
    };
}
