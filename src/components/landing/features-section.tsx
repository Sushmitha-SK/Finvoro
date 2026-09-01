import {
    BarChart3,
    Bell,
    ChartPie,
    CircleDollarSign,
    Lightbulb,
    PiggyBank,
    ArrowUpRight,
} from "lucide-react";

const features = [
    {
        icon: CircleDollarSign,
        title: "Transactions",
        description:
            "Keep every income and expense organized with a clear, searchable transaction history.",
    },
    {
        icon: PiggyBank,
        title: "Smart budgets",
        description:
            "Create spending limits and see how you're progressing before you overspend.",
    },
    {
        icon: ChartPie,
        title: "Categories",
        description:
            "Group your spending into meaningful categories and discover where your money goes.",
    },
    {
        icon: BarChart3,
        title: "Financial reports",
        description:
            "Turn your financial activity into clear visual reports that are easy to understand.",
    },
    {
        icon: Lightbulb,
        title: "Smart insights",
        description:
            "Spot spending patterns and meaningful trends without digging through spreadsheets.",
    },
    {
        icon: Bell,
        title: "Notifications",
        description:
            "Stay aware of important financial activity with timely notifications and updates.",
    },
];

export function FeaturesSection() {
    return (
        <section
            id="features"
            className="border-b bg-background"
        >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <div className="max-w-2xl">
                    <p className="text-sm font-medium text-muted-foreground">
                        Everything in one place
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                        Everything you need to understand your money.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                        Finvoro gives you the tools to track, plan, and
                        understand your finances without making money
                        management feel complicated.
                    </p>
                </div>

                <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="group bg-background p-6 transition-colors hover:bg-muted/30 sm:p-7"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex size-10 items-center justify-center rounded-xl border bg-muted/40">
                                        <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                                    </div>

                                    <ArrowUpRight className="size-4 text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                                </div>

                                <h3 className="mt-6 text-base font-semibold">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
