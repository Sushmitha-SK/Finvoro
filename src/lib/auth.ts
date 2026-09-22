import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Local session check. Unlike `currentUser()` this never calls Clerk's
 * backend API, so it costs nothing per request.
 */
export async function getUserId() {
    const { userId } = await auth();

    return userId;
}

export function unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
