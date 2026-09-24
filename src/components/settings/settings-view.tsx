"use client";

import { Download, Loader2, ShieldCheck, Sparkles, Trash2, Wand2, User, Sliders, Cpu, Database, AlertTriangle } from "lucide-react";
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
    "h-9 w-full max-w-xs rounded-lg border border-input bg-background/50 px-3 text-sm shadow-xs outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60";

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
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 cursor-pointer",
                checked ? "bg-primary" : "bg-muted-foreground/30",
            )}
        >
            <span className={cn("inline-block size-5 rounded-full bg-white shadow-sm transition-transform", checked ? "translate-x-5.5" : "translate-x-0.5")} />
        </button>
    );
}

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 py-4 last:border-b-0 last:pb-0 first:pt-0">
            <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium tracking-tight">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <div className="shrink-0">{children}</div>
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
        setCurrency(next);
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
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Profile Overview Card */}
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-xs">
                <CardHeader className="py-6">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary shadow-inner">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 space-y-1">
                            <CardTitle className="truncate text-xl">{name}</CardTitle>
                            <CardDescription className="truncate text-sm flex items-center gap-1.5">
                                <User className="size-3.5" /> {email}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Tabs defaultValue="preferences" className="space-y-4">
                <TabsList className="grid grid-cols-3 h-11 p-1 bg-muted/60 backdrop-blur-sm rounded-xl">
                    <TabsTrigger value="preferences" className="rounded-lg gap-2 text-xs sm:text-sm">
                        <Sliders className="size-4" /> Preferences
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="rounded-lg gap-2 text-xs sm:text-sm">
                        <Cpu className="size-4" /> AI & Privacy
                    </TabsTrigger>
                    <TabsTrigger value="data" className="rounded-lg gap-2 text-xs sm:text-sm">
                        <Database className="size-4" /> Data Management
                    </TabsTrigger>
                </TabsList>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Appearance & Formatting</CardTitle>
                            <CardDescription>Customise how Finvoro looks and formats your numbers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Row title="Currency" description="Used everywhere amounts are shown, including AI answers.">
                                <select className={selectClass} value={currency} disabled={saving} onChange={(event) => void changeCurrency(event.target.value)} aria-label="Currency">
                                    {SUPPORTED_CURRENCIES.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </Row>
                            <Row title="Theme" description="Match your system appearance or pick light or dark mode.">
                                <select className={selectClass} value={mounted ? (theme ?? "system") : "system"} onChange={(event) => setTheme(event.target.value)} aria-label="Theme">
                                    <option value="system">System</option>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </Row>
                            <Row title="Hide amounts" description="Mask balances and totals - handy on shared screens.">
                                <Switch checked={hideAmounts} onChange={toggleHideAmounts} label="Hide amounts" />
                            </Row>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* AI & Privacy Tab */}
                <TabsContent value="ai" className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Sparkles className="size-5 text-primary" /> Gemini AI Integration
                            </CardTitle>
                            <CardDescription>Copilot chat, financial insights, smart entry, and receipt scanning.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Row title="Enable AI features" description="Turn off to stop all data being sent to Gemini. Rule-based insights keep working.">
                                <Switch checked={aiEnabled} onChange={(next) => void changeAi(next)} label="Enable AI features" disabled={saving} />
                            </Row>

                            <div className="space-y-4 pt-2 text-sm">
                                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/40 border border-border/40">
                                    <span className={cn("size-2.5 rounded-full shrink-0", status?.configured ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                                    <span className="text-xs font-medium">
                                        {status === null
                                            ? "Checking connection..."
                                            : status.configured
                                            ? `Connected · Model: ${status.model} (Fast: ${status.fastModel})`
                                            : "Not connected — set GEMINI_API_KEY on the server to enable AI."}
                                    </span>
                                </div>

                                <div className="flex gap-3.5 rounded-xl bg-muted/50 border border-border/40 p-4 text-muted-foreground text-xs leading-relaxed">
                                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                                    <p>
                                        When AI is active, a compact summary of your finances (totals, categories, budgets, and specific queries) is securely processed via Google&apos;s Gemini API. Your API key remains secure on the server, and the Copilot maintains read-only access.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Data Management Tab */}
                <TabsContent value="data" className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Data & Exports</CardTitle>
                            <CardDescription>Take your financial data with you or populate sample information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Row title="Export everything" description="A complete JSON backup of transactions, categories, budgets, and goals.">
                                <Button variant="outline" size="sm" className="gap-1.5" nativeButton={false} render={<a href="/api/data/export" />}>
                                    <Download className="size-4" /> JSON
                                </Button>
                            </Row>
                            <Row title="Export transactions" description="Spreadsheet-friendly CSV format of every recorded transaction.">
                                <Button variant="outline" size="sm" className="gap-1.5" nativeButton={false} render={<a href="/api/transactions/export" />}>
                                    <Download className="size-4" /> CSV
                                </Button>
                            </Row>
                            <Row title="Load sample data" description="Populate an empty account with realistic demo data to explore Finvoro.">
                                <Button variant="outline" size="sm" className="gap-1.5" onClick={seed} disabled={seedPending}>
                                    {seedPending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4 text-primary" />} Load Demo
                                </Button>
                            </Row>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/30 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                                <AlertTriangle className="size-5" /> Danger Zone
                            </CardTitle>
                            <CardDescription>Irreversible actions related to your account data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Row title="Delete all my data" description="Permanently removes every transaction, category, budget, goal, and notification.">
                                <Button variant="destructive" size="sm" className="gap-1.5 shadow-xs" onClick={() => setConfirmOpen(true)}>
                                    <Trash2 className="size-4" /> Delete Account Data
                                </Button>
                            </Row>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Confirmation Dialog */}
            <AlertDialog
                open={confirmOpen}
                onOpenChange={(open) => {
                    if (clearing) return;
                    setConfirmOpen(open);
                    if (!open) setConfirmText("");
                }}
            >
                <AlertDialogContent className="border-destructive/20">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete all your data?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is permanent and removes everything associated with your Finvoro account. Type <strong className="text-destructive font-semibold">DELETE</strong> to confirm.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="confirm-delete">Confirmation Code</Label>
                        <Input id="confirm-delete" autoComplete="off" value={confirmText} onChange={(event) => setConfirmText(event.target.value)} placeholder="Type DELETE" />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={clearing}>Cancel</AlertDialogCancel>
                        <Button variant="destructive" disabled={confirmText !== "DELETE" || clearing} onClick={() => void wipe()}>
                            {clearing && <Loader2 className="size-4 animate-spin mr-1.5" />} Permanently Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}