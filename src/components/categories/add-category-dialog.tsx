"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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

export function AddCategoryDialog() {
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
                    <Button>
                        <Plus />
                        Add category
                    </Button>
                }
            />

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Add category
                    </DialogTitle>

                    <DialogDescription>
                        Create a category to organize your
                        transactions.
                    </DialogDescription>
                </DialogHeader>

                <AddCategoryForm
                    onSuccess={handleSuccess}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}