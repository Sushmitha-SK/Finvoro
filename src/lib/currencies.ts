export const SUPPORTED_CURRENCIES = [
    { value: "INR", label: "Indian Rupee (₹)", locale: "en-IN" },
    { value: "USD", label: "US Dollar ($)", locale: "en-US" },
    { value: "EUR", label: "Euro (€)", locale: "en-IE" },
    { value: "GBP", label: "British Pound (£)", locale: "en-GB" },
    { value: "AED", label: "UAE Dirham (د.إ)", locale: "en-AE" },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]["value"];

export const DEFAULT_CURRENCY: CurrencyCode = "INR";

export function isSupportedCurrency(value: string): value is CurrencyCode {
    return SUPPORTED_CURRENCIES.some((currency) => currency.value === value);
}

export function localeForCurrency(currency: string): string {
    return (
        SUPPORTED_CURRENCIES.find((item) => item.value === currency)?.locale ??
        "en-IN"
    );
}
