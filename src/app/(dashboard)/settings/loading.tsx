import { Skeleton } from "@/components/ui/skeleton";

function ProfileSkeleton() {
    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-xs">
            <div className="p-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-14 shrink-0 rounded-2xl" />

                    <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-56 max-w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function TabsSkeleton() {
    return (
        <div className="grid h-11 grid-cols-3 gap-1 rounded-md bg-muted/60 p-1">
            <Skeleton className="h-full rounded-md" />
            <Skeleton className="h-full rounded-md" />
            <Skeleton className="h-full rounded-md" />
        </div>
    );
}

function SettingsRowSkeleton() {
    return (
        <div className="flex flex-col gap-4 border-b border-border/60 py-4 last:border-b-0 last:pb-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3.5 w-72 max-w-full" />
            </div>

            <Skeleton className="h-9 w-full max-w-xs rounded-lg sm:w-48" />
        </div>
    );
}

function PreferencesSkeleton() {
    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-xs">
            <div className="space-y-1.5 p-6">
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            <div className="space-y-2 px-6 pb-6">
                <SettingsRowSkeleton />
                <SettingsRowSkeleton />

                <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-1.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3.5 w-72 max-w-full" />
                    </div>

                    <Skeleton className="h-6 w-11 rounded-full" />
                </div>
            </div>
        </div>
    );
}

function AiSkeleton() {
    return (
        <div className="rounded-xl border border-border/50 bg-card shadow-xs">
            <div className="space-y-1.5 p-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-5 rounded-md" />
                    <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-4 w-96 max-w-full" />
            </div>

            <div className="space-y-4 px-6 pb-6">
                <div className="flex flex-col gap-4 border-b border-border/60 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3.5 w-80 max-w-full" />
                    </div>

                    <Skeleton className="h-6 w-11 rounded-full" />
                </div>

                <Skeleton className="h-10 w-full rounded-lg" />

                <div className="flex gap-3.5 rounded-xl border border-border/40 bg-muted/50 p-4">
                    <Skeleton className="mt-0.5 size-5 shrink-0 rounded-md" />

                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-[95%] max-w-full" />
                        <Skeleton className="h-3.5 w-[75%] max-w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function DataManagementSkeleton() {
    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-border/50 bg-card shadow-xs">
                <div className="space-y-1.5 p-6">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>

                <div className="space-y-2 px-6 pb-6">
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className="flex flex-col gap-4 border-b border-border/60 py-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0 space-y-1.5">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3.5 w-80 max-w-full" />
                            </div>

                            <Skeleton className="h-9 w-24 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-destructive/30 bg-destructive/5">
                <div className="space-y-1.5 p-6">
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-5 rounded-md" />
                        <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-4 w-72 max-w-full" />
                </div>

                <div className="px-6 pb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 space-y-1.5">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3.5 w-80 max-w-full" />
                        </div>

                        <Skeleton className="h-9 w-40 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Page Header */}
                <div className="space-y-2">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-4 w-80 max-w-full" />
                </div>

                {/* Settings Content */}
                <div className="mx-auto max-w-4xl space-y-6 pb-10">
                    <ProfileSkeleton />

                    <div className="space-y-4">
                        <TabsSkeleton />

                        {/* Default tab: Preferences */}
                        <PreferencesSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
}
