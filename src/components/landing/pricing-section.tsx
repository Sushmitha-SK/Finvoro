import { Check } from "lucide-react";
import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { plans } from "@/config/landing-content";


export function PricingSection() {
    return (
        <section
            id="pricing"
            className="relative overflow-hidden border-b bg-background py-20 sm:py-24 lg:py-28">
            <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
                <div className="h-100 w-150 rounded-full bg-primary/20 blur-[120px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                        Simple Pricing
                    </span>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        Choose the plan that fits you.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                        Start free and upgrade when you need more control
                        and deeper financial insights.
                    </p>
                </div>

                <div className="mt-16 grid items-center gap-8 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex h-full flex-col transition-all duration-300 ${plan.featured
                                    ? "bg-linear-to-b from-primary/[0.14] via-card to-card border-2 border-primary shadow-2xl shadow-primary/15 scale-[1.03] rounded-3xl p-8 sm:p-10 z-10"
                                    : "border bg-card shadow-sm hover:shadow-md rounded-3xl p-8"
                                }`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">
                                    Most Popular
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-bold">
                                    {plan.name}
                                </h3>

                                <p className={`mt-2 text-sm leading-6 text-muted-foreground ${plan.featured ? "min-h-16" : "min-h-12"}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold tracking-tight">
                                    {plan.price}
                                </span>
                                <span className="text-sm font-medium text-muted-foreground">
                                    / {plan.period}
                                </span>
                            </div>

                            <div className="mt-8 flex-1 border-t border-border/60 pt-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    What&apos;s included
                                </p>

                                <ul className="mt-4 space-y-3.5">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-3 text-sm text-muted-foreground"
                                        >
                                            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Check className="size-3.5 stroke-[2.5]" />
                                            </div>
                                            <span className="font-medium text-foreground/90">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Show when="signed-out">
                                <Link
                                    href="/sign-up"
                                    className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all shadow-sm ${plan.featured
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
                                            : "border border-border bg-background hover:bg-secondary text-foreground"
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </Show>

                            <Show when="signed-in">
                                <Link
                                    href="/dashboard"
                                    className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all shadow-sm ${plan.featured
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
                                            : "border border-border bg-background hover:bg-secondary text-foreground"
                                        }`}
                                >
                                    Go to Dashboard
                                </Link>
                            </Show>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}