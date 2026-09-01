import { ArrowRight, CircleDollarSign } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
    return (
        <section className="bg-muted/30">
            <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-28">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border bg-background shadow-sm">
                    <CircleDollarSign className="size-6" />
                </div>

                <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl lg:leading-[1.08]">
                    A clearer picture of your money starts here.
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                    Track your spending, plan your budgets, and understand
                    your financial habits with Finvoro.
                </p>

                <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                    <Link
                        href="/sign-up"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                    >
                        Get started for free
                        <ArrowRight className="size-4" />
                    </Link>

                    <Link
                        href="/sign-in"
                        className="inline-flex h-11 items-center justify-center rounded-lg border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Sign in
                    </Link>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                    No complicated setup. Start organizing your finances today.
                </p>
            </div>
        </section>
    );
}

