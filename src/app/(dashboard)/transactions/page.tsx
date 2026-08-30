import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { TransactionsTable } from "@/components/transactions/transactions-table";

export default function TransactionsPage() {
    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Transactions
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Track and manage your income and expenses.
                        </p>
                    </div>

                    <AddTransactionDialog />
                </div>

                <TransactionsTable />
            </div>
        </div>
    );
}