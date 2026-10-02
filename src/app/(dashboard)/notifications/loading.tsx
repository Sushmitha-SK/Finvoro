import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Page header */}
                <div>
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="mt-3 h-4 w-80 max-w-full" />
                </div>

                {/* Filters + action */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-9 w-40 rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>

                {/* Notifications card */}
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
                    <div className="divide-y divide-border/60">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 px-4 py-4"
                            >
                                {/* Icon */}
                                <Skeleton className="size-9 shrink-0 rounded-full" />

                                {/* Content */}
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="size-2 rounded-full" />
                                    </div>

                                    <Skeleton className="h-4 w-3/4 max-w-md" />
                                    <Skeleton className="h-3 w-20" />
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 gap-1">
                                    <Skeleton className="size-8 rounded-md" />
                                    <Skeleton className="size-8 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}