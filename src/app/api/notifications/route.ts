import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const notifications =
            await prisma.notification.findMany({
                where: {
                    clerkUserId: user.id,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 20,
            });

        const unreadCount =
            await prisma.notification.count({
                where: {
                    clerkUserId: user.id,
                    read: false,
                },
            });

        return NextResponse.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error(
            "Failed to fetch notifications:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to fetch notifications.",
            },
            { status: 500 },
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const id = String(body.id ?? "");

        if (!id) {
            return NextResponse.json(
                {
                    error:
                        "Notification ID is required.",
                },
                { status: 400 },
            );
        }

        const notification =
            await prisma.notification.findFirst({
                where: {
                    id,
                    clerkUserId: user.id,
                },
            });

        if (!notification) {
            return NextResponse.json(
                {
                    error:
                        "Notification not found.",
                },
                { status: 404 },
            );
        }

        const updatedNotification =
            await prisma.notification.update({
                where: {
                    id: notification.id,
                },
                data: {
                    read: true,
                },
            });

        return NextResponse.json({
            notification: updatedNotification,
        });
    } catch (error) {
        console.error(
            "Failed to mark notification as read:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to update notification.",
            },
            { status: 500 },
        );
    }
}

export async function PUT() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        await prisma.notification.updateMany({
            where: {
                clerkUserId: user.id,
                read: false,
            },
            data: {
                read: true,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Failed to mark notifications as read:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to update notifications.",
            },
            { status: 500 },
        );
    }
}