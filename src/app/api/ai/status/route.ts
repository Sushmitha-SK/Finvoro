import { NextResponse } from "next/server";

import { getUserId, unauthorized } from "@/lib/auth";
import { getUserPreferences } from "@/lib/data/preferences";
import { aiEnv, isGeminiConfigured } from "@/lib/env";

export async function GET() {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    const preferences = await getUserPreferences(userId);

    return NextResponse.json({
        configured: isGeminiConfigured(),
        enabled: preferences.aiEnabled,
        model: aiEnv.model,
        fastModel: aiEnv.fastModel,
    });
}
