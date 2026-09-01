import {
    ArrowDownLeft,
    ArrowUpRight,
    MoreHorizontal,
    TrendingUp,
    Wallet,
} from "lucide-react";

const transactions = [
    {
        name: "Grocery Store",
        category: "Food & Dining",
        amount: "-₹2,450",
        icon: ArrowUpRight,
    },
    {
        name: "Salary",
        category: "Income",
        amount: "+₹68,000",
        icon: ArrowDownLeft,
    },
    {
        name: "Electricity Bill",
        category: "Utilities",
        amount: "-₹1,840",
        icon: ArrowUpRight,
    },
];

export function DashboardPreview() {
    return (
        <div className="relative mx-auto w-full max-w-5xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/5 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
                {/* Browser bar */}
                <div className="flex h-10 items-center gap-2 border-b bg-muted/40 px-4">
                    <span className="size-2.5 rounded-full bg-border" />
                    <span className="size-2.5 rounded-full bg-border" />
                    <span className="size-2.5 rounded-full bg-border" />

                    <div className="mx-auto hidden h-6 w-64 rounded-md border bg-background sm:block" />
                </div>

                <div className="grid min-h-[500px] grid-cols-1 md:grid-cols-[180px_1fr]">
                    {/* Sidebar */}
                    <aside className="hidden border-r bg-muted/20 p-4 md:block">
                        <div className="mb-8 flex items-center gap-2">
                            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Wallet className="size-4" />
                            </div>

                            <span className="text-sm font-semibold">
                                Finvoro
                            </span>
                        </div>

                        <div className="space-y-1">
                            {[
                                "Dashboard",
                                "Transactions",
                                "Budgets",
                                "Categories",
                                "Reports",
                            ].map((item, index) => (
                                <div
                                    key={item}
                                    className={`rounded - lg px - 3 py - 2 text - xs font - medium ${index === 0
                                            ? "bg-primary/10 text-foreground"
                                            : "text-muted-foreground"
                                        } `}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main dashboard */}
                    <main className="min-w-0 bg-background p-5 sm:p-7">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Overview
                                </p>

                                <h3 className="mt-1 text-lg font-semibold tracking-tight">
                                    Good morning 👋
                                </h3>
                            </div>

                            <button
                                type="button"
                                className="rounded-lg border p-2 text-muted-foreground"
                                aria-label="More options"
                            >
                                <MoreHorizontal className="size-4" />
                            </button>
                        </div>

                        {/* Summary cards */}
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border bg-card p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        Total balance
                                    </span>

                                    <Wallet className="size-4 text-muted-foreground" />
                                </div>

                                <p className="text-xl font-semibold tracking-tight">
                                    ₹84,250
                                </p>

                                <p className="mt-1 text-[11px] text-muted-foreground">
                                    Available balance
                                </p>
                            </div>

                            <div className="rounded-xl border bg-card p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        Income
                                    </span>

                                    <ArrowDownLeft className="size-4" />
                                </div>

                                <p className="text-xl font-semibold tracking-tight">
                                    ₹68,000
                                </p>

                                <p className="mt-1 text-[11px] text-muted-foreground">
                                    This month
                                </p>
                            </div>

                            <div className="rounded-xl border bg-card p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        Spending
                                    </span>

                                    <TrendingUp className="size-4 text-muted-foreground" />
                                </div>

                                <p className="text-xl font-semibold tracking-tight">
                                    ₹24,680
                                </p>

                                <p className="mt-1 text-[11px] text-muted-foreground">
                                    This month
                                </p>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="mt-4 rounded-xl border bg-card p-4">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">
                                        Spending overview
                                    </p>

                                    <p className="text-[11px] text-muted-foreground">
                                        Monthly activity
                                    </p>
                                </div>

                                <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium">
                                    This month
                                </span>
                            </div>

                            <div className="flex h-28 items-end gap-2 sm:gap-4">
                                {[42, 58, 48, 74, 55, 82, 64, 92, 68, 78, 60, 86].map(
                                    (height, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-1 items-end"
                                        >
                                            <div
                                                className={`w - full rounded - t - sm ${index === 7
                                                        ? "bg-primary"
                                                        : "bg-primary/15"
                                                    } `}
                                                style={{
                                                    height: `${height}% `,
                                                }}
                                            />
                                        </div>
                                    ),
                                )}
                            </div>

                            <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
                                <span>Jan</span>
                                <span>Mar</span>
                                <span>May</span>
                                <span>Jul</span>
                                <span>Sep</span>
                                <span>Nov</span>
                            </div>
                        </div>

                        {/* Transactions */}
                        <div className="mt-4 rounded-xl border bg-card p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm font-medium">
                                    Recent transactions
                                </p>

                                <span className="text-[10px] font-medium text-muted-foreground">
                                    View all
                                </span>
                            </div>

                            <div className="space-y-3">
                                {transactions.map((transaction) => {
                                    const Icon = transaction.icon;

                                    return (
                                        <div
                                            key={transaction.name}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                <Icon className="size-3.5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-medium">
                                                    {transaction.name}
                                                </p>

                                                <p className="text-[10px] text-muted-foreground">
                                                    {transaction.category}
                                                </p>
                                            </div>

                                            <span className="text-xs font-medium">
                                                {transaction.amount}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

