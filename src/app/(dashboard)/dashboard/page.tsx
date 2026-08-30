import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingCategories } from "@/components/dashboard/spending-categories";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const dashboardData =
        await getDashboardData(user.id);

    const firstName =
        user.firstName || "there";

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Good morning, {firstName}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Here&apos;s an overview of your
                        finances this month.
                    </p>
                </div>

                <SummaryCards
                    financialSummary={
                        dashboardData.financialSummary
                    }
                />

                <div className="grid gap-6 lg:grid-cols-2">
                    <SpendingCategories
                        spendingCategories={
                            dashboardData.spendingCategories
                        }
                    />

                    <BudgetOverview
                        budgets={
                            dashboardData.budgets
                        }
                    />
                </div>

                <RecentTransactions
                    transactions={
                        dashboardData.recentTransactions
                    }
                />
            </div>
        </div>
    );
}
