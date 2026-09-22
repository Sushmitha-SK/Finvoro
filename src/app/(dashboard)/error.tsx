"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <TriangleAlert className="size-6" />
            </div>
            <div>
                <h2 className="text-lg font-semibold">Something went wrong</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    We couldn&apos;t load this page. It&apos;s usually temporary - try again.
                </p>
                {error.digest && <p className="mt-2 text-xs text-muted-foreground">Reference: {error.digest}</p>}
            </div>
            <Button onClick={reset}>Try again</Button>
        </div>
    );
}
