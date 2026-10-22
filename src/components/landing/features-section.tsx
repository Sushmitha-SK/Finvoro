'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowUpRight,
    CircleDollarSign,
    Download,
    PiggyBank,
    Search,
} from 'lucide-react';

import { budgets, featureCards, featureTransactions, transactionFilters } from '@/config/landing-content';
import { animationViewport, cardAnimation, sectionAnimation } from '@/lib/motion-variants';


const currency = (amount: number) =>
    `₹${amount.toLocaleString('en-IN')}`;

function ClockIcon() {
    return (
        <svg
            aria-hidden="true"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    );
}

function BudgetStatusIcon({ status }: { status: string }) {
    if (status === 'near') {
        return (
            <svg
                aria-hidden="true"
                className="size-3.5 rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
            >
                <path d="M23 6l-9.5 9.5-5-5L1 18" />
                <path d="M17 6h6v6" />
            </svg>
        );
    }

    if (status === 'over') {
        return (
            <svg
                aria-hidden="true"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
            >
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    }

    return null;
}

export function FeaturesSection() {
    const [txFilter, setTxFilter] =
        useState<(typeof transactionFilters)[number]>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const shouldReduceMotion = useReducedMotion();

    const filteredTransactions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return featureTransactions.filter((tx) => {
            const matchesFilter =
                txFilter === 'all' || tx.type === txFilter;

            const matchesSearch =
                !query ||
                tx.name.toLowerCase().includes(query) ||
                tx.category.toLowerCase().includes(query) ||
                (tx.type?.toLowerCase().includes(query) ?? false);

            return matchesFilter && matchesSearch;
        });
    }, [txFilter, searchQuery]);

    const reveal = shouldReduceMotion
        ? {}
        : {
            initial: 'hidden' as const,
            whileInView: 'visible' as const,
            viewport: animationViewport,
        };

    return (
        <section
            id="features"
            aria-labelledby="features-heading"
            className="relative overflow-hidden bg-background px-4 py-24 font-sans text-foreground transition-colors duration-300 motion-reduce:transition-none sm:px-6 sm:py-32 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                <motion.div
                    {...reveal}
                    variants={sectionAnimation}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mx-auto mb-16 max-w-2xl text-center sm:mb-20"
                >
                    <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary">
                        Everything in one place
                    </span>

                    <h2
                        id="features-heading"
                        className="mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-5xl"
                    >
                        Everything you need to understand your money.
                    </h2>

                    <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                        Finvoro gives you the tools to track, plan, and understand
                        your finances without making money management feel
                        complicated.
                    </p>
                </motion.div>

                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <motion.article
                        {...reveal}
                        variants={cardAnimation}
                        transition={{
                            duration: shouldReduceMotion ? 0 : 0.6,
                            delay: shouldReduceMotion ? 0 : 0.1,
                            ease: 'easeOut',
                        }}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8"
                    >
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span
                                        aria-hidden="true"
                                        className="rounded-xl border border-border bg-secondary p-2 text-primary shadow-2xs"
                                    >
                                        <CircleDollarSign className="size-5" />
                                    </span>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Transactions
                                    </span>
                                </div>

                                <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                                    Searchable
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                Keep every income &amp; expense organized.
                            </h3>

                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Keep every income and expense organized with a clear,
                                searchable transaction history.
                            </p>
                        </div>

                        <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-4 shadow-xs">
                            <div className="mb-3 flex flex-col items-center justify-between gap-3 border-b border-border pb-3 sm:flex-row">
                                <div className="relative w-full sm:w-52">
                                    <Search
                                        aria-hidden="true"
                                        className="absolute left-3 top-2.5 size-3.5 text-muted-foreground"
                                    />

                                    <label
                                        htmlFor="transaction-search"
                                        className="sr-only"
                                    >
                                        Search transactions by name, category, or type
                                    </label>

                                    <input
                                        id="transaction-search"
                                        type="search"
                                        autoComplete="off"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(event.target.value)
                                        }
                                        className="min-h-9 w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    />
                                </div>

                                <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                                    <div
                                        role="group"
                                        aria-label="Filter transactions"
                                        className="flex gap-1 rounded-lg border border-border bg-background p-1"
                                    >
                                        {transactionFilters.map((tab) => (
                                            <button
                                                key={tab}
                                                type="button"
                                                aria-pressed={txFilter === tab}
                                                onClick={() => setTxFilter(tab)}
                                                className={`min-h-8 rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${txFilter === tab
                                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    <span
                                        aria-hidden="true"
                                        className="flex items-center gap-1 rounded-lg border border-border bg-background p-1.5 text-xs text-muted-foreground"
                                    >
                                        <Download className="size-3.5" />
                                    </span>
                                </div>
                            </div>

                            <div
                                role="table"
                                aria-label="Transaction history"
                                aria-colcount={3}
                                className="text-xs"
                            >
                                <div
                                    role="row"
                                    className="grid grid-cols-12 border-b border-border/60 px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                                >
                                    <span role="columnheader" className="col-span-5">
                                        Description
                                    </span>
                                    <span role="columnheader" className="col-span-4">
                                        Category
                                    </span>
                                    <span
                                        role="columnheader"
                                        className="col-span-3 text-right"
                                    >
                                        Amount
                                    </span>
                                </div>

                                <div className="mt-2 max-h-65 space-y-1.5 overflow-y-auto pr-1">
                                    {filteredTransactions.length === 0 ? (
                                        <p
                                            role="status"
                                            aria-live="polite"
                                            className="py-6 text-center text-xs text-muted-foreground"
                                        >
                                            No transactions found.
                                        </p>
                                    ) : (
                                        filteredTransactions.map((tx) => {
                                            const isIncome = tx.type === 'income';
                                            const amount = tx.amount.replace(
                                                /[^0-9.]/g,
                                                '',
                                            );

                                            return (
                                                <div
                                                    key={tx.id}
                                                    role="row"
                                                    className="grid grid-cols-12 items-center rounded-xl border border-border/80 bg-background p-2 text-xs transition-colors hover:border-border motion-reduce:transition-none"
                                                >
                                                    <div
                                                        role="cell"
                                                        className="col-span-5 min-w-0 pr-2"
                                                    >
                                                        <p className="truncate font-medium text-foreground">
                                                            {tx.name}
                                                        </p>
                                                        {tx.type && (
                                                            <p className="truncate text-[10px] text-muted-foreground">
                                                                {tx.type}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div
                                                        role="cell"
                                                        className="col-span-4 flex min-w-0 items-center"
                                                    >
                                                        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">
                                                            <span
                                                                aria-hidden="true"
                                                                className="size-1.5 shrink-0 rounded-full bg-primary"
                                                            />
                                                            <span className="truncate">
                                                                {tx.category}
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div
                                                        role="cell"
                                                        className="col-span-3 min-w-0 text-right"
                                                    >
                                                        <span
                                                            className={`font-semibold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}
                                                        >
                                                            {isIncome ? '+' : '-'}₹{amount}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.article>

                    <motion.article
                        {...reveal}
                        variants={cardAnimation}
                        transition={{
                            duration: shouldReduceMotion ? 0 : 0.6,
                            delay: shouldReduceMotion ? 0 : 0.2,
                            ease: 'easeOut',
                        }}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8"
                    >
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span
                                        aria-hidden="true"
                                        className="rounded-xl border border-border bg-secondary p-2 text-primary shadow-2xs"
                                    >
                                        <PiggyBank className="size-5" />
                                    </span>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Smart Budgets
                                    </span>
                                </div>

                                <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                                    Proactive Control
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                Set limits &amp; track progression.
                            </h3>

                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Create spending limits and see how you&apos;re
                                progressing before you overspend.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            {budgets.map((item) => {
                                const rawPercentage =
                                    (item.spentAmount / item.budgetLimit) * 100;
                                const percentage = Math.round(
                                    Math.min(100, rawPercentage),
                                );
                                const diff = item.budgetLimit - item.spentAmount;

                                return (
                                    <div
                                        key={item.budgetCategory}
                                        className="rounded-2xl border border-border bg-secondary/40 p-4 shadow-xs"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span
                                                    aria-hidden="true"
                                                    className={`size-2 shrink-0 rounded-full ${item.dotColor}`}
                                                />

                                                <span className="text-xs font-semibold text-foreground">
                                                    {item.budgetCategory}
                                                </span>

                                                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                                                    <ClockIcon />
                                                    <span className="whitespace-nowrap text-xs font-medium">
                                                        {item.budgetMonth}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-foreground">
                                                    {currency(item.spentAmount)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    cap: {currency(item.budgetLimit)}
                                                </span>
                                            </div>

                                            <div className="flex min-w-50 flex-1 flex-col gap-1.5">
                                                <div className="flex items-center justify-between text-xs font-medium">
                                                    <span className="text-muted-foreground">
                                                        {diff >= 0
                                                            ? `${currency(diff)} left`
                                                            : `${currency(Math.abs(diff))} over`}
                                                    </span>
                                                    <span className="font-semibold text-foreground">
                                                        {percentage}%
                                                    </span>
                                                </div>

                                                <div
                                                    role="progressbar"
                                                    aria-label={`${item.budgetCategory} budget used`}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-valuenow={percentage}
                                                    aria-valuetext={`${Math.round(rawPercentage)}% of budget spent`}
                                                    className="h-2 w-full overflow-hidden rounded-full border border-border bg-background"
                                                >
                                                    <motion.div
                                                        className={`h-full rounded-full ${item.barColor}`}
                                                        initial={
                                                            shouldReduceMotion ? false : { width: 0 }
                                                        }
                                                        whileInView={{
                                                            width: `${percentage}%`,
                                                        }}
                                                        viewport={{ once: true }}
                                                        transition={{
                                                            duration: shouldReduceMotion ? 0 : 0.5,
                                                            ease: 'easeInOut',
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${item.badgeClass}`}
                                                >
                                                    <BudgetStatusIcon status={item.statusType} />
                                                    {item.badgeText}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.article>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {featureCards.map(
                        ({ title, description, label, action, Icon }, index) => (
                            <motion.article
                                key={title}
                                {...reveal}
                                variants={cardAnimation}
                                transition={{
                                    duration: shouldReduceMotion ? 0 : 0.5,
                                    delay: shouldReduceMotion ? 0 : 0.1 * (index + 1),
                                    ease: 'easeOut',
                                }}
                                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8"
                            >
                                <div>
                                    <div className="mb-6 flex items-center justify-between">
                                        <span
                                            aria-hidden="true"
                                            className="flex size-12 items-center justify-center rounded-2xl border border-border bg-secondary text-primary shadow-2xs"
                                        >
                                            <Icon className="size-6" />
                                        </span>

                                        <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            {label}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-foreground">
                                        {title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {description}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary">
                                    <span>{action}</span>
                                    <ArrowUpRight
                                        aria-hidden="true"
                                        className="size-3.5"
                                    />
                                </div>
                            </motion.article>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;

