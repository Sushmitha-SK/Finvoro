"use client";

import { Download, Loader2, ShieldCheck, Sparkles, Trash2, Wand2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";


import { clearAllData, loadSampleData } from "@/app/(dashboard)/data-actions";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { useCopilotStore } from "@/stores/copilot-store";
import { useInsightsStore } from "@/stores/insights-store";
import { useMounted } from "@/hooks/use-mounted";

const selectClass =
    "h-9 w-full max-w-xs rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60";

function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (next: boolean) => void; label: string; disabled?: boolean }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50",
                checked ? "bg-primary" : "bg-muted-foreground/30",
            )}
        >
            <span className={cn("inline-block size-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5.5" : "translate-x-0.5")} />
        </button>
    );
}

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-6 border-b py-4 last:border-b-0 last:pb-0 first:pt-0">
            <div className="min-w-0">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
        </div>
    );
}

type AiStatus = { configured: boolean; enabled: boolean; model: string; fastModel: string };

export function SettingsView({ name, email }: { name: string; email: string }) {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const currency = useAppStore((state) => state.currency);
    const setCurrency = useAppStore((state) => state.setCurrency);
    const aiEnabled = useAppStore((state) => state.aiEnabled);
    const setAiEnabled = useAppStore((state) => state.setAiEnabled);
    const hideAmounts = useAppStore((state) => state.hideAmounts);
    const toggleHideAmounts = useAppStore((state) => state.toggleHideAmounts);

    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<AiStatus | null>(null);
    const [seedPending, startSeed] = useTransition();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [clearing, setClearing] = useState(false);
    const mounted = useMounted();

    useEffect(() => {
        fetch("/api/ai/status")
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => data && setStatus(data))
            .catch(() => undefined);
    }, [aiEnabled]);

    async function savePreference(body: { currency?: string; aiEnabled?: boolean }) {
        setSaving(true);

        try {
            const response = await fetch("/api/preferences", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));

                throw new Error(data.error ?? "Couldn't save.");
            }

            return true;
        } catch (error) {
            toast.error((error as Error).message);

            return false;
        } finally {
            setSaving(false);
        }
    }

    async function changeCurrency(next: string) {
        const previous = currency;

        setCurrency(next); // optimistic

        if (await savePreference({ currency: next })) {
            toast.success("Currency updated");
            useInsightsStore.getState().invalidateAll();
            router.refresh();
        } else {
            setCurrency(previous);
        }
    }

    async function changeAi(next: boolean) {
        const previous = aiEnabled;

        setAiEnabled(next);

        if (await savePreference({ aiEnabled: next })) {
            toast.success(next ? "AI features enabled" : "AI features turned off");
            useInsightsStore.getState().invalidateAll();
            router.refresh();
        } else {
            setAiEnabled(previous);
        }
    }

    function seed() {
        startSeed(async () => {
            const result = await loadSampleData();

            if (!result.ok) {
                toast.error(result.error);

                return;
            }

            toast.success(`Loaded ${result.data.transactions} sample transactions`);
            router.refresh();
        });
    }

    async function wipe() {
        setClearing(true);

        const result = await clearAllData(confirmText);

        setClearing(false);

        if (!result.ok) {
            toast.error(result.error);

            return;
        }

        useCopilotStore.getState().clear();
        useInsightsStore.getState().invalidateAll();
        setConfirmOpen(false);
        setConfirmText("");
        toast.success("All your data was deleted");
        router.refresh();
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage your account and Finvoro preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="truncate">{name}</CardTitle>
                            <CardDescription className="truncate">{email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Tabs defaultValue="preferences">
                <TabsList>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="ai">AI & privacy</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>

                <TabsContent value="preferences">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>Customise how Finvoro looks and formats your numbers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Row title="Currency" description="Used everywhere amounts are shown, including AI answers.">
                                <select className={selectClass} value={currency} disabled={saving} onChange={(event) => void changeCurrency(event.target.value)} aria-label="Currency">
                                    {SUPPORTED_CURRENCIES.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </Row>
                            <Row title="Theme" description="Match your system or pick light or dark.">
                                <select className={selectClass} value={mounted ? (theme ?? "system") : "system"} onChange={(event) => setTheme(event.target.value)} aria-label="Theme">
                                    <option value="system">System</option>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </Row>
                            <Row title="Hide amounts" description="Mask balances and totals - handy on shared screens. Also in the header.">
                                <Switch checked={hideAmounts} onChange={toggleHideAmounts} label="Hide amounts" />
                            </Row>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ai">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="size-4 text-primary" /> Gemini AI
                            </CardTitle>
                            <CardDescription>Copilot chat, insights, smart entry and receipt scanning.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Row title="Enable AI features" description="Turn off to stop all data being sent to Gemini. Rule-based insights keep working.">
                                <Switch checked={aiEnabled} onChange={(next) => void changeAi(next)} label="Enable AI features" disabled={saving} />
                            </Row>

                            <div className="space-y-3 pt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className={cn("size-2 rounded-full", status?.configured ? "bg-emerald-500" : "bg-amber-500")} />
                                    {status === null
                                        ? "Checking connection…"
                                        : status.configured
                                            ? `Connected · ${status.model} (fast tasks: ${status.fastModel})`
                                            : "Not connected — set GEMINI_API_KEY on the server to enable AI."}
                                </div>

                                <div className="flex gap-3 rounded-xl bg-muted/60 p-4 text-muted-foreground">
                                    <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                                    <p>
                                        When AI is on, a compact summary of your finances (totals, categories, budgets, and — when you ask about them —
                                        specific transactions) is sent to Google&apos;s Gemini API to answer you. Your API key never leaves the server, and the
                                        Copilot can only read your data; it can&apos;t change anything without you confirming.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your data</CardTitle>
                            <CardDescription>Take it with you, or start fresh.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Row title="Export everything" description="A full JSON backup of transactions, categories, budgets and goals.">
                                <Button variant="outline" className="gap-1.5" nativeButton={false} render={<a href="/api/data/export" />}>
                                    <Download className="size-4" /> JSON
                                </Button>
                            </Row>
                            <Row title="Export transactions" description="Spreadsheet-friendly CSV of every transaction.">
                                <Button variant="outline" className="gap-1.5" nativeButton={false} render={<a href="/api/transactions/export" />}>
                                    <Download className="size-4" /> CSV
                                </Button>
                            </Row>
                            <Row title="Load sample data" description="Fill an empty account with realistic demo data to explore Finvoro.">
                                <Button variant="outline" className="gap-1.5" onClick={seed} disabled={seedPending}>
                                    {seedPending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />} Load
                                </Button>
                            </Row>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/30">
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger zone</CardTitle>
                            <CardDescription>These actions can&apos;t be undone.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Row title="Delete all my data" description="Removes every transaction, category, budget, goal and notification.">
                                <Button variant="destructive" className="gap-1.5" onClick={() => setConfirmOpen(true)}>
                                    <Trash2 className="size-4" /> Delete
                                </Button>
                            </Row>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <AlertDialog
                open={confirmOpen}
                onOpenChange={(open) => {
                    if (clearing) return;
                    setConfirmOpen(open);
                    if (!open) setConfirmText("");
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete all your data?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently removes everything in your Finvoro account. Type <strong>DELETE</strong> to confirm.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-1.5">
                        <Label htmlFor="confirm-delete">Confirmation</Label>
                        <Input id="confirm-delete" autoComplete="off" value={confirmText} onChange={(event) => setConfirmText(event.target.value)} placeholder="DELETE" />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={clearing}>Cancel</AlertDialogCancel>
                        <Button variant="destructive" disabled={confirmText !== "DELETE" || clearing} onClick={() => void wipe()}>
                            {clearing && <Loader2 className="size-4 animate-spin" />} Delete everything
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
