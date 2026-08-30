"use client";

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

export function AddTransactionDialog() {
    const handleSuccess = (
        data: TransactionFormValues,
    ) => {
        console.log("Transaction:", data);
    };

    return (
        <Dialog>
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
                    onCancel={() => { }}
                />
            </DialogContent>
        </Dialog>
    );
}