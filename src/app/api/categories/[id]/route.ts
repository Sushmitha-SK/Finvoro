import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PUT(
    request: Request,
    context: RouteContext,
) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "Category ID is required." },
                { status: 400 },
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

        const category =
            await prisma.category.findFirst({
                where: {
                    id,
                    clerkUserId: user.id,
                },
                select: {
                    id: true,
                },
            });

        if (!category) {
            return NextResponse.json(
                {
                    error: "Category not found.",
                },
                { status: 404 },
            );
        }

        const existingCategory =
            await prisma.category.findFirst({
                where: {
                    clerkUserId: user.id,
                    name,
                    NOT: {
                        id,
                    },
                },
                select: {
                    id: true,
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

        const updatedCategory =
            await prisma.category.update({
                where: {
                    id,
                },
                data: {
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

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error(
            "Failed to update category:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to update category. Please try again.",
            },
            { status: 500 },
        );
    }
}


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    error: "Category ID is required.",
                },
                { status: 400 },
            );
        }

        const category =
            await prisma.category.findFirst({
                where: {
                    id,
                    clerkUserId: user.id,
                },
            });

        if (!category) {
            return NextResponse.json(
                {
                    error: "Category not found.",
                },
                { status: 404 },
            );
        }

        const transactionCount =
            await prisma.transaction.count({
                where: {
                    categoryId: id,
                    clerkUserId: user.id,
                },
            });

        const budgetCount =
            await prisma.budget.count({
                where: {
                    categoryId: id,
                    clerkUserId: user.id,
                },
            });

        if (transactionCount > 0 || budgetCount > 0) {
            return NextResponse.json(
                {
                    error:
                        "This category cannot be deleted because it is being used by transactions or budgets.",
                },
                { status: 409 },
            );
        }

        await prisma.category.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Failed to delete category:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to delete category. Please try again.",
            },
            { status: 500 },
        );
    }
}