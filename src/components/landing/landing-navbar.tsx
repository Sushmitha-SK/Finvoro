"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Show, useClerk } from "@clerk/nextjs";
import { FinvoroLogo } from "@/components/layout/finvoro-logo";
import { navItems } from "@/config/landing-content";

export function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const clerk = useClerk();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [mobileMenuOpen]);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? "py-3 px-4 sm:px-6 lg:px-8 opacity-95" : "bg-transparent py-4"
                }`}
        >
            <div
                className={`mx-auto flex items-center justify-between transition-all duration-300 ${isScrolled
                    ? "max-w-6xl h-18 px-5 rounded-2xl bg-card/90 dark:bg-card/90 backdrop-blur-xl border border-border/80 shadow-xl shadow-black/5 dark:shadow-white/5"
                    : "max-w-7xl h-18 px-4 sm:px-6 lg:px-8 bg-transparent"
                    }`}
            >
                <Link href="/" aria-label="Finvoro home" className="shrink-0">
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
                    <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                        <Show when="signed-out">
                            <button
                                onClick={() => clerk.openSignIn()}
                                className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground inline-flex cursor-pointer"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => clerk.openSignUp()}
                                className="group inline-flex h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 cursor-pointer"
                            >
                                Get started
                                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </Show>
                        <Show when="signed-in">
                            <Link
                                href="/dashboard"
                                className="group inline-flex h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
                            >
                                Go to Dashboard
                                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </Show>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="inline-flex items-center justify-center p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 md:hidden cursor-pointer transition-colors"
                        aria-label="Open mobile menu"
                    >
                        <Menu className="size-6" />
                    </button>
                </div>
            </div>

            <div
                className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div
                    className={`absolute inset-0 bg-background transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setMobileMenuOpen(false)} />

                <div
                    className={`absolute inset-y-0 right-0 w-full max-w-sm bg-card border-l border-border shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ease-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}>
                    <div>
                        <div className="flex items-center justify-between pb-6 border-b border-border/60">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="shrink-0">
                                <FinvoroLogo />
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer transition-colors"
                                aria-label="Close mobile menu"
                            >
                                <X className="size-6" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2 pt-6">
                            {navItems.map((item, index) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between py-3 px-3 rounded-xl text-base font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-muted/40"
                                    style={{
                                        transitionDelay: `${index * 30}ms`
                                    }}
                                >
                                    {item.label}

                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="pt-6 border-t border-border/60 flex flex-col gap-3">
                        <Show when="signed-out">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    clerk.openSignIn();
                                }}
                                className="w-full py-3 text-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer rounded-xl hover:bg-muted/40"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    clerk.openSignUp();
                                }}
                                className="group w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 cursor-pointer"
                            >
                                Get started
                                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </Show>
                        <Show when="signed-in">
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="group w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
                            >
                                Go to Dashboard
                                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </Show>
                    </div>
                </div>
            </div>
        </header>
    );
}