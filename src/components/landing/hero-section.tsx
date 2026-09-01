import Link from "next/link";
import {
    ArrowRight,
    Check,
    Sparkles,
} from "lucide-react";

import { DashboardPreview } from "./dashboard-preview";

const benefits = [
    "Track every transaction",
    "Build smarter budgets",
    "Understand your spending",
];

export function HeroSection() {
    return (
        <section className="relative overflow-hidden border-b">
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 size-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                        <Sparkles className="size-3.5" />
                        A simpler way to manage your money
                    </div>

                    <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                        Your money.
                        <br />
                        <span className="text-muted-foreground">
                            Your clarity.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                        Finvoro brings your transactions, budgets,
                        spending insights, and financial reports
                        together in one beautifully simple workspace.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/sign-up"
                            className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:opacity-90"
                        >
                            Get started free
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>

                        <Link
                            href="#features"
                            className="inline-flex h-11 items-center justify-center rounded-lg border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
                        >
                            Explore features
                        </Link>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground"
                            >
                                <span className="flex size-4 items-center justify-center rounded-full bg-primary/10">
                                    <Check className="size-2.5" />
                                </span>
                                {benefit}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-14 sm:mt-20">
                    <DashboardPreview />
                </div>
            </div>
        </section>
    );
}

