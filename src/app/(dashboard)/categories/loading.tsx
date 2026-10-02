import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-80 max-w-full" />
                    </div>

                    <Skeleton className="h-10 w-32 rounded-md" />
                </div>

                {/* Categories table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
                    <div className="w-full overflow-x-auto">
                        {/* Table header */}
                        <div className="hidden grid-cols-[1.5fr_1fr_1fr_auto] border-b border-border/60 bg-muted/30 sm:grid">
                            <div className="px-6 py-3.5">
                                <Skeleton className="h-3.5 w-28" />
                            </div>

                            <div className="px-4 py-3.5">
                                <Skeleton className="h-3.5 w-20" />
                            </div>

                            <div className="px-4 py-3.5">
                                <Skeleton className="h-3.5 w-12" />
                            </div>

                            <div className="px-6 py-3.5">
                                <Skeleton className="ml-auto h-3.5 w-16" />
                            </div>
                        </div>

                        {/* Skeleton rows */}
                        <div className="divide-y divide-border/60">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="grid gap-4 px-4 py-4 sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-center"
                                >
                                    {/* Category name */}
                                    <div className="flex items-center gap-3 sm:pl-2">
                                        <Skeleton className="size-3 shrink-0 rounded-full" />
                                        <Skeleton
                                            className="h-4"
                                            style={{
                                                width: `${80 + (index % 3) * 24}px`,
                                            }}
                                        />
                                    </div>

                                    {/* Color */}
                                    <Skeleton className="h-4 w-16 rounded-sm" />

                                    {/* Type */}
                                    <Skeleton className="h-6 w-20 rounded-md" />

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-1 sm:pr-2">
                                        <Skeleton className="size-8 rounded-md" />
                                        <Skeleton className="size-8 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}