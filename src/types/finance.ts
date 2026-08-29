export type TransactionType = "income" | "expense";

export type Transaction = {
    id: string;
    description: string;
    category: string;
    type: TransactionType;
    amount: number;
    date: string;
};

export type FinancialSummary = {
    balance: number;
    income: number;
    expenses: number;
    savingsRate: number;
};

export type SpendingCategory = {
    name: string;
    amount: number;
    percentage: number;
};

export type Budget = {
    id: string;
    category: string;
    spent: number;
    limit: number;
};