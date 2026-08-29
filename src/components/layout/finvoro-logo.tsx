import { CircleDollarSign } from "lucide-react";

export function FinvoroLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <CircleDollarSign className="size-5" />
            </div>

            <span className="text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
                Finvoro
            </span>
        </div>
    );
}