import {
    ArrowRight,
    BarChart3,
    ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ReportsDateFilter } from "@/components/reports/reports-date-filter";
import { FinancialTrend } from "@/components/reports/financial-trend";
import { ReportsSummary } from "@/components/reports/reports-summary";
import { SpendingByCategory } from "@/components/reports/spending-by-category";
import { TransactionInsights } from "@/components/reports/transaction-insights";
import { SmartInsights } from "@/components/reports/smart-insights";
import { ReportsExport } from "@/components/reports/reports-export";

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

function formatReportDate(date: Date) {
    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    ).format(date);
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

    const hasTransactions =
        reportsData.insights.transactionCount > 0;

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Reports
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Understand your financial activity and
                            spending patterns.
                        </p>
                    </div>

                    <ReportsExport />
                </div>

                <ReportsDateFilter />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                        Showing activity from
                    </span>

                    <span className="font-medium text-foreground">
                        {formatReportDate(from)}
                    </span>

                    <span>to</span>

                    <span className="font-medium text-foreground">
                        {formatReportDate(
                            new Date(to.getTime() - 1),
                        )}
                    </span>
                </div>

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

                {!hasTransactions ? (
                    <div className="rounded-xl border bg-card">
                        <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                                <BarChart3 className="size-6 text-primary" />
                            </div>

                            <h2 className="mt-5 text-lg font-semibold">
                                No activity in this period
                            </h2>

                            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                There are no transactions for the
                                selected period. Try another date range
                                or add a transaction to start building
                                your financial reports.
                            </p>

                            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                                <Link
                                    href="/transactions"
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                                >
                                    <ReceiptText className="size-4" />
                                    Add transaction
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <FinancialTrend
                            data={
                                reportsData.financialTrend
                            }
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
                    </>
                )}
            </div>
        </div>
    );
}