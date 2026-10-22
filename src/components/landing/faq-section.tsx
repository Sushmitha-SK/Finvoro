"use client";

import { useId, useState } from "react";
import {
    motion,
    useReducedMotion,
} from "framer-motion";
import {
    ArrowRight,
    ChevronDown,
} from "lucide-react";

import { faqs } from "@/config/landing-content";

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const shouldReduceMotion = useReducedMotion();
    const sectionId = useId();

    const toggleFAQ = (index: number) => {
        setOpenIndex((currentIndex) =>
            currentIndex === index ? null : index
        );
    };

    const animationTransition = shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.3, ease: "easeInOut" as const };

    return (
        <section
            id="faq"
            aria-labelledby={`${sectionId}-heading`}
            className="relative bg-muted/30 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
                    <motion.div
                        initial={
                            shouldReduceMotion
                                ? false
                                : { opacity: 0, y: 20 }
                        }
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={animationTransition}
                        className="flex flex-col justify-start self-start lg:sticky lg:top-8 lg:col-span-5">
                        <div>
                            <div className="inline-flex items-center gap-2 py-1 text-xs font-semibold text-primary">
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                    Support &amp; Info
                                </span>
                            </div>

                            <h2
                                id={`${sectionId}-heading`}
                                className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Frequently asked questions
                            </h2>

                            <p className="mt-4 text-base leading-7 text-muted-foreground">
                                Everything you need to know about getting started,
                                managing your budgets, and using Finvoro effectively.
                            </p>
                        </div>

                        <div className="mt-10 hidden rounded-2xl border bg-card p-6 shadow-sm lg:block">
                            <h3 className="font-semibold text-foreground">
                                Still have questions?
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Can&apos;t find the answer you&apos;re looking for?
                                Reach out to our friendly support team.
                            </p>

                            <a
                                href="#contact"
                                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                Contact support
                                <ArrowRight
                                    className="size-4"
                                    aria-hidden="true"
                                    focusable="false"
                                />
                            </a>
                        </div>
                    </motion.div>

                    <div className="space-y-3 lg:col-span-7">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            const triggerId = `${sectionId}-trigger-${index}`;
                            const panelId = `${sectionId}-panel-${index}`;

                            return (
                                <motion.div
                                    key={faq.question}
                                    initial={
                                        shouldReduceMotion
                                            ? false
                                            : { opacity: 0, y: 20 }
                                    }
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={
                                        shouldReduceMotion
                                            ? { duration: 0 }
                                            : {
                                                duration: 0.4,
                                                delay: index * 0.05,
                                            }
                                    }
                                    className={`group rounded-2xl border transition-colors duration-300 motion-reduce:transition-none ${isOpen
                                        ? "border-primary/10 bg-card shadow-lg shadow-black/2 ring-1 ring-primary/10"
                                        : "bg-card/40 hover:border-border hover:bg-card"
                                        }`}>
                                    <h3>
                                        <button
                                            id={triggerId}
                                            type="button"
                                            aria-expanded={isOpen}
                                            aria-controls={panelId}
                                            onClick={() => toggleFAQ(index)}
                                            className="flex min-h-11 w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                                            <span
                                                className={`text-base font-medium transition-colors motion-reduce:transition-none ${isOpen
                                                    ? "text-primary"
                                                    : "text-foreground group-hover:text-foreground"
                                                    }`}>
                                                {faq.question}
                                            </span>

                                            <motion.span
                                                aria-hidden="true"
                                                animate={{
                                                    rotate: isOpen ? 180 : 0,
                                                }}
                                                transition={animationTransition}
                                                className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors motion-reduce:transition-none ${isOpen
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                                                    }`}>
                                                <ChevronDown
                                                    className="size-4"
                                                    aria-hidden="true"
                                                    focusable="false"
                                                />
                                            </motion.span>
                                        </button>
                                    </h3>

                                    <div
                                        id={panelId}
                                        role="region"
                                        aria-labelledby={triggerId}
                                        inert={!isOpen}
                                        className={`grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-muted-foreground">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
