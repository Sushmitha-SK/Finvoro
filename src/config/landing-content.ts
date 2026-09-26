import { Receipt, PiggyBank, BarChart3, Bell, type LucideIcon, ArrowUpRight, ArrowDownLeft, TrendingDown, Lightbulb, TrendingUp, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

//Navbar

export const navItems = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Insights", href: "#insights" },
    { label: "Pricing", href: "#pricing" },
];

//Hero section

export const heroBenefits = [
    "Track every transaction",
    "Build smarter budgets",
    "Understand your spending",
];

//Hero section - Dashboard Preview
export const transactions = [
    {
        name: "Grocery Store",
        category: "Food & Dining",
        amount: "-₹2,450",
        icon: ArrowUpRight,
    },
    {
        name: "Salary",
        category: "Income",
        amount: "+₹68,000",
        icon: ArrowDownLeft,
    },
    {
        name: "Electricity Bill",
        category: "Utilities",
        amount: "-₹1,840",
        icon: ArrowUpRight,
    },
];

//Value strip section

export interface ValueItem {
    title: string;
    description: string;
}

export const values: ValueItem[] = [
    {
        title: "See every transaction in one unified feed.",
        description: "Connect your accounts and keep track of all cash flow without manual entry."
    },
    {
        title: "Build intelligent budgets around your true goals.",
        description: "Set smart limits, monitor savings progress, and stay firmly on track every month."
    },
    {
        title: "Get clear reports and deep spending insights.",
        description: "Transform raw numbers into crystal-clear trends so you always understand your money."
    },
    {
        title: "Stay informed with real-time smart alerts.",
        description: "Receive important updates and instant notifications right when they matter most."
    },
];

//Features section
export const featureTransactions = [
    { id: 1, name: "Whole Foods Market", category: "Groceries", amount: "-$124.50", type: "expense", date: "Today" },
    { id: 2, name: "Monthly Salary Deposit", category: "Income", amount: "+$4,850.00", type: "income", date: "Yesterday" },
    { id: 3, name: "Netflix Subscription", category: "Entertainment", amount: "-$15.99", type: "expense", date: "Oct 24" },
];

//Product showcase section
export const categoryData = [
    { name: "Food & Dining", value: "₹8,420", width: "78%" },
    { name: "Shopping", value: "₹5,280", width: "52%" },
    { name: "Transport", value: "₹3,640", width: "36%" },
    { name: "Utilities", value: "₹2,840", width: "28%" },
];

//Hpw it works section
export const insights = [
    {
        icon: TrendingDown,
        label: "Spending trend",
        title: "Dining expenses are trending down",
        description: "Your dining spending is 18% lower than your previous month, mostly driven by fewer weekend reservations.",
        metric: "-$142.50",
        metricLabel: "vs last month",
        type: "positive" as const,
        actionText: "View category breakdown",
        timestamp: "Updated today at 9:41 AM",
    },
    {
        icon: Lightbulb,
        label: "Smart observation",
        title: "Subscriptions could be optimized",
        description: "Recurring subscriptions account for a noticeable part of your monthly spending with 2 services showing low usage.",
        metric: "$54.00 /mo",
        metricLabel: "4 active services",
        type: "neutral" as const,
        actionText: "Review subscriptions",
        timestamp: "Updated yesterday",
    },
    {
        icon: TrendingUp,
        label: "Budget alert",
        title: "Shopping is approaching its limit",
        description: "You've used 82% of your monthly shopping budget with 9 days remaining in the billing cycle.",
        metric: "$328 / $400",
        progress: 82,
        type: "warning" as const,
        actionText: "Adjust budget limit",
        timestamp: "Updated 3 hours ago",
    },
] as const;

//Pricimg section
export const plans = [
    {
        name: "Free",
        description: "Everything you need to get started.",
        price: "₹0",
        period: "forever",
        features: [
            "Track transactions",
            "Create categories",
            "Basic budgets",
            "Monthly overview",
        ],
        cta: "Get started",
        featured: false,
    },
    {
        name: "Pro",
        description: "More insight, deep reporting, and complete control over your everyday finances.",
        price: "₹299",
        period: "per month",
        features: [
            "Everything in Free",
            "Advanced reports & exports",
            "Smart financial insights",
            "Detailed spending analysis",
            "Custom budget alerts",
            "Priority features access",
        ],
        cta: "Start with Pro",
        featured: true,
    },
    {
        name: "Premium",
        description: "For users who want the complete experience.",
        price: "₹599",
        period: "per month",
        features: [
            "Everything in Pro",
            "Advanced financial analytics",
            "Extended insights",
            "Unlimited financial history",
            "Premium support",
        ],
        cta: "Choose Premium",
        featured: false,
    },
];


//FAQ section
export const faqs = [
    {
        question: "What is Finvoro?",
        answer:
            "Finvoro is a personal finance platform that helps you track transactions, manage budgets, organize spending, and understand your financial activity through reports and insights.",
    },
    {
        question: "Is Finvoro free to use?",
        answer:
            "Yes. Finvoro offers a free plan with the essential tools needed to track and organize your finances. You can upgrade whenever you need additional advanced features.",
    },
    {
        question: "Can I manage my budgets with Finvoro?",
        answer:
            "Yes. You can create custom budgets, assign spending categories, and monitor how your actual spending compares with your planned limits in real-time.",
    },
    {
        question: "How do financial insights work?",
        answer:
            "Finvoro analyzes the financial activity available in your account to surface useful patterns, trends, and observations that help you optimize your spending habits.",
    },
    {
        question: "Is my financial information secure?",
        answer:
            "Finvoro is built with robust account authentication and user-specific data access controls, ensuring your financial information remains private and secure.",
    },
    {
        question: "Can I change my preferred currency?",
        answer:
            "Yes. Your preferred currency can be easily updated from your Account Settings and will apply across all your financial dashboards and reports.",
    },
];


//Footer section

export const productLinks = [
    { label: "Features", href: "#features" },
    { label: "Insights", href: "#insights" },
    { label: "Pricing", href: "#pricing" },
];

export const resourceLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
];

export const accountLinks = [
    { label: "Sign in", href: "/sign-in" },
    { label: "Get started", href: "/sign-up" },
];

export const legalLinks = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
];

export const socialLinks = [
    { label: "GitHub", href: "https://github.com", icon: FaGithub },
    { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
    { label: "Email", href: "mailto:hello@finvoro.app", icon: Mail },
];