"use client";

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

import { AddTransactionForm } from "./add-transaction-form";
import type { TransactionFormValues } from "./transaction-schema";

import { createTransaction } from "@/app/(dashboard)/transactions/actions";

export function AddTransactionDialog() {
    const [open, setOpen] = useState(false);

    const handleSuccess = async (
        data: TransactionFormValues,
    ) => {
        await createTransaction(data);
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger render={<Button />}>
                <Plus />
                Add transaction
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Add transaction
                    </DialogTitle>

                    <DialogDescription>
                        Add an income or expense to your
                        financial records.
                    </DialogDescription>
                </DialogHeader>

                <AddTransactionForm
                    onSuccess={handleSuccess}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}