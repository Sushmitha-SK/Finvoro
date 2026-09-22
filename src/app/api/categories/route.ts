import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getCategoryOptions } from "@/lib/data/categories";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ categories: await getCategoryOptions(userId) });
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();

        const name = String(body.name ?? "").trim();
        const icon = body.icon
            ? String(body.icon).trim()
            : null;
        const color = body.color
            ? String(body.color).trim()
            : null;

        if (!name) {
            return NextResponse.json(
                {
                    error: "Category name is required.",
                },
                { status: 400 },
            );
        }

        if (name.length > 50) {
            return NextResponse.json(
                {
                    error:
                        "Category name must be 50 characters or less.",
                },
                { status: 400 },
            );
        }

        const existingCategory =
            await prisma.category.findUnique({
                where: {
                    clerkUserId_name: {
                        clerkUserId: userId,
                        name,
                    },
                },
            });

        if (existingCategory) {
            return NextResponse.json(
                {
                    error:
                        "A category with this name already exists.",
                },
                { status: 409 },
            );
        }

        const category = await prisma.category.create({
            data: {
                clerkUserId: userId,
                name,
                icon,
                color,
            },
            select: {
                id: true,
                name: true,
                icon: true,
                color: true,
            },
        });

        return NextResponse.json(category, {
            status: 201,
        });
    } catch (error) {
        console.error(
            "Failed to create category:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to create category. Please try again.",
            },
            { status: 500 },
        );
    }
}