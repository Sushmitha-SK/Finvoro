import {
    ArrowDown,
    ArrowUp,
    CalendarDays,
    ChevronDown,
    CircleDollarSign,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

const categoryData = [
    { name: "Food & Dining", value: "₹8,420", width: "78%" },
    { name: "Shopping", value: "₹5,280", width: "52%" },
    { name: "Transport", value: "₹3,640", width: "36%" },
    { name: "Utilities", value: "₹2,840", width: "28%" },
];

export function ProductShowcase() {
    return (
        <section className="overflow-hidden border-b bg-muted/20">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    <div>
                        <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                            Financial clarity
                        </div>

                        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                            See where your money goes.
                        </h2>

                        <p className="mt-5 text-base leading-7 text-muted-foreground">
                            Instead of scanning rows of numbers, Finvoro
                            turns your financial activity into simple,
                            meaningful visual information.
                        </p>

                        <div className="mt-8 space-y-5">
                            <div className="flex gap-3">
                                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background">
                                    <TrendingUp className="size-4" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Understand trends
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Quickly identify changes in your
                                        income and spending.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background">
                                    <TrendingDown className="size-4" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Find opportunities
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        See which areas consume the most
                                        of your monthly budget.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics preview */}
                    <div className="relative">
                        <div className="absolute -inset-8 rounded-full bg-primary/5 blur-3xl" />

                        <div className="relative rounded-2xl border bg-card p-4 shadow-xl sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Spending analysis
                                    </p>

                                    <p className="mt-1 text-xl font-semibold tracking-tight">
                                        ₹20,180
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs font-medium"
                                >
                                    <CalendarDays className="size-3.5" />
                                    This month
                                    <ChevronDown className="size-3" />
                                </button>
                            </div>

                            {/* Main chart */}
                            <div className="mt-8 h-48 rounded-xl border bg-background p-4">
                                <div className="flex h-full items-end gap-2 sm:gap-3">
                                    {[35, 52, 42, 68, 48, 74, 58, 88, 64, 78, 55, 72, 61, 84].map(
                                        (height, index) => (
                                            <div
                                                key={index}
                                                className="flex h-full flex-1 items-end"
                                            >
                                                <div
                                                    className={`w-full rounded-t ${index === 7
                                                            ? "bg-primary"
                                                            : "bg-primary/10"
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

                            {/* Income / expenses */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-xl border bg-background p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-7 items-center justify-center rounded-full bg-muted">
                                            <ArrowDown className="size-3.5" />
                                        </div>

                                        <span className="text-xs text-muted-foreground">
                                            Income
                                        </span>
                                    </div>

                                    <p className="mt-3 text-lg font-semibold">
                                        ₹68,000
                                    </p>

                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                        +8.4% from last month
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-background p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-7 items-center justify-center rounded-full bg-muted">
                                            <ArrowUp className="size-3.5" />
                                        </div>

                                        <span className="text-xs text-muted-foreground">
                                            Expenses
                                        </span>
                                    </div>

                                    <p className="mt-3 text-lg font-semibold">
                                        ₹20,180
                                    </p>

                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                        -5.2% from last month
                                    </p>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mt-4 rounded-xl border bg-background p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                        Spending by category
                                    </p>

                                    <CircleDollarSign className="size-4 text-muted-foreground" />
                                </div>

                                <div className="mt-5 space-y-4">
                                    {categoryData.map((category) => (
                                        <div key={category.name}>
                                            <div className="mb-1.5 flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">
                                                    {category.name}
                                                </span>

                                                <span className="text-xs font-medium">
                                                    {category.value}
                                                </span>
                                            </div>

                                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

