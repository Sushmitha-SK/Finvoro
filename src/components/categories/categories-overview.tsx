import { FolderOpen } from "lucide-react";

import {
    Card,
    CardContent,
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
            <Card className="border-dashed border-border/60 bg-muted/20 shadow-none">
                <CardContent className="flex min-h-72 flex-col items-center justify-center px-4 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                        <FolderOpen className="size-6" />
                    </div>

                    <h2 className="mt-4 text-base font-semibold tracking-tight">
                        No categories yet
                    </h2>

                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                        Create your first category to start organizing your transactions seamlessly.
                    </p>

                    <div className="mt-6">
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
                    <h2 className="text-xl font-semibold tracking-tight">
                        Your categories
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {categories.length}{" "}
                        {categories.length === 1 ? "category" : "categories"} configured
                    </p>
                </div>

                <AddCategoryDialog />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="group relative flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-sm"
                    >
                        <div className="flex min-w-0 items-center gap-3.5">
                            <div
                                className="flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
                                style={
                                    category.color
                                        ? {
                                              backgroundColor: `${category.color}15`,
                                              color: category.color,
                                          }
                                        : {
                                              backgroundColor: "hsl(var(--muted))",
                                              color: "hsl(var(--muted-foreground))",
                                          }
                                }
                            >
                                {category.icon ? (
                                    <span className="text-xl leading-none">
                                        {category.icon}
                                    </span>
                                ) : (
                                    <FolderOpen className="size-5" />
                                )}
                            </div>

                            <div className="min-w-0">
                                <h3 className="truncate text-sm font-medium tracking-tight text-foreground">
                                    {category.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">Custom category</p>
                            </div>
                        </div>

                        {/* Actions smoothly fade in or sit quietly on the right */}
                        <div className="flex shrink-0 items-center gap-0.5 opacity-80 transition-opacity group-hover:opacity-100">
                            <EditCategoryDialog category={category} />
                            <DeleteCategoryDialog
                                categoryId={category.id}
                                categoryName={category.name}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}