"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
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
                        size="icon-sm"
                        aria-label={`Edit ${category.name}`}
                    >
                        <Pencil />
                    </Button>
                }
            />

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit category
                    </DialogTitle>

                    <DialogDescription>
                        Update the name, icon, or color of this
                        category.
                    </DialogDescription>
                </DialogHeader>

                <AddCategoryForm
                    category={category}
                    onSuccess={handleSuccess}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}