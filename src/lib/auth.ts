import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function getUserId() {
    const { userId } = await auth();

    return userId;
}

export function unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
