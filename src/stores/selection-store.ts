import { create } from "zustand";

/** Row selection for bulk actions, shared by the table and the floating action bar. */
type SelectionState = {
    selected: Record<string, true>;
    toggle: (id: string) => void;
    setMany: (ids: string[], selected: boolean) => void;
    clear: () => void;
};

export const useSelectionStore = create<SelectionState>()((set) => ({
    selected: {},

    toggle: (id) =>
        set((state) => {
            const next = { ...state.selected };

            if (next[id]) delete next[id];
            else next[id] = true;

            return { selected: next };
        }),

    setMany: (ids, selected) =>
        set((state) => {
            const next = { ...state.selected };

            for (const id of ids) {
                if (selected) next[id] = true;
                else delete next[id];
            }

            return { selected: next };
        }),

    clear: () => set({ selected: {} }),
}));
