import { create } from "zustand";

import type { TransactionFormValues } from "@/components/transactions/transaction-schema";

export type TransactionPrefill = Partial<TransactionFormValues>;

type TransactionDialogState = {
    open: boolean;
    editingId: string | null;
    prefill: TransactionPrefill | null;
    source: "manual" | "ai";
};

type UIState = {
    commandOpen: boolean;
    copilotOpen: boolean;
    pendingPrompt: string | null;
    transactionDialog: TransactionDialogState;

    setCommandOpen: (open: boolean) => void;
    toggleCommand: () => void;
    setCopilotOpen: (open: boolean) => void;
    toggleCopilot: () => void;
    askCopilot: (prompt: string) => void;
    consumePendingPrompt: () => string | null;
    openTransactionDialog: (options?: {
        editingId?: string;
        prefill?: TransactionPrefill;
        source?: "manual" | "ai";
    }) => void;
    closeTransactionDialog: () => void;
};

const closedDialog: TransactionDialogState = {
    open: false,
    editingId: null,
    prefill: null,
    source: "manual",
};

export const useUIStore = create<UIState>()((set, get) => ({
    commandOpen: false,
    copilotOpen: false,
    pendingPrompt: null,
    transactionDialog: closedDialog,

    setCommandOpen: (open) => set({ commandOpen: open }),
    toggleCommand: () => set((state) => ({ commandOpen: !state.commandOpen })),
    setCopilotOpen: (open) => set({ copilotOpen: open }),
    toggleCopilot: () => set((state) => ({ copilotOpen: !state.copilotOpen })),

    askCopilot: (prompt) =>
        set({ pendingPrompt: prompt, copilotOpen: true, commandOpen: false }),

    consumePendingPrompt: () => {
        const prompt = get().pendingPrompt;

        if (prompt) set({ pendingPrompt: null });

        return prompt;
    },

    openTransactionDialog: (options = {}) =>
        set({
            commandOpen: false,
            transactionDialog: {
                open: true,
                editingId: options.editingId ?? null,
                prefill: options.prefill ?? null,
                source: options.source ?? "manual",
            },
        }),

    closeTransactionDialog: () => set({ transactionDialog: closedDialog }),
}));
