"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
    AddBudgetForm,
    type BudgetInitialValues,
} from "./add-budget-form";

type Category = {
    id: string;
    name: string;
};

type EditBudgetDialogProps = {
    budget: {
        id: string;
        categoryId: string;
        amount: number;
        month: number;
        year: number;
    };
    categories: Category[];
};

export function EditBudgetDialog({
    budget,
    categories,
}: EditBudgetDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const initialValues: BudgetInitialValues = {
        categoryId: budget.categoryId,
        amount: String(budget.amount),
        month: String(budget.month),
        year: String(budget.year),
    };

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
                    <Button variant="outline" size="sm">
                        <Pencil className="size-4" />
                        Edit
                    </Button>
                }
            >

            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit budget
                    </DialogTitle>
                </DialogHeader>

                <AddBudgetForm
                    categories={categories}
                    budgetId={budget.id}
                    initialValues={initialValues}
                    onSuccess={handleSuccess}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}