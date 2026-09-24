"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { getUserPreferences } from "@/lib/data/preferences";
import { clearAllUserData, seedSampleData } from "@/lib/data/seed";

import type { ActionResult } from "./transactions/actions";

export async function loadSampleData(): Promise<ActionResult<{ transactions: number }>> {
    const { userId } = await auth();

    if (!userId) return { ok: false, error: "You need to sign in again." };

    const { currency } = await getUserPreferences(userId);
    const result = await seedSampleData(userId, currency);

    if (!result.seeded) return { ok: false, error: result.reason };

    revalidatePath("/", "layout");

    return { ok: true, data: { transactions: result.transactions } };
}

export async function clearAllData(confirmation: string): Promise<ActionResult> {
    const { userId } = await auth();

    if (!userId) return { ok: false, error: "You need to sign in again." };

    if (confirmation !== "DELETE") {
        return { ok: false, error: "Type DELETE to confirm." };
    }

    await clearAllUserData(userId);
    revalidatePath("/", "layout");

    return { ok: true };
}
