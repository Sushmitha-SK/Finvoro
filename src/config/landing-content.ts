import {
    type LucideIcon, ArrowUpRight, ArrowDownLeft, Lightbulb,
    TrendingUp, Mail, LayoutDashboard, CreditCard, Wallet, Target, BarChart3,
    Tags, PieChart, ShieldCheck,
    AlertTriangle,
    ChartPie,
    CalendarDays
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

//Navbar

export const navItems = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Insights", href: "#insights" },
    { label: "FAQ", href: "#faq" },

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

export const previewNavItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Transactions", icon: CreditCard },
    { label: "Budgets", icon: Wallet },
    { label: "Goals", icon: Target },
    { label: "Reports", icon: BarChart3 },
    { label: "Categories", icon: Tags },
];

export const scoreItems = [
    {
        label: "Savings rate",
        value: "40/40",
        progress: 100,
    },
    {
        label: "Budget discipline",
        value: "30/30",
        progress: 100,
    },
    {
        label: "Spending momentum",
        value: "16/20",
        progress: 80,
    },
    {
        label: "Tracking activity",
        value: "4/10",
        progress: 40,
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

export const transactionFilters = ['all', 'income', 'expense'] as const;

export const budgets = [
    {
        budgetCategory: 'Food & Dining',
        budgetMonth: 'Sept 2026',
        spentAmount: 2450,
        budgetLimit: 3000,
        dotColor: 'bg-orange-500',
        barColor: 'bg-orange-500',
        badgeText: 'Near limit',
        badgeClass:
            'text-orange-600 bg-orange-500/10 border-orange-500/20',
        statusType: 'near',
    },
    {
        budgetCategory: 'Entertainment',
        budgetMonth: 'Aug 2026',
        spentAmount: 4649,
        budgetLimit: 3000,
        dotColor: 'bg-red-500',
        barColor: 'bg-red-500',
        badgeText: 'Limit reached',
        badgeClass: 'text-red-600 bg-red-500/10 border-red-500/20',
        statusType: 'over',
    },
] as const;

export const featureCards = [
    {
        title: 'Categories',
        description:
            'Group your spending into meaningful categories and discover where your money goes.',
        label: 'Organization',
        action: 'Explore categories',
        Icon: ChartPie,
    },
    {
        title: 'Financial reports',
        description:
            'Turn your financial activity into clear visual reports that are easy to understand.',
        label: 'Visual Analytics',
        action: 'Explore reports',
        Icon: BarChart3,
    },
    {
        title: 'Smart insights',
        description:
            'Spot spending patterns and meaningful trends without digging through spreadsheets.',
        label: 'AI Powered',
        action: 'Explore insights',
        Icon: Lightbulb,
    },
] as const;


//Product showcase section
export const categoryData = [
    { name: "Food & Dining", value: "₹8,420", width: "78%" },
    { name: "Shopping", value: "₹5,280", width: "52%" },
    { name: "Transport", value: "₹3,640", width: "36%" },
    { name: "Utilities", value: "₹2,840", width: "28%" },
];

export const productFeatureItems = [
    {
        title: 'Understand trends instantly',
        description:
            'Quickly identify changes in your monthly income and spending patterns.',
        Icon: TrendingUp,
    },
    {
        title: 'Find savings opportunities',
        description:
            'Pinpoint which category consumes the largest portion of your monthly budget.',
        Icon: ShieldCheck,
    },
] as const;

export const productCapabilities = [
    { label: 'Analytics', Icon: PieChart },
    { label: 'Budgets', Icon: Wallet },
    { label: 'Ledger', Icon: CreditCard },
    { label: 'Reports', Icon: CalendarDays },
] as const;

//How it works section


export const insights = [
    {
        icon: AlertTriangle,
        label: "Spending trend",
        title: "Spending is running ahead of last month",
        description: "At this pace you'll spend about ₹63,794 by month end (+57%).",
        metric: "₹63,794",
        metricLabel: "+57% projected",
        type: "warning" as const,
        actionText: "View spending forecast",
        timestamp: "Updated today at 9:41 AM",
    },
    {
        icon: ShieldCheck,
        label: "Savings insight",
        title: "Saving 72% of your income",
        description: "That's well above the common 20% guideline. Consider putting the surplus toward a goal.",
        metric: "72%",
        metricLabel: "vs 20% guideline",
        type: "positive" as const,
        actionText: "Allocate to goals",
        timestamp: "Updated today at 8:00 AM",
    },
    {
        icon: TrendingUp,
        label: "Category focus",
        title: "Rent makes up 77% of spending",
        description: "₹22,000 this month. A concentrated category is where small changes matter most.",
        metric: "₹22,000",
        metricLabel: "77% of total",
        type: "neutral" as const,
        actionText: "Analyze category breakdown",
        timestamp: "Updated yesterday",
    },
    {
        icon: Lightbulb,
        label: "Smart observation",
        title: "Recurring charges are over 10% of income",
        description: "₹25,267 a month goes to detected subscriptions. Cancel any you no longer use.",
        metric: "₹25,267 /mo",
        progress: 10,
        type: "warning" as const,
        actionText: "Review subscriptions",
        timestamp: "Updated 3 hours ago",
    },
] as const;



//Pricing section

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
    { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
    { label: "Email", href: "mailto:hello@finvoro.app", icon: Mail },
];