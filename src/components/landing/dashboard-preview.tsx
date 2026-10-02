"use client";

import assets from "@/assets/assets";
import { previewNavItems, scoreItems } from "@/config/landing-content";
import { motion, useReducedMotion } from "framer-motion";
import {
    Bell,
    Eye,
    Search,
    Settings,
    Sparkles,
    TrendingDown,
    TrendingUp,
    Wallet,
    Info,
    CircleDollarSignIcon,
    PanelLeftIcon,
    Sun,
    PiggyBank,
} from "lucide-react";
import Image from "next/image";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const scrollTransform = {
    from: {
        opacity: 1,
        scale: 0.8,
        rotateX: 20,
        x: 0,
        y: -80,
    },
    to: {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        x: 0,
        y: 0,
    },
    transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 100,
        mass: 1,
    },
};

export function DashboardPreview() {
    const reduceMotion = useReducedMotion();

    return (
        <div
            className="mx-auto w-full max-w-6xl"
            style={{ perspective: "1400px" }}
        >
            <motion.div
                className="relative will-change-transform"
                initial={reduceMotion ? false : scrollTransform.from}
                whileInView={scrollTransform.to}
                viewport={{ once: true, amount: 0.15 }}
                transition={scrollTransform.transition}
                style={{ transformOrigin: "center center" }}
            >
                <div className="absolute -inset-8 rounded-[2.5rem] bg-primary/5 blur-3xl" />

                <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10">
                    <div className="flex h-10 items-center gap-2 border-b bg-muted/40 px-4">
                        <span className="size-2.5 rounded-full bg-border" />
                        <span className="size-2.5 rounded-full bg-border" />
                        <span className="size-2.5 rounded-full bg-border" />
                    </div>
                    <div className="flex">
                        <aside className="hidden w-46.25 shrink-0 border-r bg-card lg:flex lg:flex-col">
                         
                            <div className="flex h-14.5 items-center gap-2.5 px-4">
                                <Image
                                    src={assets.logo.src}
                                    alt="Finvoro"
                                    width={100}
                                    height={28}
                                    className="h-7 w-auto object-contain block dark:hidden group-data-[collapsible=icon]:hidden"
                                    priority
                                />
                                <Image
                                    src={assets.logoDark.src}
                                    alt="Finvoro"
                                    width={100}
                                    height={28}
                                    className="h-7 w-auto object-contain hidden dark:block group-data-[collapsible=icon]:hidden"
                                    priority
                                />
                            </div>

                            <div className="flex-1 px-3 py-5">
                                <p className="mb-2 px-2 text-[8px] font-medium uppercase tracking-wider text-muted-foreground text-left">
                                    Overview
                                </p>

                                <nav className="space-y-0.5">
                                    {previewNavItems.map((item, index) => {
                                        const Icon = item.icon;

                                        return (
                                            <div
                                                key={item.label}
                                                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] font-medium ${index === 0
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground"
                                                    }`}
                                            >
                                                <Icon className="size-3.5" />
                                                {item.label}
                                            </div>
                                        );
                                    })}
                                </nav>
                                <p className="mb-2 mt-7 px-2 text-[8px] font-medium uppercase tracking-wider text-muted-foreground text-left">
                                    Intelligence
                                </p>

                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] text-muted-foreground">
                                        <Sparkles className="size-3.5" />
                                        Ai Copilot
                                    </div>
                                </div>

                                <p className="mb-2 mt-7 px-2 text-[8px] font-medium uppercase tracking-wider text-muted-foreground text-left">
                                    General
                                </p>

                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] text-muted-foreground">
                                        <Bell className="size-3.5" />
                                        Notifications
                                    </div>

                                    <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] text-muted-foreground">
                                        <Settings className="size-3.5" />
                                        Settings
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 text-left">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-medium">
                                        H
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-[9px] font-medium">
                                            John Doe
                                        </p>
                                        <p className="truncate text-[8px] text-muted-foreground">
                                            john@yourmail.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                        <div className="min-w-0 flex-1">
                            <header className="flex h-14.5 items-center gap-3 border-b border-border bg-background px-4 sm:px-5">
                                <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                                    <PanelLeftIcon className="size-3" />
                                    <span>|</span>
                                    <span className="font-medium text-foreground">
                                        Dashboard
                                    </span>
                                </div>
                                <div className="mx-auto hidden h-7 w-64 items-center gap-2 rounded-lg border bg-muted/20 px-2.5 text-[9px] text-muted-foreground md:flex">
                                    <Search className="size-3" />
                                    <span>
                                        Search transactions, pages...
                                    </span>

                                    <span className="ml-auto rounded border bg-background px-1 py-0.5 text-[7px]">
                                        ⌘&nbsp;K
                                    </span>
                                </div>

                                <div className="ml-auto flex items-center gap-3 text-muted-foreground">
                                    <Sparkles className="size-3.5" />
                                    <Eye className="size-3.5" />
                                    <Sun className="size-3.5" />
                                    <Bell className="size-3.5" />

                                    <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <span className="text-[8px] font-semibold">
                                            J
                                        </span>
                                    </div>
                                </div>
                            </header>

                            <main className="bg-muted/20 p-4 sm:p-5">
                                <div className="mb-4 flex items-end justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-left">
                                            Good afternoon, John
                                        </h2>

                                        <p className="mt-1 text-[9px] text-muted-foreground">
                                            Here&apos;s your financial picture
                                            for October 2026.
                                        </p>
                                    </div>
                                    <div className="hidden items-center gap-2 sm:flex">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1 text-[9px] font-medium text-primary hover:bg-primary/10"
                                        >
                                            <Sparkles className="size-3" />
                                            Ask Copilot
                                        </button>

                                        <button
                                            type="button"
                                            className="hidden items-center gap-1 rounded-lg bg-primary px-3 py-1 text-[9px] font-medium text-primary-foreground sm:flex"
                                        >
                                            <span className="text-sm">+</span>
                                            Add transaction
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
                                    <SummaryCard
                                        title="Total balance"
                                        value="₹1,40,217"
                                        subtitle="vs last month"
                                        icon={Wallet}
                                        chartData={[
                                            { v: 20 },
                                            { v: 25 },
                                            { v: 30 },
                                            { v: 45 },
                                            { v: 60 },
                                            { v: 75 },
                                            { v: 85 },
                                            { v: 95 },
                                        ]}
                                        tone="blue"
                                        badge="↗ +₹72K"
                                    />

                                    <SummaryCard
                                        title="Income"
                                        value="₹75,000"
                                        subtitle="vs last month"
                                        icon={TrendingUp}
                                        chartData={[
                                            { v: 20 },
                                            { v: 20 },
                                            { v: 20 },
                                            { v: 20 },
                                            { v: 70 },
                                            { v: 20 },
                                            { v: 45 },
                                            { v: 75 },
                                        ]}
                                        tone="green"
                                    />

                                    <SummaryCard
                                        title="Expenses"
                                        value="₹3,024"
                                        subtitle="vs last month"
                                        icon={TrendingDown}
                                        chartData={[
                                            { v: 20 },
                                            { v: 20 },
                                            { v: 20 },
                                            { v: 65 },
                                            { v: 25 },
                                            { v: 20 },
                                            { v: 18 },
                                        ]}
                                        tone="red"
                                        badge="↗ -42%"
                                    />

                                    <SummaryCard
                                        title="Savings rate"
                                        value="96%"
                                        subtitle="vs last month"
                                        icon={PiggyBank}
                                        chartData={[
                                            { v: 20 },
                                            { v: 20 },
                                            { v: 20 },
                                            { v: 20 },
                                            { v: 85 },
                                            { v: 50 },
                                            { v: 95 },
                                        ]}
                                        tone="purple"
                                    />
                                </div>

                                <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_265px]">
                                    <section className="rounded-xl border bg-card p-4 text-left">
                                        <div className="mb-4">
                                            <h3 className="text-xs font-semibold">
                                                Cash flow
                                            </h3>

                                            <p className="mt-1 text-[8px] text-muted-foreground">
                                                Income vs expenses over the last
                                                6 months
                                            </p>
                                        </div>

                                        <div className="relative h-48">
                                            <div className="absolute inset-0 flex flex-col justify-between">
                                                {["₹1L", "₹75K", "₹50K", "₹25K", "₹0"].map(
                                                    (label) => (
                                                        <div
                                                            key={label}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span className="w-7 text-right text-[7px] text-muted-foreground">
                                                                {label}
                                                            </span>
                                                            <div className="h-px flex-1 border-t border-dashed border-border" />
                                                        </div>
                                                    ),
                                                )}
                                            </div>

                                            <svg
                                                viewBox="0 0 700 220"
                                                preserveAspectRatio="none"
                                                className="absolute bottom-4 left-9 right-0 h-43.75 w-[calc(100%-36px)]"
                                                aria-label="Cash flow chart"
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="incomeFill"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="currentColor"
                                                            stopOpacity="0.25"
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="currentColor"
                                                            stopOpacity="0"
                                                        />
                                                    </linearGradient>

                                                    <linearGradient
                                                        id="expenseFill"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="currentColor"
                                                            stopOpacity="0.16"
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="currentColor"
                                                            stopOpacity="0"
                                                        />
                                                    </linearGradient>
                                                </defs>

                                         
                                                <path
                                                    d="M0 190 C100 190 130 190 175 190 C215 190 225 130 270 90 C315 50 335 10 365 12 C410 14 440 100 480 155 C520 180 580 190 700 190 L700 220 L0 220 Z"
                                                    className="fill-primary/15 text-primary"
                                                />

                                                <path
                                                    d="M0 190 C130 190 170 190 220 190 C270 190 285 160 320 145 C355 130 380 145 410 152 C460 165 500 185 700 190 L700 220 L0 220 Z"
                                                    className="fill-destructive/10 text-destructive"
                                                />

                                              
                                                <path
                                                    d="M0 190 C100 190 130 190 175 190 C215 190 225 130 270 90 C315 50 335 10 365 12 C410 14 440 100 480 155 C520 180 580 190 700 190"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="text-primary"
                                                />

                                               
                                                <path
                                                    d="M0 190 C130 190 170 190 220 190 C270 190 285 160 320 145 C355 130 380 145 410 152 C460 165 500 185 700 190"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="text-destructive"
                                                />
                                            </svg>

                                       
                                            <div className="absolute bottom-0 left-9 right-0 flex justify-between text-[7px] text-muted-foreground">
                                                <span>May 26</span>
                                                <span>Jun 26</span>
                                                <span>Jul 26</span>
                                                <span>Aug 26</span>
                                                <span>Sept 26</span>
                                                <span>Oct 26</span>
                                            </div>
                                        </div>
                                    </section>

                        
                                    <section className="rounded-xl border bg-card p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xs font-semibold">
                                                    Financial health
                                                </h3>

                                                <p className="mt-1 text-[8px] text-muted-foreground">
                                                    Based on this month so far
                                                </p>
                                            </div>

                                            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                                <TrendingUp className="size-3.5" />
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center gap-4">
                                       
                                            <div className="relative flex size-16 items-center justify-center">
                                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                                    <path
                                                        className="text-muted"
                                                        strokeWidth="3.5"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    />
                                                    <path
                                                        className="text-emerald-500"
                                                        strokeDasharray="90, 100"
                                                        strokeWidth="3.5"
                                                        strokeLinecap="round"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                    <p className="text-sm font-semibold leading-none">
                                                        90
                                                    </p>
                                                    <p className="mt-0.5 text-[5px] uppercase text-muted-foreground">
                                                        OUT OF 100
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-left">
                                                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[7px] font-medium text-emerald-600">
                                                    Excellent
                                                </span>

                                                <p className="mt-2 text-[7px] leading-relaxed text-muted-foreground">
                                                    A simple, transparent
                                                    snapshot of your financial
                                                    habits — not a credit score.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="my-4 border-t" />

                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="text-[8px] font-medium uppercase text-muted-foreground">
                                                Score breakdown
                                            </p>
                                            <span className="text-[7px] text-muted-foreground">
                                                4 factors
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {scoreItems.map((item) => (
                                                <div key={item.label}>
                                                    <div className="mb-1 flex items-center justify-between text-[7px]">
                                                        <span className="flex items-center gap-1">
                                                            {item.label}
                                                            <Info className="size-2.5 text-muted-foreground" />
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            {item.value}
                                                        </span>
                                                    </div>

                                                    <div className="h-1 rounded-full bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-emerald-500"
                                                            style={{
                                                                width: `${item.progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

type SummaryCardProps = {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ElementType;
    chartData: { v: number }[];
    tone: "blue" | "green" | "red" | "purple";
    badge?: string;
};

function SummaryCard({
    title,
    value,
    subtitle,
    icon: Icon,
    chartData,
    tone,
    badge,
}: SummaryCardProps) {
    const toneConfig = {
        blue: {
            stroke: "#0ea5e9",
            fill: "rgba(14, 165, 233, 0.15)",
        },
        green: {
            stroke: "#10b981",
            fill: "rgba(16, 185, 129, 0.15)",
        },
        red: {
            stroke: "#f43f5e",
            fill: "rgba(244, 63, 94, 0.15)",
        },
        purple: {
            stroke: "#8b5cf6",
            fill: "rgba(139, 92, 246, 0.15)",
        },
    };

    const currentTone = toneConfig[tone];

    return (
        <div className="rounded-lg border bg-card p-2 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between">
                    <span className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {title}
                    </span>

                    <div className="flex size-7 items-center justify-center rounded-lg bg-muted/70">
                        <Icon className="size-3.5 text-muted-foreground" />
                    </div>
                </div>

                <div className="mt-3">
                    <p className="text-base font-semibold tracking-tight text-foreground text-left">
                        {value}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
                <div className="flex flex-col gap-1 pb-0.5">
                    {badge ? (
                        <span className="inline-flex w-fit rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[6px] font-medium text-emerald-600">
                            {badge}
                        </span>
                    ) : null}
                    <span className="text-[7px] text-muted-foreground">
                        {subtitle}
                    </span>
                </div>

                <div className="h-9 w-20 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id={`gradient-${tone}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={currentTone.stroke} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={currentTone.stroke} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="v"
                                stroke={currentTone.stroke}
                                strokeWidth={1.5}
                                fillOpacity={1}
                                fill={`url(#gradient-${tone})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}