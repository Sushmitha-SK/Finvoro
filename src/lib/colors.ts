export const CATEGORY_PALETTE = [
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#ec4899",
    "#14b8a6",
    "#6366f1",
    "#84cc16",
    "#f97316",
] as const;

export function colorForIndex(index: number) {
    return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
}

/** Stable colour for a name, used when a category has no colour saved. */
export function colorForName(name: string) {
    let hash = 0;

    for (let i = 0; i < name.length; i += 1) {
        hash = (hash * 31 + name.charCodeAt(i)) | 0;
    }

    return CATEGORY_PALETTE[Math.abs(hash) % CATEGORY_PALETTE.length];
}
