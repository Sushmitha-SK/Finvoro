import { currentUser } from "@clerk/nextjs/server";

import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingCategories } from "@/components/dashboard/spending-categories";
import { SummaryCards } from "@/components/dashboard/summary-cards";

export default async function DashboardPage() {
    const user = await currentUser();

    const firstName = user?.firstName || "there";

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Good morning, {firstName}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Here&apos;s an overview of your finances this month.
                    </p>
                </div>

                <SummaryCards />

                <div className="grid gap-6 lg:grid-cols-2">
                    <SpendingCategories />
                    <BudgetOverview />
                </div>

                <RecentTransactions />
            </div>
        </div>
    );
}