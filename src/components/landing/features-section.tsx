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
    }).filter(tx => tx.name.toLowerCase().includes(searchQuery.toLowerCase()) || tx.category.toLowerCase().includes(searchQuery.toLowerCase()));

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
                    <span className="text-xs uppercase tracking-widest font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                        Everything in one place
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.15]">
                        Everything you need to <br className="hidden sm:inline" />
                        <span className="text-muted-foreground">understand your money.</span>
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Finvoro gives you the tools to track, plan, and understand your finances without making money management feel complicated.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="group relative bg-card text-card-foreground rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-sm"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="p-2 rounded-xl bg-secondary border border-border text-primary shadow-2xs">
                                        <CircleDollarSign className="size-5" />
                                    </span>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transactions</span>
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                                    Searchable
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                                Keep every income & expense organized.
                            </h3>
                            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                Keep every income and expense organized with a clear, searchable transaction history.
                            </p>
                        </div>

                        <div className="mt-8 bg-secondary/60 rounded-2xl p-5 shadow-2xs">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-border">
                                <div className="relative w-full sm:w-48">
                                    <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search tx..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="flex gap-1 w-full sm:w-auto">
                                    {['all', 'expense', 'income'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setTxFilter(tab)}
                                            className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all capitalize ${txFilter === tab ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-background text-muted-foreground hover:text-foreground border border-border'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2 mt-3">
                                {filteredTransactions.length === 0 ? (
                                    <p className="text-xs text-center py-4 text-muted-foreground">No transactions found.</p>
                                ) : (
                                    filteredTransactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border text-xs">
                                            <div>
                                                <p className="font-semibold text-foreground">{tx.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{tx.category} • {tx.date}</p>
                                            </div>
                                            <span className={`font-bold ${tx.type === 'income' ? 'text-chart-2' : 'text-foreground'}`}>
                                                {tx.amount}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="group relative bg-card text-card-foreground rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-sm"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="p-2 rounded-xl bg-secondary border border-border text-primary shadow-2xs">
                                        <PiggyBank className="size-5" />
                                    </span>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Smart Budgets</span>
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                                    Proactive Control
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                                Set limits & track progression.
                            </h3>
                            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                Create spending limits and see how you&apos;re progressing before you overspend.
                            </p>
                        </div>

                        {/* Interactive UI Mockup inside Card 2 */}
                        <div className="mt-8 bg-secondary/60 rounded-2xl p-5 border border-border shadow-2xs">
                            <div className="flex items-center justify-between pb-3 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-muted-foreground">Category:</span>
                                    <span className="text-xs bg-background border border-border font-medium px-2.5 py-1 rounded-lg text-foreground">{budgetCategory}</span>
                                </div>
                                <div className="flex gap-1">
                                    {['Groceries', 'Dining', 'Shopping'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setBudgetCategory(cat);
                                                setSpentAmount(cat === 'Groceries' ? 380 : cat === 'Dining' ? 290 : 420);
                                                setBudgetLimit(cat === 'Groceries' ? 500 : cat === 'Dining' ? 350 : 450);
                                            }}
                                            className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${budgetCategory === cat ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-background text-muted-foreground hover:text-foreground border border-border'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1.5">
                                    <span>Spent: <strong className="text-foreground">${spentAmount}</strong></span>
                                    <span>Limit: <strong className="text-foreground">${budgetLimit}</strong></span>
                                </div>
                                <div className="w-full bg-background h-3 rounded-full overflow-hidden p-0.5 border border-border">
                                    <motion.div
                                        className={`h-full rounded-full ${spentAmount / budgetLimit > 0.85 ? 'bg-destructive' : 'bg-primary'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (spentAmount / budgetLimit) * 100)}%` }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    />
                                </div>
                                <p className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-chart-2 animate-pulse"></span>
                                    ${budgetLimit - spentAmount} remaining before limit is reached.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        className="group bg-card text-card-foreground rounded-3xl p-8 shadow-sm flex flex-col justify-between"
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
                        className="group bg-card text-card-foreground rounded-3xl p-8 shadow-sm flex flex-col justify-between"
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
                        className="group bg-card text-card-foreground rounded-3xl p-8 shadow-sm flex flex-col justify-between"
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