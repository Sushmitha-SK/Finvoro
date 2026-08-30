"use client";

import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        aria-label={`Delete ${categoryName}`}
                    >
                        <Trash2 />
                    </Button>
                }
            />

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete category?
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-foreground">
                            {categoryName}
                        </span>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </p>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
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
                        {isDeleting ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 />
                                Delete category
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}