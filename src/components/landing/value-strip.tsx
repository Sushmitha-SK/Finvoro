import {
    BarChart3,
    Bell,
    PiggyBank,
    Receipt,
} from "lucide-react";

const values = [
    {
        icon: Receipt,
        title: "Track",
        description: "Every transaction in one place",
    },
    {
        icon: PiggyBank,
        title: "Plan",
        description: "Budgets built around your goals",
    },
    {
        icon: BarChart3,
        title: "Understand",
        description: "Clear reports and spending trends",
    },
    {
        icon: Bell,
        title: "Stay informed",
        description: "Important updates when they matter",
    },
];

export function ValueStrip() {
    return (
        <section className="border-b bg-muted/20">
            <div className="mx-auto grid max-w-7xl divide-y px-4 sm:px-6 md:grid-cols-4 md:divide-x md:divide-y-0 lg:px-8">
                {values.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="flex items-center gap-4 px-2 py-6 md:flex-col md:items-start md:px-6 md:py-8"
                        >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
                                <Icon className="size-4 text-muted-foreground" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    {item.title}
                                </p>

                                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

