"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CategoryOption } from "@/lib/data/categories";
import { formatCurrency } from "@/lib/format-currency";

/**
 * User-specific state that is rendered on the server (currency, categories).
 * It lives in a per-request store created by the provider - a module-level
 * store would be shared by every user hitting the same server process.
 */
export type AppState = {
    currency: string;
    aiEnabled: boolean;
    categories: CategoryOption[];
    /** Privacy mode: mask money amounts. Persisted per browser. */
    hideAmounts: boolean;

    setCurrency: (currency: string) => void;
    setAiEnabled: (enabled: boolean) => void;
    setCategories: (categories: CategoryOption[]) => void;
    toggleHideAmounts: () => void;
};

export type AppStoreInit = {
    currency: string;
    aiEnabled: boolean;
    categories: CategoryOption[];
};

function createAppStore(init: AppStoreInit) {
    return createStore<AppState>()(
        persist(
            (set) => ({
                ...init,
                hideAmounts: false,
                setCurrency: (currency) => set({ currency }),
                setAiEnabled: (aiEnabled) => set({ aiEnabled }),
                setCategories: (categories) => set({ categories }),
                toggleHideAmounts: () => set((state) => ({ hideAmounts: !state.hideAmounts })),
            }),
            {
                name: "finvoro:app",
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ hideAmounts: state.hideAmounts }),
                // Read localStorage after mount so server and client markup match.
                skipHydration: true,
            },
        ),
    );
}

const AppStoreContext = createContext<StoreApi<AppState> | null>(null);

export function AppStoreProvider({
    init,
    children,
}: {
    init: AppStoreInit;
    children: ReactNode;
}) {
    const [store] = useState(() => createAppStore(init));

    // The server re-renders the layout after mutations; keep the store in step.
    useEffect(() => {
        store.setState({
            currency: init.currency,
            aiEnabled: init.aiEnabled,
            categories: init.categories,
        });
    }, [store, init.currency, init.aiEnabled, init.categories]);

    useEffect(() => {
        void store.persist.rehydrate();
    }, [store]);

    return <AppStoreContext.Provider value={store}>{children}</AppStoreContext.Provider>;
}

export function useAppStore<T>(selector: (state: AppState) => T): T {
    const store = useContext(AppStoreContext);

    if (!store) {
        throw new Error("useAppStore must be used inside <AppStoreProvider>");
    }

    return useStore(store, selector);
}

/** Currency formatter bound to the user's preference and privacy mode. */
export function useMoney() {
    const currency = useAppStore((state) => state.currency);
    const hide = useAppStore((state) => state.hideAmounts);

    return (amount: number, options?: { compact?: boolean; fractionDigits?: number }) =>
        hide ? "••••••" : formatCurrency(amount, currency, options);
}
