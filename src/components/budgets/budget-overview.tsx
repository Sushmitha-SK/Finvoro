import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    PiggyBank,
    TrendingDown,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { DeleteBudgetDialog } from "./delete-budget-dialog";
import { EditBudgetDialog } from "./edit-budget-dialog";
import { formatCurrency } from "@/lib/format-currency";

type Budget = {
    id: string;
    category: string;
    categoryId: string;
    amount: number;
    spent: number;
    remaining: number;
    percentage: number;
    month: number;
    year: number;
};

type Category = {
    id: string;
    name: string;
};

type BudgetOverviewProps = {
    budgets: Budget[];
    categories: Category[];
    currency: string;
};

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
});

function getBudgetMonth(month: number, year: number) {
    return monthFormatter.format(new Date(year, month - 1, 1));
}

export function BudgetOverview({
    budgets,
    categories,
    currency,
}: BudgetOverviewProps) {
    if (budgets.length === 0) {
        return (
            <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/40 p-8 text-center backdrop-blur-xl shadow-sm">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner mb-4 ring-8 ring-primary/5">
                    <PiggyBank className="size-7" />
                </div>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                    No active budget allocations
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground leading-relaxed">
                    Establish monthly financial guardrails for your categories to maintain predictive cash flow and spending control.
                </p>
            </div>
        );
    }

    const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
    const totalAllocated = budgets.reduce((acc, b) => acc + b.amount, 0);
    const globalPercentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* SaaS Metrics Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-sm">
                <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Budget Limit</span>
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                        {formatCurrency(totalAllocated, currency)}
                    </p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Outflows</span>
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                        {formatCurrency(totalSpent, currency)}
                    </p>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <span>Overall Utilization</span>
                        <span className="text-foreground font-bold">{Math.round(globalPercentage)}%</span>
                    </div>
                    <Progress
                        value={globalPercentage}
                        className="h-2 w-full bg-muted/60"
                        indicatorClassName={globalPercentage > 100 ? "bg-destructive" : "bg-primary"}
                    />
                </div>
            </div>

            {/* Premium Table Container */}
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/40">
                        <TableRow className="hover:bg-transparent border-border/60">
                            <TableHead className="py-4 pl-6 font-semibold text-foreground">Category</TableHead>
                            <TableHead className="py-4 font-semibold text-foreground">Period</TableHead>
                            <TableHead className="py-4 font-semibold text-foreground">Spent / Limit</TableHead>
                            <TableHead className="py-4 font-semibold text-foreground w-[260px]">Progress & Usage</TableHead>
                            <TableHead className="py-4 font-semibold text-foreground">Health Status</TableHead>
                            <TableHead className="py-4 pr-6 text-right font-semibold text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border/40">
                        {budgets.map((budget) => {
                            const isExceeded = budget.spent > budget.amount;
                            const isNearLimit = !isExceeded && budget.percentage >= 80;

                            const progressBarColor = isExceeded
                                ? "bg-destructive"
                                : isNearLimit
                                    ? "bg-amber-500"
                                    : "bg-primary";

                            return (
                                <TableRow 
                                    key={budget.id} 
                                    className={`group transition-all hover:bg-muted/30 border-border/40 ${
                                        isExceeded ? "bg-destructive/[0.02]" : ""
                                    }`}
                                >
                                    <TableCell className="py-4 pl-6 font-semibold text-foreground">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`size-2 rounded-full ${
                                                isExceeded ? "bg-destructive animate-pulse" : isNearLimit ? "bg-amber-500" : "bg-emerald-500"
                                            }`} />
                                            <span className="truncate">{budget.category}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4 text-xs font-medium text-muted-foreground">
                                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md w-fit border border-border/40">
                                            <Clock className="size-3 text-muted-foreground/70" />
                                            {getBudgetMonth(budget.month, budget.year)}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-bold tracking-tight tabular-nums text-foreground">
                                                {formatCurrency(budget.spent, currency)}
                                            </div>
                                            <div className="text-xs text-muted-foreground font-medium tabular-nums">
                                                cap: {formatCurrency(budget.amount, currency)}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="space-y-1.5 w-full">
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className={isExceeded ? "text-destructive font-semibold" : "text-muted-foreground"}>
                                                    {isExceeded
                                                        ? `${formatCurrency(budget.spent - budget.amount, currency)} over`
                                                        : `${formatCurrency(budget.remaining, currency)} left`}
                                                </span>
                                                <span className="tabular-nums font-bold text-foreground">
                                                    {Math.round(budget.percentage)}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={budget.percentage}
                                                indicatorClassName={progressBarColor}
                                                className="h-2 w-full bg-muted/60 rounded-full"
                                            />
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-2xs ${
                                            isExceeded
                                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                                : isNearLimit
                                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        }`}>
                                            {isExceeded ? (
                                                <AlertTriangle className="size-3" />
                                            ) : isNearLimit ? (
                                                <TrendingDown className="size-3" />
                                            ) : (
                                                <CheckCircle2 className="size-3" />
                                            )}
                                            {budget.percentage >= 100
                                                ? "Limit reached"
                                                : isNearLimit
                                                    ? "Near limit"
                                                    : "On track"}
                                        </span>
                                    </TableCell>

                                    <TableCell className="py-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                                            <EditBudgetDialog budget={budget} categories={categories} />
                                            <DeleteBudgetDialog budgetId={budget.id} category={budget.category} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}