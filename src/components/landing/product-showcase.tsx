'use client'

import assets from "@/assets/assets";
import { categoryData } from "@/config/landing-content";
import { motion } from "framer-motion";
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    CalendarDays,
    ChevronDown,
    CircleDollarSign,
    CreditCard,
    PieChart,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Wallet,
} from "lucide-react";


export function ProductShowcase() {
    return (
        <section className="overflow-hidden border-b bg-muted/20 font-sans">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    <div>
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-accent px-3.5 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
                            <Sparkles className="size-3.5 text-primary" />
                            <span>Financial Clarity Suite</span>
                        </div>

                        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl text-foreground">
                            See where your money goes.
                        </h2>

                        <p className="mt-5 text-base leading-7 text-muted-foreground">
                            Instead of scanning rows of numbers, Finvoro
                            turns your financial activity into simple,
                            meaningful visual information.
                        </p>

                        <div className="mt-8 space-y-5">
                            <div className="flex gap-4">
                                <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-accent text-primary shadow-sm">
                                    <TrendingUp className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-foreground">
                                        Understand trends instantly
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Quickly identify changes in your monthly income and spending patterns.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-accent text-primary shadow-sm">
                                    <ShieldCheck className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-foreground">
                                        Find savings opportunities
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Pinpoint which category consumes the largest portion of your monthly budget.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <button
                                type="button"
                                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
                            >
                                <span>Try Finvoro free</span>
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </button>
                            <span className="text-xs text-muted-foreground font-medium">No credit card required • Instant setup</span>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="flex items-center gap-2 p-3 ">
                                <PieChart className="size-4 text-primary shrink-0" />
                                <span className="text-xs font-semibold text-card-foreground">Analytics</span>
                            </div>
                            <div className="flex items-center gap-2 p-3">
                                <Wallet className="size-4 text-primary shrink-0" />
                                <span className="text-xs font-semibold text-card-foreground">Budgets</span>
                            </div>
                            <div className="flex items-center gap-2 p-3">
                                <CreditCard className="size-4 text-primary shrink-0" />
                                <span className="text-xs font-semibold text-card-foreground">Ledger</span>
                            </div>
                            <div className="flex items-center gap-2 p-3">
                                <CalendarDays className="size-4 text-primary shrink-0" />
                                <span className="text-xs font-semibold text-card-foreground">Reports</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundImage: `url(${assets.heroBackground.src})` }} className="p-8 bg-cover bg-center rounded-[1.5rem] border border-border/80">
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{
                                type: "spring",
                                stiffness: 150,
                                damping: 37,
                                mass: 1
                            }}
                            className="mx-auto relative rounded-[1.5rem] border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-xl sm:p-5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Spending analysis
                                    </p>

                                    <p className="mt-0.5 text-lg font-semibold tracking-tight tabular-nums text-card-foreground">
                                        ₹20,180
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground"
                                >
                                    <CalendarDays className="size-3 text-muted-foreground" />
                                    This month
                                    <ChevronDown className="size-2.5 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="mt-5 h-36 rounded-xl border border-border bg-background p-3">
                                <div className="flex h-full items-end gap-1.5 sm:gap-2">
                                    {[35, 52, 42, 68, 48, 74, 58, 88, 64, 78, 55, 72, 61, 84].map(
                                        (height, index) => (
                                            <div
                                                key={index}
                                                className="flex h-full flex-1 items-end"
                                            >
                                                <div
                                                    className={`w-full rounded-t ${index === 7
                                                        ? "bg-primary"
                                                        : "bg-primary/15"
                                                        }`}
                                                    style={{
                                                        height: `${height}%`,
                                                    }}
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2.5">
                                <div className="rounded-xl border border-border bg-background p-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
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
                                        <div className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
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

                                    <CircleDollarSign className="size-3.5 text-muted-foreground" />
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

                                            <div className="h-1 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full bg-primary"
                                                    style={{
                                                        width: category.width,
                                                    }}
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



