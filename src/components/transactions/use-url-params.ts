"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

/** Filters, sorting and pagination live in the URL so views are shareable and survive refresh. */
export function useUrlParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pending, startTransition] = useTransition();

    const update = useCallback(
        (updates: Record<string, string | null>, options: { keepPage?: boolean } = {}) => {
            const params = new URLSearchParams(searchParams.toString());

            for (const [key, value] of Object.entries(updates)) {
                if (value === null || value === "" || value === "all") params.delete(key);
                else params.set(key, value);
            }

            if (!options.keepPage && !("page" in updates)) params.delete("page");

            const query = params.toString();

            startTransition(() => {
                router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
            });
        },
        [pathname, router, searchParams],
    );

    return { searchParams, update, pending };
}
