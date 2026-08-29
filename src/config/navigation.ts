import {
    BarChart3,
    Bell,
    CreditCard,
    LayoutDashboard,
    Settings,
    Tags,
    Wallet,
} from "lucide-react";

export const mainNavigation = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Transactions",
        href: "/transactions",
        icon: CreditCard,
    },
    {
        title: "Categories",
        href: "/categories",
        icon: Tags,
    },
    {
        title: "Budgets",
        href: "/budgets",
        icon: Wallet,
    },
    {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
    },
];

export const secondaryNavigation = [
    {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];