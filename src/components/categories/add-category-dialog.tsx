"use client";

import { useRouter } from "next/navigation";
import { Plus, Tag } from "lucide-react";
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

import { AddCategoryForm } from "./add-category-form";

export function AddCategoryDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
        router.refresh();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button>
                        <Plus />
                        Add category
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
                                bg-primary/10
                                text-primary
                            "
                        >
                            <Tag className="size-5" />
                        </div>

                        <div className="min-w-0">
                            <DialogTitle className="text-lg font-semibold tracking-tight">
                                Add category
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-sm leading-relaxed">
                                Create a category to organize your transactions.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form Body */}
                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-5">
                    <AddCategoryForm
                        onSuccess={handleSuccess}
                        onCancel={() => setOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}