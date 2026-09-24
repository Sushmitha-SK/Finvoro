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
        <TableHead className={cn("h-11 text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)} aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}>
            <button
                type="button"
                onClick={() => onSort(field)}
                className={cn(
                    "group inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
                    active ? "text-foreground font-bold" : "text-muted-foreground"
                )}
            >
                {label}
                <span className={cn("transition-transform rounded p-0.5", active && "bg-background shadow-2xs text-primary")}>
                    {active ? (
                        dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                    ) : (
                        <ArrowUpDownIcon className="size-3 opacity-0 group-hover:opacity-50" />
                    )}
                </span>
            </button>
        </TableHead>
    );
}

function ArrowUpDownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
        </svg>
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
            <Card className="flex flex-col items-center justify-center gap-3 border-dashed py-20 text-center shadow-none">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                    <Plus className="size-5" />
                </div>
                <div className="space-y-1">
                    <p className="font-medium">{filtered ? "No transactions match your filters" : "No transactions yet"}</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        {filtered ? "Try adjusting your search criteria or clearing filters." : "Add your first transaction to start tracking your finances."}
                    </p>
                </div>
                {!filtered && (
                    <Button className="mt-2 gap-1.5 shadow-sm" onClick={() => openDialog()}>
                        <Plus className="size-4" /> Add transaction
                    </Button>
                )}
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {/* Floating Selection Banner */}
            {selectedIds.length > 0 && (
                <div className="sticky top-20 z-20 flex items-center justify-between gap-3 rounded-xl border bg-popover/90 px-4 py-2.5 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                        <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {selectedIds.length}
                        </span>
                        <p className="text-sm font-medium">transactions selected</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={clearSelection} className="h-8 text-xs">
                            Clear selection
                        </Button>
                        <Button variant="destructive" size="sm" className="h-8 gap-1.5 text-xs shadow-sm" onClick={() => setDeleteIds(selectedIds)}>
                            <Trash2 className="size-3.5" /> Delete selected
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Table Card */}
            <Card className={cn("overflow-hidden p-0 shadow-sm transition-opacity duration-200", pending && "opacity-60")}>
                <Table>
                    <TableHeader className="bg-muted/60 border-b">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-12 pl-4 h-11">
                                <input
                                    type="checkbox"
                                    aria-label="Select all on this page"
                                    className="size-4 rounded accent-primary cursor-pointer"
                                    checked={allSelected}
                                    ref={(element) => {
                                        if (element) element.indeterminate = someSelected;
                                    }}
                                    onChange={(event) => setMany(rows.map((row) => row.id), event.target.checked)}
                                />
                            </TableHead>
                            <SortHeader field="description" label="Description" sort={sort} dir={dir} onSort={onSort} />
                            <TableHead className="hidden h-11 text-xs font-semibold uppercase tracking-wider md:table-cell text-muted-foreground">Category</TableHead>
                            <SortHeader field="date" label="Date" sort={sort} dir={dir} onSort={onSort} className="hidden sm:table-cell" />
                            <SortHeader field="amount" label="Amount" sort={sort} dir={dir} onSort={onSort} className="text-right" />
                            <TableHead className="w-12 pr-4 h-11" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.map((row) => (
                            <TableRow 
                                key={row.id} 
                                data-state={selected[row.id] ? "selected" : undefined}
                                className="group transition-colors hover:bg-muted/40"
                            >
                                <TableCell className="pl-4">
                                    <input
                                        type="checkbox"
                                        aria-label={`Select ${row.description}`}
                                        className="size-4 rounded accent-primary cursor-pointer"
                                        checked={!!selected[row.id]}
                                        onChange={() => toggle(row.id)}
                                    />
                                </TableCell>
                                <TableCell className="max-w-[16rem]">
                                    <p className="truncate font-medium text-foreground">{row.description}</p>
                                    <p className="truncate text-xs text-muted-foreground md:hidden">{row.category}</p>
                                    {row.notes && <p className="hidden truncate text-xs text-muted-foreground/80 md:block">{row.notes}</p>}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium shadow-2xs">
                                        <span className="size-2 rounded-full shrink-0" style={{ background: row.categoryColor }} />
                                        {row.category}
                                    </span>
                                </TableCell>
                                <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell text-xs font-medium">
                                    {formatShortDate(parseDateInput(row.date))}
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        "whitespace-nowrap text-right font-semibold",
                                        row.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                                    )}
                                >
                                    {row.type === "income" ? "+" : "−"}
                                    {money(row.amount, { fractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="pr-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={<Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" aria-label={`Actions for ${row.description}`} />}
                                        >
                                            <MoreHorizontal className="size-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-36">
                                            <DropdownMenuItem
                                                className="gap-2 cursor-pointer"
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
                                                <Pencil className="size-3.5 text-muted-foreground" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                                onClick={() => setDeleteIds([row.id])}
                                            >
                                                <Trash2 className="size-3.5" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination & Footer Counts */}
            <div className="flex flex-col items-center justify-between gap-3 px-1 text-sm text-muted-foreground sm:flex-row">
                <div className="flex items-center gap-3">
                    <span className="text-xs">
                        Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="font-medium text-foreground">{totalCount.toLocaleString("en-IN")}</span>
                    </span>
                    <select
                        className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-medium shadow-2xs transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

                <div className="flex items-center gap-1.5">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage <= 1} 
                        onClick={() => update({ page: currentPage - 1 === 1 ? null : String(currentPage - 1) })} 
                        className="h-8 gap-1 text-xs shadow-2xs"
                    >
                        <ChevronLeft className="size-3.5" /> Prev
                    </Button>
                    <span className="px-2 text-xs font-medium text-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage >= totalPages} 
                        onClick={() => update({ page: String(currentPage + 1) })} 
                        className="h-8 gap-1 text-xs shadow-2xs"
                    >
                        Next <ChevronRight className="size-3.5" />
                    </Button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteIds !== null} onOpenChange={(open) => !open && !deleting && setDeleteIds(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete {deleteIds?.length === 1 ? "this transaction" : `${deleteIds?.length} transactions`}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Your budgets and reports will update immediately.
                        </AlertDialogDescription>
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