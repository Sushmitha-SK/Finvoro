import { NextResponse } from "next/server";
import { z } from "zod";

import { getUserId, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const idBody = z.object({ id: z.string().min(1).max(100) });

export async function GET() {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    try {
        const [notifications, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: { clerkUserId: userId },
                orderBy: { createdAt: "desc" },
                take: 30,
            }),
            prisma.notification.count({ where: { clerkUserId: userId, read: false } }),
        ]);

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("Failed to fetch notifications:", error);

        return NextResponse.json({ error: "Unable to fetch notifications." }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    const body = idBody.safeParse(await request.json().catch(() => null));

    if (!body.success) {
        return NextResponse.json({ error: "Notification ID is required." }, { status: 400 });
    }

    const result = await prisma.notification.updateMany({
        where: { id: body.data.id, clerkUserId: userId },
        data: { read: true },
    });

    if (result.count === 0) {
        return NextResponse.json({ error: "Notification not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}

export async function PUT() {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    await prisma.notification.updateMany({
        where: { clerkUserId: userId, read: false },
        data: { read: true },
    });

    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
    const userId = await getUserId();

    if (!userId) return unauthorized();

    const body = idBody.safeParse(await request.json().catch(() => null));

    if (!body.success) {
        return NextResponse.json({ error: "Notification ID is required." }, { status: 400 });
    }

    const result = await prisma.notification.deleteMany({
        where: { id: body.data.id, clerkUserId: userId },
    });

    if (result.count === 0) {
        return NextResponse.json({ error: "Notification not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
