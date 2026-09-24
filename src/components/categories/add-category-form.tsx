"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {
    categorySchema,
    type CategoryFormValues,
} from "./category-schema";

const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#14b8a6",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
];

const icons = [
    "🍔",
    "🏠",
    "🚗",
    "🛒",
    "🎬",
    "💡",
    "🎓",
    "✈️",
    "📱",
    "💰",
];

type Category = {
    id?: string;
    name: string;
    icon: string | null;
    color: string | null;
};

type AddCategoryFormProps = {
    category?: Category;
    onSuccess: () => void;
    onCancel: () => void;
};

export function AddCategoryForm({
    category,
    onSuccess,
    onCancel,
}: AddCategoryFormProps) {
    const isEditMode = Boolean(category?.id);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name ?? "",
            icon: category?.icon ?? "📱",
            color: category?.color ?? "#3b82f6",
        },
    });

    const selectedIcon = useWatch({
        control,
        name: "icon",
    });

    const selectedColor = useWatch({
        control,
        name: "color",
    });

    const onSubmit = async (
        data: CategoryFormValues,
    ) => {
        try {
            const url =
                isEditMode && category?.id
                    ? `/api/categories/${category.id}`
                    : "/api/categories";

            const method = isEditMode
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError("name", {
                    type: "server",
                    message:
                        result.error ??
                        `Unable to ${
                            isEditMode
                                ? "update"
                                : "create"
                        } category.`,
                });

                return;
            }

            onSuccess();
        } catch (error) {
            console.error(
                `Failed to ${
                    isEditMode
                        ? "update"
                        : "create"
                } category:`,
                error,
            );

            setError("name", {
                type: "server",
                message:
                    "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
        >
            {/* Category Name */}
            <div className="space-y-1.5">
                <Label htmlFor="category-name">
                    Category name
                </Label>

                <Input
                    id="category-name"
                    placeholder="e.g. Groceries"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                />

                {errors.name && (
                    <p className="text-xs text-destructive">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Icon Selector */}
            <div className="space-y-1.5">
                <Label>Icon</Label>

                <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Category icon">
                    {icons.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            role="radio"
                            aria-checked={selectedIcon === icon}
                            onClick={() =>
                                setValue(
                                    "icon",
                                    icon,
                                    {
                                        shouldDirty: true,
                                    },
                                )
                            }
                            className={cn(
                                "flex size-10 items-center justify-center rounded-xl border text-lg transition",
                                selectedIcon === icon
                                    ? "border-foreground bg-primary/10 ring-2 ring-foreground"
                                    : "border-border/60 hover:bg-muted hover:scale-105"
                            )}
                            aria-label={`Select ${icon} icon`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-1.5">
                <Label>Colour</Label>

                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Category colour">
                    {colors.map((colorOption) => (
                        <button
                            key={colorOption}
                            type="button"
                            role="radio"
                            aria-checked={selectedColor === colorOption}
                            onClick={() =>
                                setValue(
                                    "color",
                                    colorOption,
                                    {
                                        shouldDirty: true,
                                    },
                                )
                            }
                            className={cn(
                                "size-7 rounded-full ring-offset-2 ring-offset-popover transition",
                                selectedColor === colorOption
                                    ? "ring-2 ring-foreground"
                                    : "hover:scale-110"
                            )}
                            style={{
                                background: colorOption,
                            }}
                            aria-label={`Select colour ${colorOption}`}
                        />
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-1">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting && (
                        <Loader2 className="size-4 animate-spin" />
                    )}
                    {isEditMode ? "Save changes" : "Add category"}
                </Button>
            </div>
        </form>
    );
}