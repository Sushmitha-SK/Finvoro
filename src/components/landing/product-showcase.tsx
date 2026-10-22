'use client';

import assets from '@/assets/assets';
import { categoryData, productCapabilities, productFeatureItems } from '@/config/landing-content';
import { showcaseAnimation } from '@/lib/motion-variants';
import { Show, useClerk } from '@clerk/nextjs';
import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    CalendarDays,
    ChevronDown,
    CircleDollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

const chartBars = [
    35, 52, 42, 68, 48, 74, 58,
    88, 64, 78, 55, 72, 61, 84,
] as const;

export function ProductShowcase() {
    const clerk = useClerk();
    const shouldReduceMotion = useReducedMotion();

    return (
        <section
            aria-labelledby="product-showcase-heading"
            className="overflow-hidden border-b border-border bg-muted/20 font-sans">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    <div>
                        <div className="inline-flex w-fit items-center gap-2 py-1 text-xs font-semibold text-accent-foreground">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Financial Clarity Suite
                            </span>
                        </div>

                        <h2 id="product-showcase-heading"
                            className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                            See where your money goes.
                        </h2>

                        <p className="mt-5 text-base leading-7 text-muted-foreground">
                            Instead of scanning rows of numbers, Finvoro turns your
                            financial activity into simple, meaningful visual
                            information.
                        </p>

                        <div className="mt-8 space-y-5">
                            {productFeatureItems.map(({ title, description, Icon }) => (
                                <div key={title} className="flex gap-4">
                                    <div
                                        aria-hidden="true"
                                        className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-accent text-primary shadow-sm"
                                    >
                                        <Icon className="size-4" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-foreground">
                                            {title}
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <Show when="signed-out">
                                <Button
                                    type="button"
                                    onClick={() => clerk.openSignUp()}
                                    className="group min-h-11 gap-1.5 rounded-xl shadow-lg transition-opacity hover:opacity-95 focus-visible:ring-offset-2 motion-reduce:transition-none"
                                >
                                    Try Finvoro free
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                    />
                                </Button>
                            </Show>

                            <Show when="signed-in">
                                <Link
                                    href="/dashboard"
                                    className="group inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none">
                                    Go to Dashboard
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                    />
                                </Link>
                            </Show>

                            <span className="text-xs font-medium text-muted-foreground">
                                No credit card required • Instant setup
                            </span>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {productCapabilities.map(({ label, Icon }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2 p-3">
                                    <Icon
                                        aria-hidden="true"
                                        className="size-4 shrink-0 text-primary"
                                    />
                                    <span className="text-xs font-semibold text-card-foreground">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        style={{
                            backgroundImage: `url("${assets.heroBackground.src}")`,
                        }}
                        className="rounded-[1.5rem] border border-border/80 bg-cover bg-center p-8">
                        <motion.div
                            initial={
                                shouldReduceMotion ? false : showcaseAnimation.hidden
                            }
                            whileInView={
                                shouldReduceMotion ? undefined : showcaseAnimation.visible
                            }
                            viewport={{ once: true, margin: '-100px' }}
                            transition={
                                shouldReduceMotion
                                    ? { duration: 0 }
                                    : {
                                        type: 'spring',
                                        stiffness: 150,
                                        damping: 37,
                                        mass: 1,
                                    }
                            }
                            className="relative mx-auto rounded-[1.5rem] border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Spending analysis
                                    </p>

                                    <p className="mt-0.5 text-lg font-semibold tracking-tight tabular-nums text-card-foreground">
                                        ₹20,180
                                    </p>
                                </div>

                                <span className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground">
                                    <CalendarDays
                                        aria-hidden="true"
                                        className="size-3 text-muted-foreground"
                                    />
                                    This month
                                    <ChevronDown
                                        aria-hidden="true"
                                        className="size-2.5 text-muted-foreground"
                                    />
                                </span>
                            </div>

                            <div
                                aria-hidden="true"
                                className="mt-5 h-36 rounded-xl border border-border bg-background p-3"
                            >
                                <div className="flex h-full items-end gap-1.5 sm:gap-2">
                                    {chartBars.map((height, index) => (
                                        <div
                                            key={index}
                                            className="flex h-full flex-1 items-end"
                                        >
                                            <div
                                                className={`w-full rounded-t ${index === 7
                                                    ? 'bg-primary'
                                                    : 'bg-primary/15'
                                                    }`}
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2.5">
                                <div className="rounded-xl border border-border bg-background p-3">
                                    <div className="flex items-center gap-1.5">
                                        <div
                                            aria-hidden="true"
                                            className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground"
                                        >
                                            <ArrowDown className="size-3" />
                                        </div>

                                        <span className="text-xs text-muted-foreground">
                                            Income
                                        </span>
                                    </div>

                                    <p className="mt-2 text-base font-semibold tabular-nums text-foreground">
                                        ₹68,000
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                                        +8.4% from last month
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border bg-background p-3">
                                    <div className="flex items-center gap-1.5">
                                        <div
                                            aria-hidden="true"
                                            className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground"
                                        >
                                            <ArrowUp className="size-3" />
                                        </div>

                                        <span className="text-xs text-muted-foreground">
                                            Expenses
                                        </span>
                                    </div>

                                    <p className="mt-2 text-base font-semibold tabular-nums text-foreground">
                                        ₹20,180
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                                        -5.2% from last month
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 rounded-xl border border-border bg-background p-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-foreground">
                                        Spending by category
                                    </p>

                                    <CircleDollarSign
                                        aria-hidden="true"
                                        className="size-3.5 text-muted-foreground"
                                    />
                                </div>

                                <div className="mt-3 space-y-3">
                                    {categoryData.map((category) => (
                                        <div key={category.name}>
                                            <div className="mb-1 flex items-center justify-between">
                                                <span className="text-[11px] text-muted-foreground">
                                                    {category.name}
                                                </span>

                                                <span className="text-[11px] font-medium tabular-nums text-foreground">
                                                    {category.value}
                                                </span>
                                            </div>

                                            <div
                                                aria-hidden="true"
                                                className="h-1 overflow-hidden rounded-full bg-muted"
                                            >
                                                <div
                                                    className="h-full rounded-full bg-primary"
                                                    style={{ width: category.width }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductShowcase;
