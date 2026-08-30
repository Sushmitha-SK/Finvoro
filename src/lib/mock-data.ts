import type {
    Budget,
    FinancialSummary,
    SpendingCategory,
    Transaction,
} from "@/types/finance";

export const financialSummary: FinancialSummary = {
    balance: 42680,
    income: 85400,
    expenses: 42720,
    savingsRate: 50,
};

export const spendingCategories: SpendingCategory[] = [
    {
        name: "Food",
        amount: 9200,
        percentage: 32,
    },
    {
        name: "Housing",
        amount: 7800,
        percentage: 27,
    },
    {
        name: "Transport",
        amount: 4200,
        percentage: 15,
    },
    {
        name: "Shopping",
        amount: 3500,
        percentage: 12,
    },
    {
        name: "Entertainment",
        amount: 2500,
        percentage: 9,
    },
    {
        name: "Other",
        amount: 1400,
        percentage: 5,
    },
];

export const budgets: Budget[] = [
    {
        id: "1",
        category: "Food",
        spent: 7200,
        limit: 10000,
    },
    {
        id: "2",
        category: "Transport",
        spent: 3200,
        limit: 5000,
    },
    {
        id: "3",
        category: "Entertainment",
        spent: 4500,
        limit: 5000,
    },
];

export const recentTransactions: Transaction[] = [
    {
        id: "1",
        description: "Monthly Salary",
        category: "Salary",
        type: "income",
        amount: 85000,
        date: "2026-08-28",
    },
    {
        id: "2",
        description: "Grocery Shopping",
        category: "Food",
        type: "expense",
        amount: 2450,
        date: "2026-08-27",
    },
    {
        id: "3",
        description: "Netflix Subscription",
        category: "Entertainment",
        type: "expense",
        amount: 649,
        date: "2026-08-26",
    },
    {
        id: "4",
        description: "Uber",
        category: "Transport",
        type: "expense",
        amount: 480,
        date: "2026-08-25",
    },
    {
        id: "5",
        description: "Freelance Payment",
        category: "Freelance",
        type: "income",
        amount: 12000,
        date: "2026-08-24",
    },
];

export const transactions: Transaction[] = [
    {
        id: "1",
        description: "Monthly Salary",
        category: "Salary",
        type: "income",
        amount: 85000,
        date: "2026-08-28",
    },
    {
        id: "2",
        description: "Grocery Shopping",
        category: "Food",
        type: "expense",
        amount: 2450,
        date: "2026-08-27",
    },
    {
        id: "3",
        description: "Netflix Subscription",
        category: "Entertainment",
        type: "expense",
        amount: 649,
        date: "2026-08-26",
    },
    {
        id: "4",
        description: "Uber",
        category: "Transport",
        type: "expense",
        amount: 480,
        date: "2026-08-25",
    },
    {
        id: "5",
        description: "Freelance Payment",
        category: "Freelance",
        type: "income",
        amount: 12000,
        date: "2026-08-24",
    },
    {
        id: "6",
        description: "Electricity Bill",
        category: "Utilities",
        type: "expense",
        amount: 1850,
        date: "2026-08-23",
    },
    {
        id: "7",
        description: "Amazon Purchase",
        category: "Shopping",
        type: "expense",
        amount: 3299,
        date: "2026-08-22",
    },
    {
        id: "8",
        description: "Gym Membership",
        category: "Health",
        type: "expense",
        amount: 1500,
        date: "2026-08-20",
    },
    {
        id: "9",
        description: "Freelance Project",
        category: "Freelance",
        type: "income",
        amount: 18000,
        date: "2026-08-18",
    },
    {
        id: "10",
        description: "Restaurant Dinner",
        category: "Food",
        type: "expense",
        amount: 1250,
        date: "2026-08-17",
    },
    {
        id: "11",
        description: "Mobile Recharge",
        category: "Utilities",
        type: "expense",
        amount: 799,
        date: "2026-08-15",
    },
    {
        id: "12",
        description: "Cab Ride",
        category: "Transport",
        type: "expense",
        amount: 620,
        date: "2026-08-14",
    },
];