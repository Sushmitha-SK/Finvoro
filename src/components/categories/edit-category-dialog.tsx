"use client";

import { useRouter } from "next/navigation";
import { Pencil, Tag } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { AddCategoryForm } from "./add-category-form";

type Category = {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
};

type EditCategoryDialogProps = {
    category: Category;
};

export function EditCategoryDialog({
    category,
}: EditCategoryDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
        router.refresh();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Edit ${category.name}`}
                    >
                        <Pencil />
                    </Button>
                }
            />

            <DialogContent
                className="
                    overflow-hidden
                    border-border/60
                    bg-background/95
                    p-0
                    shadow-2xl
                    backdrop-blur-xl
                    sm:max-w-lg
                "
            >
                {/* Header */}
                <DialogHeader className="border-b bg-muted/20 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div
                            className="
                                mt-0.5
                                flex size-10 shrink-0 items-center justify-center
                                rounded-xl
                                bg-primary/10
                                text-primary
                            "
                        >
                            <Tag className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <DialogTitle className="text-lg font-semibold tracking-tight">
                                Edit category
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-sm leading-relaxed">
                                Update the name, icon, or color of this category.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form Body */}
                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-5">
                    <AddCategoryForm
                        category={category}
                        onSuccess={handleSuccess}
                        onCancel={() => setOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}