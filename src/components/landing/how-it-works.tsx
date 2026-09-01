const steps = [
    {
        number: "01",
        title: "Track",
        description:
            "Add your income and expenses and keep your financial activity organized in one place.",
    },
    {
        number: "02",
        title: "Plan",
        description:
            "Create budgets and categories that match the way you actually spend and save.",
    },
    {
        number: "03",
        title: "Understand",
        description:
            "Use reports and insights to turn your financial activity into better decisions.",
    },
];

export function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="border-b bg-background"
        >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                        How it works
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                        Financial clarity in three simple steps.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                        No spreadsheets. No complicated setup. Just a
                        clearer way to understand your money.
                    </p>
                </div>

                <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-0">
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className="relative px-0 md:px-8 lg:px-12"
                        >
                            {index !== steps.length - 1 && (
                                <div className="absolute left-[calc(50%+50px)] right-0 top-5 hidden h-px bg-border md:block" />
                            )}

                            <div className="relative mx-auto flex size-10 items-center justify-center rounded-full border bg-background text-xs font-semibold">
                                {step.number}
                            </div>

                            <div className="mt-6 text-center">
                                <h3 className="text-base font-semibold">
                                    {step.title}
                                </h3>

                                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

