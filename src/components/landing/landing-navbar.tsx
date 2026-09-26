"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Show } from "@clerk/nextjs";
import { FinvoroLogo } from "@/components/layout/finvoro-logo";
import { navItems } from "@/config/landing-content";

export function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Check initial scroll state on mount
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled
                ? "py-3 px-4 sm:px-6 lg:px-8 opacity-90"
                : "bg-transparent"
                }`}
        >
            <div
                className={`mx-auto flex items-center justify-between transition-all duration-300 ${isScrolled
                    ? "max-w-6xl h-18 px-5 rounded-xl bg-card/90 dark:bg-card/90 backdrop-blur-xl border border-border/80 shadow-lg shadow-black/3 dark:shadow-white/2"
                    : "max-w-7xl h-18 px-4 sm:px-6 lg:px-8 bg-transparent"
                    }`}
            >
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
                    <Show when="signed-out">
                        <Link
                            href="/sign-in"
                            className="hidden px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                        >
                            Sign in
                        </Link>

                        <Link
                            href="/sign-up"
                            className="group inline-flex h-12 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
                        >
                            Get started
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </Show>

                    <Show when="signed-in">
                        <Link
                            href="/dashboard"
                            className="group inline-flex h-12 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
                        >
                            Go to Dashboard
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </Show>
                </div>
            </div>
        </header>
    );
}