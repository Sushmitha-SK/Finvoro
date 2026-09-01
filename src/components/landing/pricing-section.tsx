import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Free",
        description: "Everything you need to get started.",
        price: "₹0",
        period: "forever",
        features: [
            "Track transactions",
            "Create categories",
            "Basic budgets",
            "Monthly overview",
        ],
        cta: "Get started",
        featured: false,
    },
    {
        name: "Pro",
        description: "More insight and control over your finances.",
        price: "₹299",
        period: "per month",
        features: [
            "Everything in Free",
            "Advanced reports",
            "Smart financial insights",
            "Detailed spending analysis",
            "Priority features",
        ],
        cta: "Start with Pro",
        featured: true,
    },
    {
        name: "Premium",
        description: "For users who want the complete experience.",
        price: "₹599",
        period: "per month",
        features: [
            "Everything in Pro",
            "Advanced financial analytics",
            "Extended insights",
            "Unlimited financial history",
            "Premium support",
        ],
        cta: "Choose Premium",
        featured: false,
    },
];

export function PricingSection() {
    return (
        <section
            id="pricing"
            className="border-b bg-background"
        >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                        Simple pricing
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                        Choose the plan that fits you.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                        Start free and upgrade when you need more control
                        and deeper financial insights.
                    </p>
                </div>

                <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex h-full flex-col rounded-2xl border bg-card p-6 sm:p-7 ${plan.featured
                                    ? "border-foreground shadow-lg"
                                    : "shadow-sm"
                                }`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background">
                                    Recommended
                                </div>
                            )}

                            <div>
                                <h3 className="text-base font-semibold">
                                    {plan.name}
                                </h3>

                                <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mt-6 flex items-end gap-1">
                                <span className="text-3xl font-semibold tracking-tight">
                                    {plan.price}
                                </span>

                                <span className="mb-1 text-xs text-muted-foreground">
                                    / {plan.period}
                                </span>
                            </div>

                            <div className="mt-7 flex-1">
                                <p className="text-xs font-medium">
                                    Includes:
                                </p>

                                <ul className="mt-4 space-y-3">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-2.5 text-sm text-muted-foreground"
                                        >
                                            <Check className="mt-0.5 size-4 shrink-0 text-foreground" />

                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href="/sign-up"
                                className={`mt-8 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors ${plan.featured
                                        ? "bg-foreground text-background hover:bg-foreground/90"
                                        : "border bg-background hover:bg-muted"
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

