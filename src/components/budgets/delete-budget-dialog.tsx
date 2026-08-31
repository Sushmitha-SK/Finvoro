"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

type DeleteBudgetDialogProps = {
    budgetId: string;
    category: string;
};

export function DeleteBudgetDialog({
    budgetId,
    category,
}: DeleteBudgetDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setIsDeleting(true);
        setError("");

        try {
            const response = await fetch(
                "/api/budgets",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: budgetId,
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error ||
                    "Failed to delete budget.",
                );

                return;
            }

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(
                "Failed to delete budget:",
                error,
            );

            setError(
                "Something went wrong. Please try again.",
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!isDeleting) {
                    setOpen(nextOpen);
                }
            }}
        >
            <AlertDialogTrigger
                render={
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="size-4" />
                        Delete
                    </Button>
                }
            />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete budget?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This will permanently delete the{" "}
                        <span className="font-medium text-foreground">
                            {category}
                        </span>{" "}
                        budget. Your transactions will not
                        be affected.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <p className="text-sm text-destructive">
                        {error}
                    </p>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isDeleting}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 />
                                Delete budget
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}