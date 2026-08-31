import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();

        const categoryId = String(
            body.categoryId ?? "",
        );

        const amount = Number(body.amount);
        const month = Number(body.month);
        const year = Number(body.year);

        if (
            !categoryId ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            !Number.isInteger(month) ||
            month < 1 ||
            month > 12 ||
            !Number.isInteger(year) ||
            year < 2000
        ) {
            return NextResponse.json(
                {
                    error:
                        "Please provide valid budget details.",
                },
                { status: 400 },
            );
        }

        const category =
            await prisma.category.findFirst({
                where: {
                    id: categoryId,
                    clerkUserId: user.id,
                },
            });

        if (!category) {
            return NextResponse.json(
                {
                    error:
                        "Invalid category.",
                },
                { status: 400 },
            );
        }

        const existingBudget =
            await prisma.budget.findUnique({
                where: {
                    clerkUserId_categoryId_month_year: {
                        clerkUserId: user.id,
                        categoryId,
                        month,
                        year,
                    },
                },
            });

        if (existingBudget) {
            return NextResponse.json(
                {
                    error:
                        "A budget already exists for this category and month.",
                },
                { status: 409 },
            );
        }

        const budget = await prisma.budget.create({
            data: {
                clerkUserId: user.id,
                categoryId,
                amount,
                month,
                year,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(
            {
                id: budget.id,
                category: budget.category.name,
                amount: Number(budget.amount),
                month: budget.month,
                year: budget.year,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(
            "Failed to create budget:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to create budget. Please try again.",
            },
            { status: 500 },
        );
    }
}

export async function PUT(request: Request) {
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
        const categoryId = String(body.categoryId ?? "");
        const amount = Number(body.amount);
        const month = Number(body.month);
        const year = Number(body.year);

        if (
            !id ||
            !categoryId ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            !Number.isInteger(month) ||
            month < 1 ||
            month > 12 ||
            !Number.isInteger(year) ||
            year < 2000
        ) {
            return NextResponse.json(
                {
                    error:
                        "Please provide valid budget details.",
                },
                { status: 400 },
            );
        }

        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                clerkUserId: user.id,
            },
        });

        if (!category) {
            return NextResponse.json(
                {
                    error: "Invalid category.",
                },
                { status: 400 },
            );
        }

        const existingBudget =
            await prisma.budget.findUnique({
                where: {
                    id,
                },
            });

        if (
            !existingBudget ||
            existingBudget.clerkUserId !== user.id
        ) {
            return NextResponse.json(
                {
                    error: "Budget not found.",
                },
                { status: 404 },
            );
        }

        const duplicateBudget =
            await prisma.budget.findUnique({
                where: {
                    clerkUserId_categoryId_month_year: {
                        clerkUserId: user.id,
                        categoryId,
                        month,
                        year,
                    },
                },
            });

        if (
            duplicateBudget &&
            duplicateBudget.id !== id
        ) {
            return NextResponse.json(
                {
                    error:
                        "A budget already exists for this category and month.",
                },
                { status: 409 },
            );
        }

        const budget = await prisma.budget.update({
            where: {
                id,
            },
            data: {
                categoryId,
                amount,
                month,
                year,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json({
            id: budget.id,
            category: budget.category.name,
            categoryId: budget.categoryId,
            amount: Number(budget.amount),
            month: budget.month,
            year: budget.year,
        });
    } catch (error) {
        console.error(
            "Failed to update budget:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to update budget. Please try again.",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(request: Request) {
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
                { error: "Budget ID is required." },
                { status: 400 },
            );
        }

        const budget =
            await prisma.budget.findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    clerkUserId: true,
                },
            });

        if (
            !budget ||
            budget.clerkUserId !== user.id
        ) {
            return NextResponse.json(
                {
                    error: "Budget not found.",
                },
                { status: 404 },
            );
        }

        await prisma.budget.delete({
            where: {
                id: budget.id,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Failed to delete budget:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to delete budget. Please try again.",
            },
            { status: 500 },
        );
    }
}