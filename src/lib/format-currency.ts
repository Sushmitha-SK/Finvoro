import { localeForCurrency } from "@/lib/currencies";

export function formatCurrency(
    amount: number,
    currency = "INR",
    options: { compact?: boolean; fractionDigits?: number } = {},
) {
    const { compact = false, fractionDigits = 0 } = options;

    return new Intl.NumberFormat(localeForCurrency(currency), {
        style: "currency",
        currency,
        notation: compact ? "compact" : "standard",
        minimumFractionDigits: compact ? 0 : fractionDigits,
        maximumFractionDigits: compact ? 1 : fractionDigits,
    }).format(amount);
}

export function formatPercent(value: number, fractionDigits = 0) {
    return `${value.toFixed(fractionDigits)}%`;
}

export function formatDelta(value: number, fractionDigits = 0) {
    const sign = value > 0 ? "+" : "";

    return `${sign}${value.toFixed(fractionDigits)}%`;
}
