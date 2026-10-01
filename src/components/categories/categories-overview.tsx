import { FolderOpen, Tag } from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xs">
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
                    <h2 className="font-heading text-2xl font-semibold tracking-tight">
                        Your categories
                    </h2>
                    <p className="font-sans py-2 text-sm text-muted-foreground">
                        Manage and customize your expense tracking categories.
                    </p>
                </div>

                <AddCategoryDialog />
            </div>

            <Card className="surface-card overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-border/60 bg-muted/30 text-xs font-medium text-muted-foreground">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="py-3.5 pl-6 pr-4">Category Name</TableHead>
                                <TableHead className="px-4 py-3.5">Color Tag</TableHead>
                                <TableHead className="px-4 py-3.5">Type</TableHead>
                                <TableHead className="py-3.5 pl-4 pr-6 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border/60">
                            {categories.map((category) => {
                                const colorIndicator = category.color ?? "var(--primary)";

                                return (
                                    <TableRow
                                        key={category.id}
                                        className="transition-colors hover:bg-muted/30 group"
                                    >
                                        {/* Category Name & Custom Icon/Dot */}
                                        <TableCell className="py-3.5 pl-6 pr-4 font-medium text-foreground">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-3 shrink-0 rounded-full shadow-2xs"
                                                    style={{ backgroundColor: colorIndicator }}
                                                />
                                                <span className="truncate">{category.name}</span>
                                            </div>
                                        </TableCell>

                                        {/* Color Hex / Status */}
                                        <TableCell className="px-4 py-3.5 text-muted-foreground text-xs font-mono">
                                            {category.color ?? "Default"}
                                        </TableCell>

                                        {/* Type */}
                                        <TableCell className="px-4 py-3.5">
                                            <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground font-medium">
                                                <Tag className="size-3" />
                                                Custom
                                            </span>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="py-3.5 pl-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <EditCategoryDialog category={category} />
                                                <DeleteCategoryDialog
                                                    categoryId={category.id}
                                                    categoryName={category.name}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}