"use client"; 

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion, ArrowRight } from "lucide-react";
import { faqs } from "@/config/landing-content";

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="relative border-b bg-muted/30 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
                    
                    {/* Left Column: Heading & Help Box */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-8 self-start"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                <MessageCircleQuestion className="size-3.5" />
                                Support & Info
                            </div>

                            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Frequently asked questions
                            </h2>

                            <p className="mt-4 text-base leading-7 text-muted-foreground">
                                Everything you need to know about getting started, managing your budgets, and using Finvoro effectively.
                            </p>
                        </div>

                        {/* Optional Help Box */}
                        <div className="mt-10 hidden rounded-2xl border bg-card p-6 shadow-sm lg:block">
                            <h4 className="font-semibold text-foreground">Still have questions?</h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Can't find the answer you're looking for? Reach out to our friendly support team.
                            </p>
                            <a
                                href="#contact"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            >
                                Contact support <ArrowRight className="size-4" />
                            </a>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-7 space-y-3">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <motion.div
                                    key={faq.question}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className={`group rounded-2xl border transition-colors duration-300 ${
                                        isOpen
                                            ? "bg-card shadow-lg shadow-black/3 border-primary/30 ring-1 ring-primary/20"
                                            : "bg-card/40 hover:bg-card hover:border-border"
                                    }`}
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors"
                                    >
                                        <span className={`text-base font-medium transition-colors ${isOpen ? "text-primary" : "text-foreground group-hover:text-foreground"}`}>
                                            {faq.question}
                                        </span>
                                        <motion.div 
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                                                isOpen 
                                                    ? "bg-primary text-primary-foreground" 
                                                    : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                                            }`}
                                        >
                                            <ChevronDown className="size-4" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-muted-foreground">
                                                        {faq.answer}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}