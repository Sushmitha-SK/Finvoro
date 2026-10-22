"use client";

import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Show, useClerk } from "@clerk/nextjs";

import { Button } from "../ui/button";
import {
    accountLinks,
    legalLinks,
    productLinks,
    resourceLinks,
    socialLinks,
} from "@/config/landing-content";
import assets from "@/assets/assets";
import { footerContainerVariants, footerItemVariants } from "@/lib/motion-variants";

const navLinkClass =
    "inline-block rounded-sm text-sm text-foreground/70 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";


const reducedMotionVariants: Variants = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0 },
};

export function LandingFooter() {
    const currentYear = new Date().getFullYear();
    const clerk = useClerk();
    const shouldReduceMotion = useReducedMotion();

    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: shouldReduceMotion ? "auto" : "smooth",
        });
    }, [shouldReduceMotion]);

    const handleAccountAction = useCallback(
        (label: string) => {
            const normalizedLabel = label.toLowerCase();

            if (
                normalizedLabel.includes("sign up") ||
                normalizedLabel.includes("get started") ||
                normalizedLabel.includes("register")
            ) {
                clerk.openSignUp();
            } else if (
                normalizedLabel.includes("sign in") ||
                normalizedLabel.includes("log in") ||
                normalizedLabel.includes("login")
            ) {
                clerk.openSignIn();
            }
        },
        [clerk],
    );

    const animationVariants = shouldReduceMotion
        ? reducedMotionVariants
        : footerItemVariants;

    return (
        <footer
            id="footer"
            className="relative overflow-hidden border-t bg-background"
            aria-labelledby="footer-heading"
        >
            <h2 id="footer-heading" className="sr-only">
                Site Footer
            </h2>

            <div className="container relative z-10 w-full px-4 pb-10 pt-16 md:px-16 lg:px-24 xl:px-32">
                <motion.div
                    variants={
                        shouldReduceMotion
                            ? reducedMotionVariants
                            : footerContainerVariants
                    }
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                    className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]"
                >
                    <motion.div
                        variants={animationVariants}
                        className="max-w-sm"
                    >
                        <Link
                            href="/"
                            aria-label="Finvoro home"
                            className="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <Image
                                src={assets.logo.src}
                                alt="Finvoro"
                                width={120}
                                height={48}
                                sizes="120px"
                                className="h-12 w-auto object-contain dark:hidden"
                            />

                            <Image
                                src={assets.logoDark.src}
                                alt=""
                                aria-hidden="true"
                                width={120}
                                height={48}
                                sizes="120px"
                                className="hidden h-12 w-auto object-contain dark:block"
                            />
                        </Link>

                        <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-muted-foreground">
                            A simpler way to track, plan, and understand your
                            personal finances.
                        </p>

                        <ul
                            className="mt-6 flex items-center gap-2"
                            aria-label="Social media"
                        >
                            {socialLinks.map(({ label, href, icon: Icon }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                                    >
                                        <Icon
                                            className="size-4"
                                            aria-hidden="true"
                                            focusable="false"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.nav
                        aria-label="Footer navigation"
                        variants={animationVariants}
                        className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-12"
                    >
                        <div>
                            <h3 className="mb-4 text-sm font-medium text-foreground">
                                Product
                            </h3>

                            <ul className="space-y-3">
                                {productLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className={navLinkClass}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-medium text-foreground">
                                Resources
                            </h3>

                            <ul className="space-y-3">
                                {resourceLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className={navLinkClass}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <h3 className="mb-4 text-sm font-medium text-foreground">
                                Account
                            </h3>

                            <Show when="signed-out">
                                <ul className="space-y-3">
                                    {accountLinks.map((item) => (
                                        <li key={item.label}>
                                            <button
                                                type="button"
                                                onClick={() => handleAccountAction(item.label)}
                                                className={`${navLinkClass} min-h-6 cursor-pointer`}
                                            >
                                                {item.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </Show>

                            <Show when="signed-in">
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/dashboard" className={navLinkClass}>
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/settings" className={navLinkClass}>
                                            Settings
                                        </Link>
                                    </li>
                                </ul>
                            </Show>
                        </div>
                    </motion.nav>
                </motion.div>

                <motion.div
                    variants={animationVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                    className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between"
                >
                    <p className="tabular-nums">
                        &copy; {currentYear} Finvoro. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                        <nav aria-label="Legal">
                            <ul className="flex flex-wrap gap-x-6 gap-y-2">
                                {legalLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="inline-flex min-h-6 items-center rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={scrollToTop}
                            className="min-h-11 gap-1.5 px-2 text-muted-foreground hover:bg-transparent hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                        >
                            <span className="text-xs">Back to top</span>
                            <ArrowUp
                                className="size-3.5"
                                aria-hidden="true"
                                focusable="false"
                            />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
