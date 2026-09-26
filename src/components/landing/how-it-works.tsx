'use client'

import { motion, Variants } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Track",
        description:
            "Add your income and expenses and keep your financial activity organized in one place.",
        visual: (
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="size-3 rounded-full bg-blue-500" />
                            <span className="text-xs font-medium text-foreground">Food & Dining</span>
                        </div>
                        <span className="text-xs font-semibold text-primary">Linked ✓</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="size-3 rounded-full bg-indigo-500" />
                            <span className="text-xs font-medium text-foreground">Shopping</span>
                        </div>
                        <span className="text-xs font-semibold text-primary">Linked ✓</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="size-3 rounded-full bg-orange-500" />
                            <span className="text-xs font-medium text-foreground">Transport</span>
                        </div>
                        <span className="text-xs font-semibold text-primary">Linked ✓</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        number: "02",
        title: "Plan",
        description:
            "Create budgets and categories that match the way you actually spend and save.",
        visual: (
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Monthly Budget Context</p>
                    <p className="text-sm font-semibold tracking-tight text-foreground">Optimize your spending limit</p>
                    <div className="flex gap-2">
                        <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">Active limit</div>
                        <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">INR</div>
                        <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">Auto-track</div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-3/4 rounded-full bg-primary" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Goals aligned • 4 categories checked</p>
                </div>
            </div>
        ),
    },
    {
        number: "03",
        title: "Understand",
        description:
            "Use reports and insights to turn your financial activity into better decisions.",
        visual: (
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="rounded-xl border border-primary/20 bg-accent/40 p-4 space-y-3">
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-0.5 text-[10px] font-semibold text-primary shadow-sm">
                        <Sparkles className="size-3 text-primary" />
                        <span>AI INSIGHT</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">Where did savings improve?</p>
                    <div className="space-y-1.5">
                        <div className="h-1.5 w-full rounded-full bg-primary/20" />
                        <div className="h-1.5 w-4/5 rounded-full bg-primary/20" />
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-md">
                        <span>Review the breakdown</span>
                        <ArrowRight className="size-3.5" />
                    </div>
                </div>
            </div>
        ),
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 30,
        },
    },
};

export function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="border-b bg-muted/20 relative overflow-hidden"
        >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                        From data to direction
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl text-foreground">
                        Financial clarity in three simple steps.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                        No spreadsheets. No complicated setup. Just a
                        clearer way to understand your money.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mt-14 grid gap-8 lg:grid-cols-3"
                >
                    {steps.map((step) => (
                        <motion.div
                            key={step.number}
                            variants={itemVariants}
                            className="relative flex flex-col justify-between rounded-[2rem] border border-border/80 bg-card p-6 shadow-xs backdrop-blur-xl sm:p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-sm"
                        >
                            <div>
                                {/* Step Badge */}
                                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md mb-6">
                                    {step.number}
                                </div>

                                {/* Visual Mockup Box */}
                                <div className="mb-8">
                                    {step.visual}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground tracking-tight">
                                    {step.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}


