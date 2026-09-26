import { ArrowRight, CircleDollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Show } from "@clerk/nextjs";
import assets from "@/assets/assets";

export function FinalCTA() {
    return (
        <section className="relative overflow-hidden bg-muted/30">
            <div className="absolute inset-0 z-0">
                <Image
                    src={assets.heroBackground.src}
                    alt="Financial background"
                    fill
                    priority
                    className="object-cover object-center opacity-25"
                />
                <div className="absolute inset-0 bg-linear-to-b from-background/5 via-background/20 to-background/30" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-28">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border/50 bg-primary/80 shadow-md backdrop-blur-sm">
                    <CircleDollarSign className="size-6 text-white" />
                </div>

                <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl lg:leading-[1.08]">
                    A clearer picture of your money starts here.
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                    Track your spending, plan your budgets, and understand
                    your financial habits with Finvoro.
                </p>

                <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                    <Show when="signed-out">
                        <Link
                            href="/sign-up"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-6 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Get started for free
                            <ArrowRight className="size-4" />
                        </Link>

                        <Link
                            href="/sign-in"
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-border/80 bg-background/80 px-6 text-sm font-medium shadow-sm backdrop-blur-sm transition-all hover:bg-muted hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Sign in
                        </Link>
                    </Show>

                    <Show when="signed-in">
                        <Link
                            href="/dashboard"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-background shadow-sm transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Go to Dashboard
                            <ArrowRight className="size-4" />
                        </Link>
                    </Show>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                    No complicated setup. Start organizing your finances today.
                </p>
            </div>
        </section>
    );
}