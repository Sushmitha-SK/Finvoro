"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
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
                            <Pencil className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <DialogTitle className="text-lg font-semibold tracking-tight">
                                Edit budget
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-sm leading-relaxed">
                                Update the monthly spending limit and details for this budget.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form Body */}
                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-5">
                    <AddBudgetForm
                        categories={categories}
                        budgetId={budget.id}
                        initialValues={initialValues}
                        onSuccess={handleSuccess}
                        onCancel={() => setOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}