"use client";

import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type DeleteCategoryDialogProps = {
    categoryId: string;
    categoryName: string;
};

export function DeleteCategoryDialog({
    categoryId,
    categoryName,
}: DeleteCategoryDialogProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setIsDeleting(true);
        setError("");

        try {
            const response = await fetch(
                `/api/categories/${categoryId}`,
                {
                    method: "DELETE",
                },
            );

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error ??
                    "Unable to delete category.",
                );

                return;
            }

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(
                "Failed to delete category:",
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
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!isDeleting) {
                    setOpen(value);

                    if (!value) {
                        setError("");
                    }
                }
            }}
        >
            <DialogTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-destructive hover:text-destructive"
                        aria-label={`Delete ${categoryName}`}
                    >
                        <Trash2 />
                    </Button>
                }
            />

            <DialogContent
                className="
                    overflow-hidden
                    border-border/60
                    bg-background/95
                    p-0
                    shadow-2xl
                    backdrop-blur-xl
                    sm:max-w-lg
                "
            >
                {/* Header */}
                <DialogHeader className="border-b bg-muted/20 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div
                            className="
                                mt-0.5
                                flex size-10 shrink-0 items-center justify-center
                                rounded-xl
                                bg-destructive/10
                                text-destructive
                            "
                        >
                            <Trash2 className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <DialogTitle className="text-lg font-semibold tracking-tight">
                                Delete category?
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-sm leading-relaxed">
                                Are you sure you want to delete{" "}
                                <span className="font-medium text-foreground">
                                    {categoryName}
                                </span>
                                ? This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Body Content */}
                <div className="px-6 py-5 space-y-4">
                    {error && (
                        <p className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={isDeleting}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={handleDelete}
                        >
                            {isDeleting && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            {isDeleting ? "Deleting..." : "Delete category"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}