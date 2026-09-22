/**
 * Date helpers.
 *
 * Finvoro stores a transaction date as the *server-local* midnight of the day
 * the user picked. Everything that builds month ranges or parses form input
 * goes through this file so that the convention lives in exactly one place.
 */

export function parseDateInput(value: string): Date {
    return new Date(`${value}T00:00:00`);
}

/** yyyy-mm-dd in local time (not UTC, so it never shifts the day). */
export function toDateInput(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
}

export function isValidDateInput(value: string | null | undefined): value is string {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    return !Number.isNaN(parseDateInput(value).getTime());
}

export function startOfMonth(date: Date, offset = 0): Date {
    return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export function monthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(date: Date, style: "short" | "long" = "short"): string {
    return new Intl.DateTimeFormat("en-IN", {
        month: style,
        year: style === "long" ? "numeric" : "2-digit",
    }).format(date);
}

export function daysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Last N calendar months ending with (and including) the month of `now`. */
export function lastMonths(now: Date, count: number): Date[] {
    return Array.from({ length: count }, (_, index) =>
        startOfMonth(now, index - (count - 1)),
    );
}

export function formatShortDate(date: Date | string): string {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

export function formatRelativeTime(value: string | Date, now = new Date()): string {
    const diffMs = now.getTime() - new Date(value).getTime();
    const minutes = Math.floor(diffMs / 60_000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return formatShortDate(value);
}
