'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CircleDollarSign,
    PiggyBank,
    ChartPie,
    BarChart3,
    Lightbulb,
    ArrowUpRight,
    Search,
    Download,
} from "lucide-react";
import { featureTransactions } from '@/config/landing-content';

export function FeaturesSection() {
    const [txFilter, setTxFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [budgetCategory, setBudgetCategory] = useState('Groceries');
    const [budgetLimit, setBudgetLimit] = useState(500);
    const [spentAmount, setSpentAmount] = useState(380);

    const filteredTransactions = featureTransactions.filter(tx => {
        if (txFilter === 'expense') return tx.type === 'expense';
        if (txFilter === 'income') return tx.type === 'income';
        return true;
    }).filter(tx =>
        tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.type && tx.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <section id="features" className="relative bg-background text-foreground py-24 sm:py-32 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 overflow-hidden">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
                >
                    <span className="inline-block text-xs font-semibold tracking-wider text-primary uppercase">
                        Everything in one place
                    </span>

                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 1 },
                            visible: {
                                transition: {
                                    staggerChildren: 0.015,
                                },
                            },
                        }}
                        className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.15]"
                    >
                        {" Everything you need to understand your money."
                            .split("")
                            .map((char: string, index: number) => (
                                <motion.span
                                    key={index}
                                    variants={{
                                        hidden: { color: "#E4E4E4" },
                                        visible: {
                                            color: "#042718",
                                            transition: { duration: 0.5, ease: "easeOut" as const },
                                        },
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                    </motion.h2>
                    <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                        Finvoro gives you the tools to track, plan, and understand your finances without making money management feel complicated.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="group relative bg-card text-card-foreground rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm border border-border"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="p-2 rounded-xl bg-secondary border border-border text-primary shadow-2xs">
                                        <CircleDollarSign className="size-5" />
                                    </span>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transactions</span>
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/25">
                                    Searchable
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                                Keep every income & expense organized.
                            </h3>
                            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                Keep every income and expense organized with a clear, searchable transaction history.
                            </p>
                        </div>

                        <div className="mt-6 bg-secondary/40 rounded-2xl p-4 border border-border shadow-xs">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 mb-3 border-b border-border">
                                <div className="relative w-full sm:w-52">
                                    <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                                    <div className="flex gap-1 bg-background p-1 rounded-lg border border-border">
                                        {['all', 'income', 'expense'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setTxFilter(tab)}
                                                className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all capitalize ${txFilter === tab ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground text-xs flex items-center gap-1 cursor-pointer">
                                        <Download className="size-3.5" />
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-2 border-b border-border/60">
                                <span className="col-span-5">Description</span>
                                <span className="col-span-4">Category</span>
                                <span className="col-span-3 text-right">Amount</span>
                            </div>

                            <div className="space-y-1.5 mt-2 max-h-65 overflow-y-auto pr-1">
                                {filteredTransactions.length === 0 ? (
                                    <p className="text-xs text-center py-6 text-muted-foreground">No transactions found.</p>
                                ) : (
                                    filteredTransactions.map((tx) => {
                                        const isIncome = tx.type === 'income';
                                        return (
                                            <div key={tx.id} className="grid grid-cols-12 items-center p-2 rounded-xl bg-background border border-border/80 text-xs hover:border-border transition-colors">
                                                <div className="col-span-5 pr-2 truncate">
                                                    <p className="font-medium text-foreground truncate">{tx.name}</p>
                                                    {tx.type && <p className="text-[10px] text-muted-foreground truncate">{tx.type}</p>}
                                                </div>
                                                <div className="col-span-4 flex items-center">
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] bg-secondary border border-border text-foreground font-medium">
                                                        <span className="size-1.5 rounded-full bg-primary"></span>
                                                        {tx.category}
                                                    </span>
                                                </div>
                                                <div className="col-span-3 text-right">
                                                    <span className={`font-semibold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                                                        {isIncome ? `+₹${tx.amount.replace(/[^0-9.]/g, '')}` : `-₹${tx.amount.replace(/[^0-9.]/g, '')}`}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="group relative bg-card text-card-foreground rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm border border-border"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="p-2 rounded-xl bg-secondary border border-border text-primary shadow-2xs">
                                        <PiggyBank className="size-5" />
                                    </span>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Smart Budgets</span>
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/25">
                                    Proactive Control
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                                Set limits & track progression.
                            </h3>
                            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                Create spending limits and see how you&apos;re progressing before you overspend.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            {[
                                {
                                    budgetCategory: "Food & Dining", 
                                    budgetMonth: "Sept 2026",
                                    spentAmount: 2450,
                                    budgetLimit: 3000,
                                    dotColor: "bg-orange-500",
                                    barColor: "bg-orange-500",
                                    badgeText: "Near limit",
                                    badgeClass: "text-orange-600 bg-orange-500/10 border-orange-500/20",
                                    statusType: "near",
                                },

                                {
                                    budgetCategory: "Entertainment",
                                    budgetMonth: "Aug 2026",
                                    spentAmount: 4649,
                                    budgetLimit: 3000,
                                    dotColor: "bg-red-500",
                                    barColor: "bg-red-500",
                                    badgeText: "Limit reached",
                                    badgeClass: "text-red-600 bg-red-500/10 border-red-500/20",
                                    statusType: "over",
                                },
                            ].map((item, index) => {
                                const percentage = Math.min(100, Math.round((item.spentAmount / item.budgetLimit) * 100));
                                const diff = item.budgetLimit - item.spentAmount;

                                return (
                                    <div key={index} className="bg-secondary/40 rounded-2xl p-4 border border-border shadow-xs">
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`size-2 rounded-full ${item.dotColor}`}></span>
                                                <span className="text-xs font-semibold text-foreground">{item.budgetCategory}</span>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background border border-border px-2.5 py-1 rounded-lg">
                                                    <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="M12 6v6l4 2" />
                                                    </svg>
                                                    <span className="text-xs font-medium">{item.budgetMonth}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-foreground">₹{item.spentAmount.toLocaleString()}</span>
                                                <span className="text-xs text-muted-foreground">cap: ₹{item.budgetLimit.toLocaleString()}</span>
                                            </div>
                                            <div className="flex-1 min-w-50 max-w-sm flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center text-xs font-medium">
                                                    <span className="text-muted-foreground">
                                                        {diff >= 0 ? `₹${diff.toLocaleString()} left` : `₹${Math.abs(diff).toLocaleString()} over`}
                                                    </span>
                                                    <span className="text-foreground font-semibold">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-background h-2 rounded-full overflow-hidden border border-border">
                                                    <motion.div
                                                        className={`h-full rounded-full ${item.barColor} text-xs`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(100, (item.spentAmount / item.budgetLimit) * 100)}%` }}
                                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${item.badgeClass}`}>
                                                    {item.statusType === "near" && (
                                                        <svg className="size-3.5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path d="M23 6l-9.5 9.5-5-5L1 18" />
                                                            <path d="M17 6h6v6" />
                                                        </svg>
                                                    )}
                                                    {item.statusType === "safe" && (
                                                        <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <path d="M9 12l2 2 4-4" />
                                                        </svg>
                                                    )}
                                                    {item.statusType === "over" && (
                                                        <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                    {item.badgeText}
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        className="group bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-sm border border-border flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="size-12 rounded-2xl bg-secondary border border-border flex items-center justify-center shadow-2xs text-primary">
                                    <ChartPie className="size-6" />
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">
                                    Organization
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Categories</h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                Group your spending into meaningful categories and discover where your money goes.
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary cursor-pointer">
                            <span>Explore categories</span>
                            <ArrowUpRight className="size-3.5" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                        className="group bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-sm border border-border flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="size-12 rounded-2xl bg-secondary border border-border flex items-center justify-center shadow-2xs text-primary">
                                    <BarChart3 className="size-6" />
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">
                                    Visual Analytics
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Financial reports</h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                Turn your financial activity into clear visual reports that are easy to understand.
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary cursor-pointer">
                            <span>Explore reports</span>
                            <ArrowUpRight className="size-3.5" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                        className="group bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-sm border border-border flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="size-12 rounded-2xl bg-secondary border border-border flex items-center justify-center shadow-2xs text-primary">
                                    <Lightbulb className="size-6" />
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">
                                    AI Powered
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Smart insights</h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                Spot spending patterns and meaningful trends without digging through spreadsheets.
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary cursor-pointer">
                            <span>Explore insights</span>
                            <ArrowUpRight className="size-3.5" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;


