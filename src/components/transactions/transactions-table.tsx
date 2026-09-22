"use client";

import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Loader2, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { deleteTransactions } from "@/app/(dashboard)/transactions/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatShortDate, parseDateInput } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useMoney } from "@/stores/app-store";
import { useInsightsStore } from "@/stores/insights-store";
import { useSelectionStore } from "@/stores/selection-store";
import { useUIStore } from "@/stores/ui-store";

import { useUrlParams } from "./use-url-params";

export type TransactionRow = {
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    date: string;
    notes: string | null;
    category: string;
    categoryColor: string;
};

type Props = {
    rows: TransactionRow[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    sort: "date" | "amount" | "description";
    dir: "asc" | "desc";
    filtered: boolean;
};

function SortHeader({
    field,
    label,
    sort,
    dir,
    onSort,
    className,
}: {
    field: Props["sort"];
    label: string;
    sort: Props["sort"];
    dir: Props["dir"];
    onSort: (field: Props["sort"]) => void;
    className?: string;
}) {
    const active = sort === field;

    return (
        <TableHead className={className} aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}>
            <button
                type="button"
                onClick={() => onSort(field)}
                className={cn("inline-flex items-center gap-1 hover:text-foreground", active && "text-foreground")}
            >
                {label}
                {active && (dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
            </button>
        </TableHead>
    );
}

export function TransactionsTable({ rows, totalCount, currentPage, totalPages, pageSize, sort, dir, filtered }: Props) {
    const money = useMoney();
    const openDialog = useUIStore((state) => state.openTransactionDialog);
    const selected = useSelectionStore((state) => state.selected);
    const toggle = useSelectionStore((state) => state.toggle);
    const setMany = useSelectionStore((state) => state.setMany);
    const clearSelection = useSelectionStore((state) => state.clear);
    const { searchParams, update, pending } = useUrlParams();

    const [deleteIds, setDeleteIds] = useState<string[] | null>(null);
    const [deleting, setDeleting] = useState(false);

    // A new page / filter means a different set of rows - drop any selection.
    const paramsKey = searchParams.toString();

    useEffect(() => {
        clearSelection();
    }, [paramsKey, clearSelection]);

    const selectedIds = rows.filter((row) => selected[row.id]).map((row) => row.id);
    const allSelected = rows.length > 0 && selectedIds.length === rows.length;
    const someSelected = selectedIds.length > 0 && !allSelected;

    function onSort(field: Props["sort"]) {
        const nextDir = field === sort ? (dir === "asc" ? "desc" : "asc") : field === "description" ? "asc" : "desc";

        update({ sort: field === "date" && nextDir === "desc" ? null : field, dir: nextDir === "desc" ? null : nextDir });
    }

    async function confirmDelete() {
        if (!deleteIds) return;

        setDeleting(true);

        const result = await deleteTransactions(deleteIds);

        setDeleting(false);

        if (!result.ok) {
            toast.error(result.error);

            return;
        }

        toast.success(`Deleted ${result.data.count} transaction${result.data.count === 1 ? "" : "s"}`);
        useInsightsStore.getState().invalidateAll();
        clearSelection();
        setDeleteIds(null);
    }

    if (rows.length === 0) {
        return (
            <Card className="items-center gap-3 py-16 text-center">
                <p className="font-medium">{filtered ? "No transactions match your filters" : "No transactions yet"}</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                    {filtered ? "Try a different search or clear the filters." : "Add your first transaction to start tracking."}
                </p>
                {!filtered && (
                    <Button className="mt-1 gap-1.5" onClick={() => openDialog()}>
                        <Plus className="size-4" /> Add transaction
                    </Button>
                )}
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {selectedIds.length > 0 && (
                <div className="sticky top-20 z-20 flex items-center justify-between gap-3 rounded-xl border bg-popover px-4 py-2.5 shadow-md">
                    <p className="text-sm font-medium">{selectedIds.length} selected</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={clearSelection}>
                            Clear
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setDeleteIds(selectedIds)}>
                            <Trash2 className="size-3.5" /> Delete
                        </Button>
                    </div>
                </div>
            )}

            <Card className={cn("overflow-hidden p-0 transition-opacity", pending && "opacity-70")}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 pl-4">
                                <input
                                    type="checkbox"
                                    aria-label="Select all on this page"
                                    className="size-4 accent-primary"
                                    checked={allSelected}
                                    ref={(element) => {
                                        if (element) element.indeterminate = someSelected;
                                    }}
                                    onChange={(event) => setMany(rows.map((row) => row.id), event.target.checked)}
                                />
                            </TableHead>
                            <SortHeader field="description" label="Description" sort={sort} dir={dir} onSort={onSort} />
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <SortHeader field="date" label="Date" sort={sort} dir={dir} onSort={onSort} className="hidden sm:table-cell" />
                            <SortHeader field="amount" label="Amount" sort={sort} dir={dir} onSort={onSort} className="text-right" />
                            <TableHead className="w-10" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id} data-state={selected[row.id] ? "selected" : undefined}>
                                <TableCell className="pl-4">
                                    <input
                                        type="checkbox"
                                        aria-label={`Select ${row.description}`}
                                        className="size-4 accent-primary"
                                        checked={!!selected[row.id]}
                                        onChange={() => toggle(row.id)}
                                    />
                                </TableCell>
                                <TableCell className="max-w-[16rem]">
                                    <p className="truncate font-medium">{row.description}</p>
                                    <p className="truncate text-xs text-muted-foreground md:hidden">{row.category}</p>
                                    {row.notes && <p className="hidden truncate text-xs text-muted-foreground md:block">{row.notes}</p>}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                                        <span className="size-1.5 rounded-full" style={{ background: row.categoryColor }} />
                                        {row.category}
                                    </span>
                                </TableCell>
                                <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                                    {formatShortDate(parseDateInput(row.date))}
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        "whitespace-nowrap text-right font-semibold",
                                        row.type === "income" && "text-emerald-600 dark:text-emerald-400",
                                    )}
                                >
                                    {row.type === "income" ? "+" : "−"}
                                    {money(row.amount, { fractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="pr-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={<Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${row.description}`} />}
                                        >
                                            <MoreHorizontal className="size-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    openDialog({
                                                        editingId: row.id,
                                                        prefill: {
                                                            description: row.description,
                                                            amount: String(row.amount),
                                                            type: row.type,
                                                            category: row.category,
                                                            date: row.date,
                                                            notes: row.notes ?? "",
                                                        },
                                                    })
                                                }
                                            >
                                                <Pencil className="size-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem variant="destructive" onClick={() => setDeleteIds([row.id])}>
                                                <Trash2 className="size-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
                <div className="flex items-center gap-2">
                    <span>
                        {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString("en-IN")}
                    </span>
                    <select
                        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                        value={pageSize}
                        onChange={(event) => update({ pageSize: event.target.value === "10" ? null : event.target.value })}
                        aria-label="Rows per page"
                    >
                        {[10, 25, 50].map((size) => (
                            <option key={size} value={size}>
                                {size} / page
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => update({ page: currentPage - 1 === 1 ? null : String(currentPage - 1) })} className="gap-1">
                        <ChevronLeft className="size-4" /> Prev
                    </Button>
                    <span className="px-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => update({ page: String(currentPage + 1) })} className="gap-1">
                        Next <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>

            <AlertDialog open={deleteIds !== null} onOpenChange={(open) => !open && !deleting && setDeleteIds(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete {deleteIds?.length === 1 ? "this transaction" : `${deleteIds?.length} transactions`}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>This can&apos;t be undone. Budgets and reports will update immediately.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={deleting}
                            onClick={(event) => {
                                event.preventDefault();
                                void confirmDelete();
                            }}
                        >
                            {deleting && <Loader2 className="size-4 animate-spin" />} Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
