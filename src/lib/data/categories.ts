import { colorForName } from "@/lib/colors";
import { prisma } from "@/lib/prisma";

export type CategoryOption = {
    id: string;
    name: string;
    icon: string | null;
    color: string;
};

export async function getCategoryOptions(
    clerkUserId: string,
): Promise<CategoryOption[]> {
    const categories = await prisma.category.findMany({
        where: { clerkUserId },
        orderBy: { name: "asc" },
        select: { id: true, name: true, icon: true, color: true },
    });

    return categories.map((category) => ({
        ...category,
        color: category.color ?? colorForName(category.name),
    }));
}

/** Find a category by name (case-insensitive) or create it. */
export async function findOrCreateCategory(
    clerkUserId: string,
    rawName: string,
) {
    const name = rawName.trim();

    const existing = await prisma.category.findFirst({
        where: {
            clerkUserId,
            name: { equals: name, mode: "insensitive" },
        },
    });

    if (existing) {
        return existing;
    }

    return prisma.category.create({
        data: { clerkUserId, name, color: colorForName(name) },
    });
}
