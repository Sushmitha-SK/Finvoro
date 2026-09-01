import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "What is Finvoro?",
        answer:
            "Finvoro is a personal finance platform that helps you track transactions, manage budgets, organize spending, and understand your financial activity through reports and insights.",
    },
    {
        question: "Is Finvoro free to use?",
        answer:
            "Yes. Finvoro can offer a free plan with the essential tools needed to track and organize your finances. You can upgrade when you need additional features.",
    },
    {
        question: "Can I manage my budgets with Finvoro?",
        answer:
            "Yes. You can create budgets, assign spending categories, and monitor how your actual spending compares with your planned limits.",
    },
    {
        question: "How do financial insights work?",
        answer:
            "Finvoro analyzes the financial activity available in your account to surface useful patterns, trends, and observations that can help you understand your spending.",
    },
    {
        question: "Is my financial information secure?",
        answer:
            "Finvoro is designed with account authentication and user-specific data access so your financial information is associated with your own account.",
    },
    {
        question: "Can I change my preferred currency?",
        answer:
            "Yes. Your preferred currency can be managed from Settings and used when displaying your financial information.",
    },
];

export function FAQSection() {
    return (
        <section
            id="faq"
            className="border-b bg-background"
        >
            <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
                <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                        FAQ
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                        Questions, answered.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                        Everything you need to know about using Finvoro.
                    </p>
                </div>

                <div className="mt-10 divide-y rounded-2xl border bg-card px-5 sm:px-6">
                    {faqs.map((faq) => (
                        <details
                            key={faq.question}
                            className="group"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-sm font-medium [&::-webkit-details-marker]:hidden">
                                <span>{faq.question}</span>

                                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                            </summary>

                            <div className="pb-5 pr-8">
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {faq.answer}
                                </p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

