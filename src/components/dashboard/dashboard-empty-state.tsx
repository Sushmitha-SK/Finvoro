"use client";

import { Loader2, Plus, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { loadSampleData } from "@/app/(dashboard)/data-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUIStore } from "@/stores/ui-store";

export function DashboardEmptyState() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const openDialog = useUIStore((state) => state.openTransactionDialog);

    function seed() {
        startTransition(async () => {
            const result = await loadSampleData();

            if (!result.ok) {
                toast.error(result.error);

                return;
            }

            toast.success(`Loaded ${result.data.transactions} sample transactions`);
            router.refresh();
        });
    }

    return (
        <Card className="border-dashed">
            <CardContent className="mx-auto flex max-w-lg flex-col items-center gap-5 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="size-7" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Let&apos;s get your dashboard going</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Add your first transaction — you can even type it in plain English and let AI fill in the details — or explore with
                        realistic sample data.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    <Button onClick={() => openDialog()} className="gap-1.5">
                        <Plus className="size-4" /> Add a transaction
                    </Button>
                    <Button variant="outline" onClick={seed} disabled={pending} className="gap-1.5">
                        {pending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                        Load sample data
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">You can remove sample data anytime from Settings → Data.</p>
            </CardContent>
        </Card>
    );
}
