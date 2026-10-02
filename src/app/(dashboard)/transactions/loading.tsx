import { Skeleton } from "@/components/ui/skeleton";

function HeaderSkeleton() {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            <Skeleton className="h-10 w-40 rounded-md" />
        </div>
    );
}

function SummaryCardSkeleton() {
    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-xs">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="size-7 rounded-md" />
                </div>

                <div className="mt-2">
                    <Skeleton className="h-7 w-32" />
                </div>
            </div>
        </div>
    );
}

function ToolbarSkeleton() {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-card/40 p-4">
            {/* Top row */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <Skeleton className="h-9 w-full lg:max-w-md" />

                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-52 rounded-lg" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                </div>
            </div>

            {/* Bottom row */}
            <div className="flex flex-wrap items-center gap-2 border-t border-border/30 pt-3">
                <Skeleton className="h-3.5 w-3.5 rounded" />
                <Skeleton className="h-8 w-40 rounded-lg" />

                <div className="ml-auto flex items-center gap-2">
                    <Skeleton className="h-8 w-36 rounded-md" />
                    <Skeleton className="h-3 w-4" />
                    <Skeleton className="h-8 w-36 rounded-md" />
                </div>
            </div>
        </div>
    );
}

function TableRowSkeleton() {
    return (
        <div className="flex min-h-14 items-center gap-4 border-b px-4 last:border-b-0">
            {/* Checkbox */}
            <Skeleton className="size-4 shrink-0 rounded" />

            {/* Description */}
            <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40 max-w-[70%]" />
                <Skeleton className="h-3 w-24 md:hidden" />
                <Skeleton className="hidden h-3 w-32 md:block" />
            </div>

            {/* Category */}
            <Skeleton className="hidden h-6 w-28 rounded-full md:block" />

            {/* Date */}
            <Skeleton className="hidden h-4 w-24 sm:block" />

            {/* Amount */}
            <Skeleton className="h-4 w-24" />

            {/* Actions */}
            <Skeleton className="size-8 rounded-md" />
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
            {/* Table header */}
            <div className="flex h-11 items-center gap-4 border-b bg-muted/60 px-4">
                <Skeleton className="size-4 shrink-0 rounded" />
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="hidden h-3.5 w-20 md:block" />
                <Skeleton className="hidden h-3.5 w-16 sm:block" />
                <Skeleton className="ml-auto h-3.5 w-16" />
                <Skeleton className="size-4" />
            </div>

            {/* Rows */}
            <div>
                {Array.from({ length: 8 }).map((_, index) => (
                    <TableRowSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}

function PaginationSkeleton() {
    return (
        <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
            <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>

            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20 rounded-md" />
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
            {/* Page header */}
            <HeaderSkeleton />

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <SummaryCardSkeleton key={index} />
                ))}
            </div>

            {/* Filters / toolbar */}
            <ToolbarSkeleton />

            {/* Transactions table */}
            <TableSkeleton />

            {/* Pagination */}
            <PaginationSkeleton />
        </div>
    );
}
