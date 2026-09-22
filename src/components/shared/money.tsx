"use client";

import { useMoney } from "@/stores/app-store";

type MoneyProps = {
    value: number;
    compact?: boolean;
    fractionDigits?: number;
    className?: string;
};

export function Money({ value, compact, fractionDigits, className }: MoneyProps) {
    const money = useMoney();

    return <span className={className}>{money(value, { compact, fractionDigits })}</span>;
}
