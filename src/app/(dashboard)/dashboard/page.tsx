import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { InsightsCard } from "@/components/ai/insights-card";
import { BudgetProgressCard } from "@/components/dashboard/budget-progress";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ForecastCard } from "@/components/dashboard/forecast-card";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { HealthScoreCard } from "@/components/dashboard/health-score";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingDonut } from "@/components/dashboard/spending-donut";
import { SubscriptionsCard } from "@/components/dashboard/subscriptions-card";
import { getUserId } from "@/lib/auth";
import { getDashboardData } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
    const userId = await getUserId();

    console.log("USER ID", userId)
    if (!userId) redirect("/sign-in");


    const data = await getDashboardData(userId);

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
            <DashboardHeader monthLabel={data.monthLabel} />

            {!data.hasData ? (
                <DashboardEmptyState />
            ) : (
                <>
                    <KpiCards data={data} />

                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <CashflowChart data={data.cashflow} />
                        </div>
                        <HealthScoreCard health={data.health} />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <InsightsCard
                                scopeKey="dashboard"
                                request={{ scope: "dashboard" }}
                                fallback={data.heuristicInsights}
                            />
                        </div>
                        <ForecastCard data={data} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <SpendingDonut categories={data.spendingCategories} total={data.month.expenses} />
                        <BudgetProgressCard budgets={data.budgets} />
                        <GoalsCard goals={data.goals} />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <RecentTransactions transactions={data.recentTransactions} />
                        </div>
                        <SubscriptionsCard items={data.subscriptions.items} monthlyTotal={data.subscriptions.monthlyTotal} />
                    </div>
                </>
            )}
        </div>
    );
}
