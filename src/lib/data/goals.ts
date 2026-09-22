import { prisma } from "@/lib/prisma";
import type { GoalSummary } from "@/types/finance";

const AVG_MONTH_MS = 30.44 * 86_400_000;

export function toGoalSummary(
    goal: {
        id: string;
        name: string;
        targetAmount: unknown;
        currentAmount: unknown;
        targetDate: Date | null;
        color: string | null;
    },
    now = new Date(),
): GoalSummary {
    const target = Number(goal.targetAmount);
    const current = Number(goal.currentAmount);
    const remaining = Math.max(target - current, 0);

    let monthlyNeeded: number | null = null;

    if (goal.targetDate && remaining > 0) {
        const monthsLeft = Math.max(
            1,
            Math.ceil((goal.targetDate.getTime() - now.getTime()) / AVG_MONTH_MS),
        );

        monthlyNeeded = remaining / monthsLeft;
    }

    return {
        id: goal.id,
        name: goal.name,
        targetAmount: target,
        currentAmount: current,
        targetDate: goal.targetDate ? goal.targetDate.toISOString() : null,
        color: goal.color,
        percentage: target > 0 ? Math.min((current / target) * 100, 100) : 0,
        monthlyNeeded,
    };
}

export async function getGoals(
    clerkUserId: string,
    now = new Date(),
): Promise<GoalSummary[]> {
    const goals = await prisma.goal.findMany({
        where: { clerkUserId },
        orderBy: [{ createdAt: "asc" }],
    });

    return goals.map((goal) => toGoalSummary(goal, now));
}
