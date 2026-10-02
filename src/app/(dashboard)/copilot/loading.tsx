import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col">
            <div className="mx-auto flex w-full max-w-3xl min-h-0 flex-1 flex-col bg-background">
                {/* Chat content */}
                <div className="flex-1 overflow-hidden px-4 py-6">
                    <div className="flex h-full min-h-80 flex-col items-center justify-center gap-6 px-4 text-center">
                        {/* Icon */}
                        <Skeleton className="size-14 rounded-2xl" />

                        {/* Heading + description */}
                        <div className="flex flex-col items-center gap-2">
                            <Skeleton className="h-6 w-56" />
                            <Skeleton className="h-4 w-80 max-w-[90vw]" />
                            <Skeleton className="h-4 w-64 max-w-[80vw]" />
                        </div>

                        {/* Suggestions */}
                        <div className="flex max-w-md flex-wrap justify-center gap-2 pt-2">
                            <Skeleton className="h-8 w-40 rounded-xl" />
                            <Skeleton className="h-8 w-36 rounded-xl" />
                            <Skeleton className="h-8 w-44 rounded-xl" />
                            <Skeleton className="h-8 w-40 rounded-xl" />
                            <Skeleton className="h-8 w-36 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Input area */}
                <div className="bg-linear-to-t from-background via-background/90 to-transparent p-4">
                    <div className="flex items-end gap-2 rounded-2xl border border-border/80 bg-muted/40 p-2 shadow-sm">
                        <Skeleton className="h-9 flex-1 rounded-lg" />
                        <Skeleton className="size-9 shrink-0 rounded-xl" />
                    </div>

                    <Skeleton className="mx-auto mt-2 h-3 w-72 max-w-full" />
                </div>
            </div>
        </div>
    );
}