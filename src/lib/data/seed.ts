import { colorForName } from "@/lib/colors";
import { startOfMonth } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

/** Small deterministic PRNG so sample data is reproducible. */
function mulberry32(seed: number) {
    let a = seed;

    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);

        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const CURRENCY_SCALE: Record<string, number> = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    AED: 0.044,
};

const CATEGORIES: Array<{ name: string; icon: string }> = [
    { name: "Salary", icon: "💼" },
    { name: "Freelance", icon: "💻" },
    { name: "Rent", icon: "🏠" },
    { name: "Groceries", icon: "🛒" },
    { name: "Dining", icon: "🍽️" },
    { name: "Transport", icon: "🚕" },
    { name: "Utilities", icon: "💡" },
    { name: "Entertainment", icon: "🎬" },
    { name: "Shopping", icon: "🛍️" },
    { name: "Health", icon: "🩺" },
    { name: "Subscriptions", icon: "🔁" },
];

type Draft = {
    description: string;
    category: string;
    type: "income" | "expense";
    amount: number;
    date: Date;
};

export async function seedSampleData(
    clerkUserId: string,
    currency = "INR",
    now = new Date(),
) {
    const existing = await prisma.transaction.count({ where: { clerkUserId } });

    if (existing > 0) {
        return { seeded: false as const, reason: "You already have transactions." };
    }

    const scale = CURRENCY_SCALE[currency] ?? 1;
    const random = mulberry32(20260921);
    const between = (min: number, max: number) => min + random() * (max - min);
    const pick = <T,>(items: T[]) => items[Math.floor(random() * items.length)];
    const money = (value: number) => Math.max(1, Math.round(value * scale));

    const drafts: Draft[] = [];

    for (let offset = -5; offset <= 0; offset += 1) {
        const monthStart = startOfMonth(now, offset);
        const isCurrent = offset === 0;
        const lastDay = isCurrent
            ? now.getDate()
            : new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
        const at = (day: number) =>
            day <= lastDay ? new Date(monthStart.getFullYear(), monthStart.getMonth(), day) : null;
        const add = (
            day: number,
            description: string,
            category: string,
            type: "income" | "expense",
            amount: number,
        ) => {
            const date = at(day);

            if (date) drafts.push({ description, category, type, amount: money(amount), date });
        };

        add(1, "Salary", "Salary", "income", 85000);
        if (random() > 0.45) add(Math.ceil(between(8, 22)), "Freelance project", "Freelance", "income", between(8000, 22000));

        add(3, "Monthly rent", "Rent", "expense", 22000);
        add(5, "Netflix", "Subscriptions", "expense", 649);
        add(9, "Spotify", "Subscriptions", "expense", 119);
        add(15, "Gym membership", "Subscriptions", "expense", 1500);
        add(12, "Airtel Fiber", "Utilities", "expense", 999);
        add(14, "Electricity bill", "Utilities", "expense", between(1400, 2600));

        for (let week = 0; week < 4; week += 1) {
            add(2 + week * 7 + Math.floor(random() * 3), pick(["BigBasket", "Nature's Basket", "Local market"]), "Groceries", "expense", between(700, 2400));
            add(4 + week * 7 + Math.floor(random() * 3), pick(["Swiggy", "Zomato", "Truffles", "Third Wave Coffee"]), "Dining", "expense", between(250, 1400));
            add(6 + week * 7 + Math.floor(random() * 2), pick(["Uber", "Ola", "Metro card"]), "Transport", "expense", between(120, 650));
        }

        if (random() > 0.35) add(Math.ceil(between(10, 26)), pick(["Amazon", "Myntra", "Decathlon"]), "Shopping", "expense", between(900, 5200));
        if (random() > 0.5) add(Math.ceil(between(8, 27)), pick(["BookMyShow", "PVR Cinemas", "Steam"]), "Entertainment", "expense", between(400, 1800));
        if (random() > 0.6) add(Math.ceil(between(5, 25)), pick(["Apollo Pharmacy", "Dental checkup"]), "Health", "expense", between(300, 2200));
    }

    await prisma.$transaction(async (tx) => {
        await tx.category.createMany({
            data: CATEGORIES.map((category) => ({
                clerkUserId,
                name: category.name,
                icon: category.icon,
                color: colorForName(category.name),
            })),
            skipDuplicates: true,
        });

        const categories = await tx.category.findMany({ where: { clerkUserId } });
        const idByName = new Map(categories.map((category) => [category.name, category.id]));

        await tx.transaction.createMany({
            data: drafts.map((draft) => ({
                clerkUserId,
                description: draft.description,
                amount: draft.amount,
                type: draft.type,
                date: draft.date,
                categoryId: idByName.get(draft.category)!,
            })),
        });

        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const budgets: Array<[string, number]> = [
            ["Groceries", 9000],
            ["Dining", 3500],
            ["Transport", 2500],
            ["Entertainment", 1500],
            ["Shopping", 4000],
        ];

        await tx.budget.createMany({
            data: budgets.map(([name, amount]) => ({
                clerkUserId,
                categoryId: idByName.get(name)!,
                amount: money(amount),
                month,
                year,
            })),
            skipDuplicates: true,
        });

        await tx.goal.createMany({
            data: [
                {
                    clerkUserId,
                    name: "Emergency fund",
                    targetAmount: money(200000),
                    currentAmount: money(64000),
                    targetDate: new Date(now.getFullYear() + 1, now.getMonth(), 1),
                    color: "#10b981",
                },
                {
                    clerkUserId,
                    name: "Goa trip",
                    targetAmount: money(60000),
                    currentAmount: money(41000),
                    targetDate: new Date(now.getFullYear(), now.getMonth() + 4, 1),
                    color: "#0ea5e9",
                },
            ],
        });
    });

    return { seeded: true as const, transactions: drafts.length };
}

export async function clearAllUserData(clerkUserId: string) {
    await prisma.$transaction([
        prisma.transaction.deleteMany({ where: { clerkUserId } }),
        prisma.budget.deleteMany({ where: { clerkUserId } }),
        prisma.goal.deleteMany({ where: { clerkUserId } }),
        prisma.notification.deleteMany({ where: { clerkUserId } }),
        prisma.category.deleteMany({ where: { clerkUserId } }),
    ]);
}
