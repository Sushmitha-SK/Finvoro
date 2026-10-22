'use client';

import { howItWorksContainerVariants, howItWorksItemVariants } from '@/lib/motion-variants';
import { useReducedMotion, motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Track',
        description:
            'Add your income and expenses and keep your financial activity organized in one place.',
        visual: (
            <div
                aria-hidden="true"
                className="rounded-2xl border border-border/80 bg-background/80 p-4 shadow-sm backdrop-blur-xl"
            >
                <div className="space-y-2.5">
                    {[
                        { name: 'Food & Dining', color: 'bg-blue-500' },
                        { name: 'Shopping', color: 'bg-indigo-500' },
                        { name: 'Transport', color: 'bg-orange-500' },
                    ].map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 shadow-sm"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`size - 3 rounded - full ${item.color} `} />
                                <span className="text-xs font-medium text-foreground">
                                    {item.name}
                                </span>
                            </div>

                            <span className="text-xs font-semibold text-primary">
                                Linked ✓
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        number: '02',
        title: 'Plan',
        description:
            'Create budgets and categories that match the way you actually spend and save.',
        visual: (
            <div
                aria-hidden="true"
                className="rounded-2xl border border-border/80 bg-background/80 p-4 shadow-sm backdrop-blur-xl"
            >
                <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Monthly Budget Context
                    </p>

                    <p className="text-sm font-semibold tracking-tight text-foreground">
                        Optimize your spending limit
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                            Active limit
                        </div>
                        <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                            INR
                        </div>
                        <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                            Auto-track
                        </div>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-3/4 rounded-full bg-primary" />
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                        Goals aligned • 4 categories checked
                    </p>
                </div>
            </div>
        ),
    },
    {
        number: '03',
        title: 'Understand',
        description:
            'Use reports and insights to turn your financial activity into better decisions.',
        visual: (
            <div
                aria-hidden="true"
                className="rounded-2xl border border-border/80 bg-background/80 p-4 shadow-sm backdrop-blur-xl"
            >
                <div className="space-y-3 rounded-xl border border-primary/20 bg-accent/40 p-4">
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-0.5 text-[10px] font-semibold text-primary shadow-sm">
                        <Sparkles
                            aria-hidden="true"
                            className="size-3 text-primary"
                        />
                        <span>AI INSIGHT</span>
                    </div>

                    <p className="text-sm font-semibold text-foreground">
                        Where did savings improve?
                    </p>

                    <div className="space-y-1.5">
                        <div className="h-1.5 w-full rounded-full bg-primary/20" />
                        <div className="h-1.5 w-4/5 rounded-full bg-primary/20" />
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-md">
                        <span>Review the breakdown</span>
                        <ArrowRight
                            aria-hidden="true"
                            className="size-3.5"
                        />
                    </div>
                </div>
            </div>
        ),
    },
] as const;


export function HowItWorks() {
    const shouldReduceMotion = useReducedMotion();

    const animationProps = shouldReduceMotion
        ? {}
        : {
            initial: 'hidden' as const,
            whileInView: 'visible' as const,
            viewport: { once: true, margin: '-100px' },
        };

    return (
        <section
            id="how-it-works"
            aria-labelledby="how-it-works-heading"
            className="relative overflow-hidden border-border bg-muted/20"
        >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{
                        duration: shouldReduceMotion ? 0 : 0.5,
                    }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        From data to direction
                    </p>

                    <h2
                        id="how-it-works-heading"
                        className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
                    >
                        Financial clarity in three simple steps.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                        No spreadsheets. No complicated setup. Just a clearer way
                        to understand your money.
                    </p>
                </motion.div>

                <motion.div
                    variants={shouldReduceMotion ? undefined : howItWorksContainerVariants}
                    {...animationProps}
                    className="mt-14 grid gap-8 lg:grid-cols-3"
                >
                    {steps.map((step) => (
                        <motion.article
                            key={step.number}
                            variants={shouldReduceMotion ? undefined : howItWorksItemVariants}
                            className="relative flex flex-col justify-between rounded-[2rem] border border-border/80 bg-card p-6 shadow-xs backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-primary/20 hover:shadow-xs motion-reduce:transition-none sm:p-8"
                        >
                            <div>
                                <div
                                    aria-hidden="true"
                                    className="mb-6 inline-flex size-10 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-md"
                                >
                                    {step.number}
                                </div>

                                <div className="mb-8">{step.visual}</div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                                    {step.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default HowItWorks;
