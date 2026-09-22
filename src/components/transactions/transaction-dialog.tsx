"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useUIStore } from "@/stores/ui-store";

import { TransactionForm } from "./transaction-form";

/** Single, app-wide dialog. Open it from anywhere via useUIStore().openTransactionDialog(). */
export function TransactionDialog() {
    const { open, editingId, prefill, source } = useUIStore((state) => state.transactionDialog);
    const close = useUIStore((state) => state.closeTransactionDialog);

    return (
        <Dialog open={open} onOpenChange={(next) => !next && close()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingId ? "Edit transaction" : "Add transaction"}</DialogTitle>
                    <DialogDescription>
                        {editingId
                            ? "Update the details below."
                            : "Log an expense or income. Press Enter in the AI box to auto-fill."}
                    </DialogDescription>
                </DialogHeader>

                <TransactionForm
                    editingId={editingId}
                    prefill={prefill}
                    source={source}
                    onDone={close}
                />
            </DialogContent>
        </Dialog>
    );
}
