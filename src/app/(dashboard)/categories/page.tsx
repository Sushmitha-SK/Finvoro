import { getUserId } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";
import { CategoriesOverview } from "@/components/categories/categories-overview";

export default async function CategoriesPage() {
    noStore();

    const userId = await getUserId();

    if (!userId) {
        return null;
    }

    const categories = await prisma.category.findMany({
        where: {
            clerkUserId: userId,
        },
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            icon: true,
            color: true,
        },
    });

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Categories
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Organize your income and expenses with custom
                        categories.
                    </p>
                </div>

                <CategoriesOverview categories={categories} />
            </div>
        </div>
    );
}