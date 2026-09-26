'use client'

import Link from "next/link";
import { ArrowUp, CircleDollarSign, Mail } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Button } from "../ui/button";
import { Show } from "@clerk/nextjs";
import { accountLinks, legalLinks, productLinks, resourceLinks, socialLinks } from "@/config/landing-content";

const navLinkClass =
    "inline-block rounded-sm text-sm text-foreground/70 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

export function LandingFooter() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer
            id="footer"
            className="relative overflow-hidden border-t bg-background"
            aria-labelledby="footer-heading"
        >
            <h2 id="footer-heading" className="sr-only">
                Site Footer
            </h2>

            <div className="container relative z-10 w-full px-4 pt-16 pb-10 md:px-16 lg:px-24 xl:px-32">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]"
                >
                    {/* Brand column */}
                    <motion.div variants={itemVariants} className="max-w-sm">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <CircleDollarSign className="size-4.5" />
                            </span>
                            <span className="text-lg font-semibold tracking-tight text-foreground">
                                Finvoro
                            </span>
                        </Link>

                        <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-muted-foreground">
                            A simpler way to track, plan, and understand your personal finances.
                        </p>

                        <ul className="mt-6 flex items-center gap-2" aria-label="Social media">
                            {socialLinks.map(({ label, href, icon: Icon }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    >
                                        <Icon className="size-4" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.nav
                        aria-label="Footer Navigation"
                        variants={itemVariants}
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
                                            <Link href={item.href} className={navLinkClass}>
                                                {item.label}
                                            </Link>
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

                {/* Bottom bar */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between"
                >
                    <p className="tabular-nums">&copy; {currentYear} Finvoro. All rights reserved.</p>

                    <div className="flex flex-wrap items-center gap-6">
                        <nav aria-label="Legal">
                            <ul className="flex gap-6">
                                {legalLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                            className="h-auto cursor-pointer gap-1.5 p-0 text-muted-foreground hover:bg-transparent hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <span className="text-xs">Back to top</span>
                            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                    </div>
                </motion.div>
            </div>

          
        </footer>
    );
}