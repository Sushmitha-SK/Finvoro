import { FolderOpen } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AddCategoryDialog } from "./add-category-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";

type Category = {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
};

type CategoriesOverviewProps = {
    categories: Category[];
};

export function CategoriesOverview({
    categories,
}: CategoriesOverviewProps) {
    if (categories.length === 0) {
        return (
            <Card>
                <CardContent className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                        <FolderOpen className="size-5 text-primary" />
                    </div>

                    <h2 className="mt-4 font-semibold">
                        No categories yet
                    </h2>

                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        Create your first category to start organizing
                        your transactions.
                    </p>

                    <div className="mt-4">
                        <AddCategoryDialog />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        Your categories
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        {categories.length}{" "}
                        {categories.length === 1
                            ? "category"
                            : "categories"}
                    </p>
                </div>

                <AddCategoryDialog />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => (
                    <Card
                        key={category.id}
                        className="transition-shadow hover:shadow-md"
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div
                                        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent"
                                        style={
                                            category.color
                                                ? {
                                                    backgroundColor: `${category.color}20`,
                                                    color: category.color,
                                                }
                                                : undefined
                                        }
                                    >
                                        {category.icon ? (
                                            <span className="text-lg">
                                                {category.icon}
                                            </span>
                                        ) : (
                                            <FolderOpen className="size-5 text-primary" />
                                        )}
                                    </div>

                                    <CardTitle className="truncate text-base">
                                        {category.name}
                                    </CardTitle>
                                </div>

                                <div className="flex shrink-0 items-center gap-1">
                                    <EditCategoryDialog
                                        category={category}
                                    />

                                    <DeleteCategoryDialog
                                        categoryId={category.id}
                                        categoryName={category.name}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}