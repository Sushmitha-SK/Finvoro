import {
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Lightbulb,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

const insights = [
    {
        icon: TrendingDown,
        label: "Spending trend",
        title: "Dining expenses are trending down",
        description:
            "Your dining spending is 18% lower than your previous month.",
        type: "positive",
    },
    {
        icon: Lightbulb,
        label: "Smart observation",
        title: "Subscriptions could be optimized",
        description:
            "Recurring subscriptions account for a noticeable part of your monthly spending.",
        type: "neutral",
    },
    {
        icon: TrendingUp,
        label: "Budget alert",
        title: "Shopping is approaching its limit",
        description:
            "You've used 82% of your shopping budget this month.",
        type: "warning",
    },
];

export function SmartInsightsSection() {
    return (
        <section
            id="insights"
            className="border-b bg-muted/20"
        >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                    {/* Copy */}
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium">
                            <BrainCircuit className="size-3.5" />
                            Financial intelligence
                        </div>

                        <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
                            Don't just track your money.
                            <br className="hidden sm:block" />
                            Understand it.
                        </h2>

                        <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                            Finvoro helps turn financial activity into
                            useful observations, so you can recognize
                            patterns and make more informed decisions.
                        </p>

                        <div className="mt-8 space-y-4">
                            {[
                                "Identify spending patterns",
                                "Monitor budget performance",
                                "Understand financial trends",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" />

                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <a
                            href="#features"
                            className="mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-muted-foreground"
                        >
                            Explore Finvoro features
                            <ArrowRight className="size-4" />
                        </a>
                    </div>

                    {/* Insight cards */}
                    <div className="space-y-4">
                        {insights.map((insight) => {
                            const Icon = insight.icon;

                            return (
                                <div
                                    key={insight.title}
                                    className="rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-muted/50">
                                            <Icon className="size-5 text-muted-foreground" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    {insight.label}
                                                </p>

                                                <span className="size-1 rounded-full bg-border" />

                                                <span className="text-[11px] text-muted-foreground">
                                                    Finvoro insight
                                                </span>
                                            </div>

                                            <h3 className="mt-2 text-sm font-semibold sm:text-base">
                                                {insight.title}
                                            </h3>

                                            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                                {insight.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

