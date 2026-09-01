import Link from "next/link";
import { CircleDollarSign } from "lucide-react";

const productLinks = [
    { label: "Features", href: "#features" },
    { label: "Insights", href: "#insights" },
    { label: "Pricing", href: "#pricing" },
];

const resourceLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
];

const accountLinks = [
    { label: "Sign in", href: "/sign-in" },
    { label: "Get started", href: "/sign-up" },
];

export function LandingFooter() {
    return (
        <footer className="border-t bg-background">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2"
                        >
                            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
                                <CircleDollarSign className="size-5" />
                            </span>

                            <span className="text-lg font-semibold tracking-tight">
                                Finvoro
                            </span>
                        </Link>

                        <p className="mt-4 text-sm leading-6 text-muted-foreground">
                            A simpler way to track, plan, and understand
                            your personal finances.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-sm font-semibold">
                            Product
                        </h3>

                        <ul className="mt-4 space-y-3">
                            {productLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold">
                            Resources
                        </h3>

                        <ul className="mt-4 space-y-3">
                            {resourceLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-sm font-semibold">
                            Account
                        </h3>

                        <ul className="mt-4 space-y-3">
                            {accountLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Finvoro. All rights reserved.
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Privacy
                        </Link>

                        <Link
                            href="#"
                            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

