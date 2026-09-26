"use client";

import { values } from "@/config/landing-content";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
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
            stiffness: 80,
            damping: 18,
            mass: 0.9,
        },
    },
};

export function ValueStrip() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-w-2xl text-center mb-16 space-y-3"
            >
                <span className="inline-block text-xs font-semibold tracking-wider text-primary uppercase">
                    Your Money. Your Clarity.
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Don't just track your money. Understand it.
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Everything you need to manage transactions, intelligent budgets, and financial reports in one beautiful workspace.
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start"
            >
                {values.map((item, index) => {
                    const isOffset = index === 1 || index === 3;

                    return (
                        <motion.div
                            key={item.title}
                            variants={itemVariants}
                            className={`group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-xs transition-colors duration-300 ${
                                isOffset ? "lg:translate-y-10" : ""
                            }`}
                        >
                            <div className="space-y-4">
                                <div className="relative flex h-50 w-full flex-col items-center justify-between rounded-2xl bg-accent/40 border border-border/60 p-4 overflow-hidden">
                                    {index === 0 && (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0.85, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                                className="self-end rounded-full bg-card px-2.5 py-0.5 text-[10px] font-medium text-primary shadow-xs border border-border"
                                            >
                                                ✓ Synced live
                                            </motion.div>
                                            <div className="w-full space-y-1.5">
                                                <div className="bg-card rounded-lg p-2 shadow-xs border border-border flex items-center justify-between">
                                                    <div className="h-1.5 w-12 bg-muted-foreground/30 rounded-full" />
                                                    <div className="text-[10px] font-semibold text-foreground">-$42.50</div>
                                                </div>
                                                <div className="bg-card rounded-lg p-2 shadow-xs border border-border flex items-center justify-between">
                                                    <div className="h-1.5 w-16 bg-muted-foreground/30 rounded-full" />
                                                    <div className="text-[10px] font-semibold text-primary">+$1,200.00</div>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold tracking-tight text-foreground">100%</p>
                                                <p className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">ALL TRANSACTIONS</p>
                                            </div>
                                        </>
                                    )}

                                    {index === 1 && (
                                        <>
                                            <div className="w-full bg-card rounded-xl p-2.5 shadow-xs border border-border space-y-2">
                                                <div className="flex justify-between text-[9px] font-semibold text-muted-foreground">
                                                    <span>SAVINGS GOAL</span>
                                                    <span className="text-primary">78%</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: "80%" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                                        className="h-full bg-primary rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold tracking-tight text-foreground">$2,450</p>
                                                <p className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">SAVED THIS MONTH</p>
                                            </div>
                                        </>
                                    )}

                                    {index === 2 && (
                                        <>
                                            <div className="flex items-end gap-1.5 h-16 w-full px-2 justify-between">
                                                {[40, 65, 35, 80, 50, 90, 75].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: 0 }}
                                                        whileInView={{ height: `${h}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ 
                                                            duration: 0.8, 
                                                            delay: 0.08 * i, 
                                                            type: "spring", 
                                                            stiffness: 100, 
                                                            damping: 12 
                                                        }}
                                                        className="w-full bg-primary rounded-t-xs"
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold tracking-tight text-foreground">Clear Trends</p>
                                                <p className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">SPENDING INSIGHTS</p>
                                            </div>
                                        </>
                                    )}

                                    {index === 3 && (
                                        <>
                                            <div className="w-full bg-card rounded-xl p-2.5 shadow-xs border border-border flex items-center space-x-2">
                                                <div className="size-2 rounded-full bg-primary animate-pulse" />
                                                <div className="space-y-1 flex-1">
                                                    <div className="h-1.5 w-3/4 bg-muted-foreground/30 rounded-full" />
                                                    <div className="h-1.5 w-1/2 bg-muted-foreground/30 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold tracking-tight text-foreground">Real-time</p>
                                                <p className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">SMART ALERTS</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="space-y-1.5 px-1 pb-1">
                                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}