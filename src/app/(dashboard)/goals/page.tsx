import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { GoalsView } from "@/components/goals/goals-view";
import { getUserId } from "@/lib/auth";
import { getGoals } from "@/lib/data/goals";

export const metadata: Metadata = { title: "Goals" };

export default async function GoalsPage() {
    const userId = await getUserId();

    if (!userId) redirect("/sign-in");

    return (
        <div className="mx-auto w-full max-w-8xl space-y-5 p-4 sm:p-6">
            <GoalsView goals={await getGoals(userId)} />
        </div>
    )
}
