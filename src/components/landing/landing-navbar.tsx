"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Show, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { FinvoroLogo } from "@/components/layout/finvoro-logo";
import { navItems } from "@/config/landing-content";

export function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const clerk = useClerk();
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousOverflowRef = useRef("");
    const previousTouchActionRef = useRef("");

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;

            ticking = true;

            window.requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > 20);
                ticking = false;
            });
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            previousOverflowRef.current = document.body.style.overflow;
            previousTouchActionRef.current = document.body.style.touchAction;
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
            closeButtonRef.current?.focus();
        } else {
            document.body.style.overflow = previousOverflowRef.current;
            document.body.style.touchAction = previousTouchActionRef.current;
        }

        return () => {
            document.body.style.overflow = previousOverflowRef.current;
            document.body.style.touchAction = previousTouchActionRef.current;
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMobileMenuOpen(false);
                menuButtonRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [mobileMenuOpen]);

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 motion-reduce:transition-none ${isScrolled
                ? "py-3 px-4 sm:px-6 lg:px-8 opacity-95"
                : "bg-transparent py-4"}`}>
            <div
                className={`mx-auto flex items-center justify-between transition-all duration-300 motion-reduce:transition-none ${isScrolled
                    ? "max-w-6xl h-18 px-5 rounded-2xl bg-card/90 dark:bg-card/90 backdrop-blur-xl border border-border/80 shadow-xl shadow-black/5 dark:shadow-white/5"
                    : "max-w-7xl h-18 px-4 sm:px-6 lg:px-8 bg-transparent"}`}>
                <Link
                    href="/"
                    aria-label="Finvoro home"
                    className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                    <FinvoroLogo />
                </Link>

                <nav
                    aria-label="Main navigation"
                    className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-sm text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden items-center gap-2 sm:flex">
                        <Show when="signed-out">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => clerk.openSignIn()}
                                className="h-11 rounded-xl px-3 text-muted-foreground hover:bg-transparent hover:text-foreground">
                                Sign in
                            </Button>

                            <Button
                                type="button"
                                onClick={() => clerk.openSignUp()}
                                className="group h-11 gap-1.5 rounded-xl px-4 shadow-sm">
                                Get started
                                <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"/>
                            </Button>
                        </Show>

                        <Show when="signed-in">
                            <Button
                                nativeButton={false}
                                render={<Link href="/dashboard" />}
                                className="group h-11 gap-1.5 rounded-xl px-4 shadow-sm">
                                Go to Dashboard
                                <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"/>
                            </Button>
                        </Show>
                    </div>

                    <Button
                        ref={menuButtonRef}
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(true)}
                        className="size-11 rounded-xl text-muted-foreground hover:text-foreground md:hidden"
                        aria-label="Open mobile menu"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="landing-mobile-menu">
                        <Menu aria-hidden="true" className="size-6" />
                    </Button>
                </div>
            </div>

            <div
                id="landing-mobile-menu"
                aria-label="Mobile navigation menu"
                aria-hidden={!mobileMenuOpen}
                className={`fixed inset-0 z-50 md:hidden transition-all duration-300 motion-reduce:transition-none ${mobileMenuOpen
                    ? "pointer-events-auto"
                    : "pointer-events-none"
                    }`}
            >
                <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-background transition-opacity duration-300 motion-reduce:transition-none ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={closeMobileMenu} />

                <div
                    inert={!mobileMenuOpen}
                    className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col justify-between border-l border-border bg-card p-6 shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${mobileMenuOpen
                        ? "translate-x-0"
                        : "translate-x-full"
                        }`}>
                    <div>
                        <div className="flex items-center justify-between border-b border-border/60 pb-6">
                            <Link
                                href="/"
                                onClick={closeMobileMenu}
                                aria-label="Finvoro home"
                                className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                            >
                                <FinvoroLogo />
                            </Link>

                            <Button
                                ref={closeButtonRef}
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={closeMobileMenu}
                                className="size-11 rounded-xl text-muted-foreground hover:text-foreground"
                                aria-label="Close mobile menu"
                            >
                                <X aria-hidden="true" className="size-6" />
                            </Button>
                        </div>

                        <nav
                            aria-label="Mobile navigation"
                            className="flex flex-col gap-2 pt-6">
                            {navItems.map((item, index) => (
                                <Button
                                    key={item.href}
                                    nativeButton={false}
                                    render={<Link href={item.href} />}
                                    variant="ghost"
                                    onClick={closeMobileMenu}
                                    className="h-11 justify-between rounded-xl px-3 py-3 text-base text-foreground/70 hover:bg-muted/40 hover:text-foreground"
                                    style={{
                                        transitionDelay: `${index * 30}ms`,
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-border/60 pt-6">
                        <Show when="signed-out">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    closeMobileMenu();
                                    clerk.openSignIn();
                                }}
                                className="h-11 w-full rounded-xl py-3 font-semibold text-muted-foreground hover:bg-muted/40 hover:text-foreground">
                                Sign in
                            </Button>

                            <Button
                                type="button"
                                onClick={() => {
                                    closeMobileMenu();
                                    clerk.openSignUp();
                                }}
                                className="group h-12 w-full gap-2 rounded-xl px-4 shadow-sm">
                                Get started
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                />
                            </Button>
                        </Show>

                        <Show when="signed-in">
                            <Button
                                nativeButton={false}
                                render={<Link href="/dashboard" />}
                                onClick={closeMobileMenu}
                                className="group h-12 w-full gap-2 rounded-xl px-4 shadow-sm">
                                Go to Dashboard
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                />
                            </Button>
                        </Show>
                    </div>
                </div>
            </div>
        </header>
    );
}