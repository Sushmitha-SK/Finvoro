import {
    BarChart3,
    Bell,
    CreditCard,
    LayoutDashboard,
    Settings,
    Sparkles,
    Tags,
    Target,
    Wallet,
    type LucideIcon,
} from "lucide-react";

export type NavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    keywords?: string;
};

export const mainNavigation: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, keywords: "home overview" },
    { title: "Transactions", href: "/transactions", icon: CreditCard, keywords: "expenses income payments" },
    { title: "Budgets", href: "/budgets", icon: Wallet, keywords: "limits spending" },
    { title: "Goals", href: "/goals", icon: Target, keywords: "savings targets" },
    { title: "Reports", href: "/reports", icon: BarChart3, keywords: "analytics charts export" },
    { title: "Categories", href: "/categories", icon: Tags, keywords: "tags organise" },
];

export const aiNavigation: NavItem[] = [
    { title: "AI Copilot", href: "/copilot", icon: Sparkles, keywords: "assistant chat gemini ask" },
];

export const secondaryNavigation: NavItem[] = [
    { title: "Notifications", href: "/notifications", icon: Bell, keywords: "alerts" },
    { title: "Settings", href: "/settings", icon: Settings, keywords: "preferences currency theme" },
];

export const allNavigation: NavItem[] = [
    ...mainNavigation,
    ...aiNavigation,
    ...secondaryNavigation,
];

/** Used by the header breadcrumb. */
export function titleForPath(pathname: string) {
    const match = allNavigation.find(
        (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    );

    return match?.title ?? "Finvoro";
}

