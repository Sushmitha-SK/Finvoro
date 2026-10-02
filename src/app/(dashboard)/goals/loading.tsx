import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-4 w-80 max-w-full" />
                </div>

                <Skeleton className="h-10 w-28 rounded-md" />
            </div>

            {/* Goals table */}
            <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
                {/* Table header */}
                <div className="hidden border-b bg-muted/50 md:grid md:grid-cols-[1.2fr_1.4fr_1fr_auto]">
                    <div className="px-4 py-3.5">
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="px-4 py-3.5">
                        <Skeleton className="h-4 w-36" />
                    </div>
                    <div className="px-4 py-3.5">
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="px-4 py-3.5">
                        <Skeleton className="ml-auto h-4 w-16" />
                    </div>
                </div>

                {/* Skeleton rows */}
                <div className="divide-y">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="grid gap-4 px-4 py-5 md:grid-cols-[1.2fr_1.4fr_1fr_auto] md:items-center"
                        >
                            {/* Goal details */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-3 shrink-0 rounded-full" />

                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-8" />
                                </div>

                                <Skeleton className="h-2.5 w-full rounded-full" />
                            </div>

                            {/* Status / needed */}
                            <Skeleton className="h-7 w-28 rounded-full" />

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2">
                                <Skeleton className="h-8 w-24 rounded-md" />
                                <Skeleton className="size-8 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}