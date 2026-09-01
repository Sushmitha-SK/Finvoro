import { CircleDollarSign } from "lucide-react";

export function FinvoroLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary),var(--brand-deep)_45%)] text-primary-foreground shadow-sm shadow-primary/30">
                <CircleDollarSign className="size-5" />
            </div>

            <span className="text-lg font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
                Finvoro
            </span>
        </div>
    );
}