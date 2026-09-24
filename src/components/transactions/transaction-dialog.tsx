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

export function TransactionDialog() {
const { open, editingId, prefill, source } = useUIStore(
(state) => state.transactionDialog
);
const close = useUIStore((state) => state.closeTransactionDialog);


return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
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
                        <span className="text-lg font-semibold">
                            {editingId ? "✎" : "+"}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <DialogTitle className="text-lg font-semibold tracking-tight">
                            {editingId
                                ? "Edit transaction"
                                : "Add transaction"}
                        </DialogTitle>

                        <DialogDescription className="mt-1 text-sm leading-relaxed">
                            {editingId
                                ? "Update the details of this transaction."
                                : "Log an expense or income, or let AI fill in the details for you."}
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-5">
                <TransactionForm
                    editingId={editingId}
                    prefill={prefill}
                    source={source}
                    onDone={close}
                />
            </div>
        </DialogContent>
    </Dialog>
);
}


