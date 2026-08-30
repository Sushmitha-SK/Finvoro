"use client";

import {
    useForm,
    useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
                        `Unable to ${isEditMode
                            ? "update"
                            : "create"
                        } category.`,
                });

                return;
            }

            onSuccess();
        } catch (error) {
            console.error(
                `Failed to ${isEditMode
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
            className="space-y-5"
        >
            <div className="space-y-2">
                <Label htmlFor="name">
                    Category name
                </Label>

                <Input
                    id="name"
                    placeholder="e.g. Groceries"
                    {...register("name")}
                />

                {errors.name && (
                    <p className="text-sm text-destructive">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Icon</Label>

                <div className="grid grid-cols-5 gap-2">
                    {icons.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() =>
                                setValue(
                                    "icon",
                                    icon,
                                    {
                                        shouldDirty: true,
                                    },
                                )
                            }
                            className={`flex size-10 items-center justify-center rounded-lg border text-lg transition-colors ${selectedIcon === icon
                                ? "border-primary bg-primary/10"
                                : "border-border hover:bg-muted"
                                }`}
                            aria-label={`Select ${icon} icon`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Color</Label>

                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() =>
                                setValue(
                                    "color",
                                    color,
                                    {
                                        shouldDirty: true,
                                    },
                                )
                            }
                            className={`flex size-8 items-center justify-center rounded-full border-2 ${selectedColor === color
                                ? "border-foreground"
                                : "border-transparent"
                                }`}
                            style={{
                                backgroundColor: color,
                            }}
                            aria-label={`Select color ${color}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? isEditMode
                            ? "Saving..."
                            : "Adding..."
                        : isEditMode
                            ? "Save changes"
                            : "Add category"}
                </Button>
            </div>
        </form>
    );
}