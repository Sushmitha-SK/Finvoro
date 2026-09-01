import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FinvoroLogo } from "@/components/layout/finvoro-logo";

const navItems = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Insights", href: "#insights" },
    { label: "Pricing", href: "#pricing" },
];

export function LandingNavbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    aria-label="Finvoro home"
                    className="shrink-0"
                >
                    <FinvoroLogo />
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        href="/sign-in"
                        className="hidden px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                    >
                        Sign in
                    </Link>

                    <Link
                        href="/sign-up"
                        className="group inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
                    >
                        Get started
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </header>
    );
}

