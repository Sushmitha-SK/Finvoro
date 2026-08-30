"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { AddBudgetForm } from "./add-budget-form";

type Category = {
    id: string;
    name: string;
};

type AddBudgetDialogProps = {
    categories: Category[];
};

export function AddBudgetDialog({
    categories,
}: AddBudgetDialogProps) {
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
            <DialogTrigger render={<Button />}>
                <Plus />
                Add budget
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Add budget
                    </DialogTitle>

                    <DialogDescription>
                        Set a monthly spending limit for a category.
                    </DialogDescription>
                </DialogHeader>

                <AddBudgetForm
                    categories={categories}
                    onSuccess={handleSuccess}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}