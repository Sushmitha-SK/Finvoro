"use client";

import { useMoney } from "@/stores/app-store";

type Payload = { name?: string | number; value?: unknown; color?: string; dataKey?: unknown };

export function MoneyTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: ReadonlyArray<Payload>;
    label?: string | number;
}) {
    const money = useMoney();

    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
            {label !== undefined && <p className="mb-1 font-medium">{label}</p>}
            {payload.map((item, index) => (
                <p key={`${String(item.name)}-${index}`} className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="ml-auto font-medium">{money(Number(item.value ?? 0))}</span>
                </p>
            ))}
        </div>
    );
}
