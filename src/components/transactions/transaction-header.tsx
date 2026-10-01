'use client'
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@base-ui/react'
import { Plus } from 'lucide-react';


export default function TransactionHeader() {
    const openDialog = useUIStore((state) => state.openTransactionDialog);
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                    Transactions
                </h2>
                <p className="font-sans py-2 text-sm text-muted-foreground">Search, filter, edit and export everything you&apos;ve logged.</p>
            </div>


            <div className="flex items-center gap-2">
                <Button
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs shadow-primary/10 transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 gap-1.5 h-10 cursor-pointer"
                    onClick={() => openDialog()}
                >
                    <Plus className="size-4 shrink-0" />
                    Add transaction
                </Button>
            </div>
        </div>
    )
}
