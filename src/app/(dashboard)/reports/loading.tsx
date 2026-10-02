import { Skeleton } from "@/components/ui/skeleton";

function SummaryCardSkeleton() {
    return (
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="size-9 rounded-full" />
            </div>

            <div className="mt-5 space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-28" />
            </div>
        </div>
    );
}

function InsightsCardSkeleton() {
    return (
        <div className="rounded-xl border border-border/60 bg-card shadow-xs">
            <div className="flex items-center justify-between p-6 pb-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-5 w-16 rounded-md" />
                    </div>

                    <Skeleton className="h-3 w-48" />
                </div>

                <Skeleton className="size-8 rounded-lg" />
            </div>

            <div className="space-y-3.5 p-6 pt-0">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex gap-3.5 rounded-xl border border-border/40 bg-muted/20 p-4"
                    >
                        <Skeleton className="size-9 shrink-0 rounded-lg" />

                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FinancialHealthSkeleton() {
    return (
        <div className="rounded-xl border border-border/60 bg-card shadow-xs">
            <div className="flex items-center gap-3 p-6 pb-2">
                <Skeleton className="size-9 rounded-xl" />
                <Skeleton className="h-5 w-44" />
            </div>

            <div className="p-6">
                <div className="grid items-center gap-6 lg:grid-cols-12 py-2">
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-muted/20 p-4 lg:col-span-4">
                        <Skeleton className="size-36 rounded-full" />
                    </div>

                    <div className="flex flex-col justify-center space-y-4 lg:col-span-8">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-full max-w-md" />
                            <Skeleton className="h-3 w-72 max-w-full" />
                        </div>

                        <div className="space-y-3 pt-1">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-2.5"
                                >
                                    <Skeleton className="mt-1.5 size-2 shrink-0 rounded-full" />
                                    <Skeleton className="h-4 w-full max-w-lg" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/40 pt-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TransactionInsightsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, cardIndex) => (
                    <div
                        key={cardIndex}
                        className="rounded-xl border border-border/60 bg-card shadow-xs"
                    >
                        <div className="p-6">
                            <Skeleton className="h-5 w-40" />
                        </div>

                        <div className="divide-y divide-border/60">
                            {Array.from({ length: 4 }).map((_, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className="flex items-center justify-between px-6 py-4"
                                >
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>

                                    <div className="space-y-2 text-right">
                                        <Skeleton className="ml-auto h-4 w-20" />
                                        <Skeleton className="ml-auto h-3 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SpendingByCategorySkeleton() {
    return (
        <div className="rounded-xl border border-border/60 bg-card shadow-xs">
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-72 max-w-full" />
                    </div>

                    <div className="hidden space-y-2 sm:block">
                        <Skeleton className="ml-auto h-3 w-24" />
                        <Skeleton className="ml-auto h-4 w-20" />
                    </div>
                </div>
            </div>

            <div className="overflow-hidden">
                <div className="border-y border-border/60 bg-muted/30 px-6 py-2.5">
                    <div className="grid grid-cols-[1fr_1fr_100px] gap-4">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="ml-auto h-3 w-12" />
                    </div>
                </div>

                <div className="divide-y divide-border/60">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr_1fr_100px] items-center gap-4 px-6 py-3.5"
                        >
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-3 shrink-0 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>

                            <div className="flex items-center gap-3">
                                <Skeleton className="h-2 w-full max-w-30 rounded-full" />
                                <Skeleton className="h-3 w-8" />
                            </div>

                            <Skeleton className="ml-auto h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ReportsLoading() {
    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-28" />
                        <Skeleton className="h-4 w-80 max-w-full" />
                    </div>

                    <Skeleton className="h-9 w-28 rounded-lg" />
                </div>

                {/* Date filter */}
                <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-8 w-20 rounded-md"
                                />
                            ))}
                        </div>

                        <Skeleton className="h-7 w-36 rounded-full" />
                    </div>
                </div>

                {/* Selected date range */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-5" />
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <SummaryCardSkeleton key={index} />
                    ))}
                </div>

                {/* AI analysis */}
                <InsightsCardSkeleton />

                {/* Smart insights + Financial trend */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <FinancialHealthSkeleton />

                    <div className="rounded-xl border border-border/60 bg-card shadow-xs">
                        <div className="p-6 pb-4">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-36" />
                                <Skeleton className="h-4 w-64 max-w-full" />
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            <Skeleton className="h-64 w-full rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Transaction insights */}
                <TransactionInsightsSkeleton />

                {/* Spending by category */}
                <SpendingByCategorySkeleton />
            </div>
        </div>
    );
}
