import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-8xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-28" />
                        <Skeleton className="h-4 w-80 max-w-full" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-10 w-36 rounded-md" />
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-xs">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-8 w-36" />
                    </div>
                    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-xs">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-3.5 w-8" />
                        </div>

                        <Skeleton className="h-2.5 w-full rounded-full" />

                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-14" />
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm">
                    <div className="hidden border-b border-border/60 bg-muted/40 md:grid md:grid-cols-[1.1fr_1fr_1fr_1.5fr_1fr_auto]">
                        <div className="px-6 py-4">
                            <Skeleton className="h-4 w-20" />
                        </div>

                        <div className="px-4 py-4">
                            <Skeleton className="h-4 w-16" />
                        </div>

                        <div className="px-4 py-4">
                            <Skeleton className="h-4 w-24" />
                        </div>

                        <div className="px-4 py-4">
                            <Skeleton className="h-4 w-32" />
                        </div>

                        <div className="px-4 py-4">
                            <Skeleton className="h-4 w-24" />
                        </div>

                        <div className="px-6 py-4">
                            <Skeleton className="ml-auto h-4 w-16" />
                        </div>
                    </div>

                    <div className="divide-y divide-border/40">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="grid gap-4 px-4 py-5 md:grid-cols-[1.1fr_1fr_1fr_1.5fr_1fr_auto] md:items-center"
                            >
                                <div className="flex items-center gap-2.5 md:pl-2">
                                    <Skeleton className="size-1.5 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>

                                <Skeleton className="h-7 w-24 rounded-md" />

                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-20" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-8" />
                                    </div>

                                    <Skeleton className="h-1.5 w-full rounded-full" />
                                </div>

                                <Skeleton className="h-7 w-24 rounded-md" />

                                <div className="flex items-center justify-end gap-1">
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