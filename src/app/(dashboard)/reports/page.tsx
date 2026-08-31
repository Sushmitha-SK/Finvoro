import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ReportsDateFilter } from "@/components/reports/reports-date-filter";
import { FinancialTrend } from "@/components/reports/financial-trend";
import { ReportsSummary } from "@/components/reports/reports-summary";
import { SpendingByCategory } from "@/components/reports/spending-by-category";
import { TransactionInsights } from "@/components/reports/transaction-insights";
import { SmartInsights } from "@/components/reports/smart-insights";

import { getReportsData } from "@/lib/reports-data";

type ReportsPageProps = {
    searchParams: Promise<{
        preset?: string;
        from?: string;
        to?: string;
    }>;
};

function getDateRange(
    preset: string | undefined,
    fromValue?: string,
    toValue?: string,
) {
    const now = new Date();

    switch (preset) {
        case "last-month": {
            return {
                from: new Date(
                    now.getFullYear(),
                    now.getMonth() - 1,
                    1,
                ),
                to: new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1,
                ),
            };
        }

        case "last-3-months": {
            return {
                from: new Date(
                    now.getFullYear(),
                    now.getMonth() - 2,
                    1,
                ),
                to: new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    1,
                ),
            };
        }

        case "this-year": {
            return {
                from: new Date(
                    now.getFullYear(),
                    0,
                    1,
                ),
                to: new Date(
                    now.getFullYear() + 1,
                    0,
                    1,
                ),
            };
        }

        case "custom": {
            const from = parseDate(fromValue);
            const to = parseDate(toValue);

            if (from && to && from <= to) {
                return {
                    from,
                    to: new Date(
                        to.getFullYear(),
                        to.getMonth(),
                        to.getDate() + 1,
                    ),
                };
            }

            break;
        }

        case "this-month":
        default:
            break;
    }

    return {
        from: new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
        ),
        to: new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1,
        ),
    };
}

function parseDate(
    value: string | undefined,
) {
    if (!value) {
        return null;
    }

    const date = new Date(`${value}T00:00:00`);

    return Number.isNaN(date.getTime())
        ? null
        : date;
}

export default async function ReportsPage({
    searchParams,
}: ReportsPageProps) {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const params = await searchParams;

    const { from, to } = getDateRange(
        params.preset,
        params.from,
        params.to,
    );

    const reportsData =
        await getReportsData(user.id, {
            from,
            to,
        });

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Reports
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Understand your financial activity and
                        spending patterns.
                    </p>
                </div>

                <ReportsDateFilter />

                <ReportsSummary
                    totalIncome={
                        reportsData.totalIncome
                    }
                    totalExpenses={
                        reportsData.totalExpenses
                    }
                    netBalance={
                        reportsData.netBalance
                    }
                    savingsRate={
                        reportsData.savingsRate
                    }
                />

                <SmartInsights
                    totalIncome={
                        reportsData.totalIncome
                    }
                    totalExpenses={
                        reportsData.totalExpenses
                    }
                    savingsRate={
                        reportsData.savingsRate
                    }
                    incomeChange={
                        reportsData.comparison.incomeChange
                    }
                    expenseChange={
                        reportsData.comparison.expenseChange
                    }
                    savingsRateChange={
                        reportsData.comparison.savingsRateChange
                    }
                    previousIncome={
                        reportsData.comparison.previousIncome
                    }
                    previousExpenses={
                        reportsData.comparison.previousExpenses
                    }
                />

                <FinancialTrend
                    data={reportsData.financialTrend}
                />

                <TransactionInsights
                    transactionCount={
                        reportsData.insights.transactionCount
                    }
                    averageTransaction={
                        reportsData.insights.averageTransaction
                    }
                    averageExpense={
                        reportsData.insights.averageExpense
                    }
                    largestIncome={
                        reportsData.insights.largestIncome
                    }
                    largestExpense={
                        reportsData.insights.largestExpense
                    }
                    topSpendingCategory={
                        reportsData.insights.topSpendingCategory
                    }
                    highestSpendingDay={
                        reportsData.insights.highestSpendingDay
                    }
                />

                <SpendingByCategory
                    categories={
                        reportsData.spendingByCategory
                    }
                />
            </div>
        </div>
    );
}