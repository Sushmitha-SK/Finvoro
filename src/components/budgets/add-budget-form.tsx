"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    budgetSchema,
    type BudgetFormValues,
} from "./budget-schema";

type Category = {
    id: string;
    name: string;
};

export type BudgetInitialValues = {
    categoryId: string;
    amount: string;
    month: string;
    year: string;
};

type AddBudgetFormProps = {
    categories: Category[];
    initialValues?: BudgetInitialValues;
    budgetId?: string;
    onSuccess: () => void;
    onCancel: () => void;
};

const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

const currentYear = new Date().getFullYear();

const years = Array.from(
    { length: 3 },
    (_, index) => currentYear + index,
);

export function AddBudgetForm({
    categories,
    initialValues,
    budgetId,
    onSuccess,
    onCancel,
}: AddBudgetFormProps) {
    const isEditMode = Boolean(budgetId);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: initialValues ?? {
            categoryId: "",
            amount: "",
            month: String(new Date().getMonth() + 1),
            year: String(currentYear),
        },
    });

    const onSubmit = async (data: BudgetFormValues) => {
        try {
            const response = await fetch("/api/budgets", {
                method: isEditMode ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    isEditMode
                        ? {
                            ...data,
                            id: budgetId,
                        }
                        : data,
                ),
            });

            const result = await response.json();

            if (!response.ok) {
                setError("root", {
                    message:
                        result.error ||
                        `Failed to ${isEditMode ? "update" : "create"} budget.`,
                });

                return;
            }

            onSuccess();
        } catch (error) {
            console.error(
                `Failed to ${isEditMode ? "update" : "create"} budget:`,
                error,
            );

            setError("root", {
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
                <Label htmlFor="categoryId">
                    Category
                </Label>

                <select
                    id="categoryId"
                    className="flex h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none"
                    {...register("categoryId")}
                >
                    <option value="">
                        Select a category
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>

                {errors.categoryId && (
                    <p className="text-sm text-destructive">
                        {errors.categoryId.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="amount">
                    Monthly budget
                </Label>

                <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="10000"
                    {...register("amount")}
                />

                {errors.amount && (
                    <p className="text-sm text-destructive">
                        {errors.amount.message}
                    </p>
                )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="month">
                        Month
                    </Label>

                    <select
                        id="month"
                        className="flex h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none"
                        {...register("month")}
                    >
                        {months.map((month) => (
                            <option
                                key={month.value}
                                value={month.value}
                            >
                                {month.label}
                            </option>
                        ))}
                    </select>

                    {errors.month && (
                        <p className="text-sm text-destructive">
                            {errors.month.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="year">
                        Year
                    </Label>

                    <select
                        id="year"
                        className="flex h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none"
                        {...register("year")}
                    >
                        {years.map((year) => (
                            <option
                                key={year}
                                value={year}
                            >
                                {year}
                            </option>
                        ))}
                    </select>

                    {errors.year && (
                        <p className="text-sm text-destructive">
                            {errors.year.message}
                        </p>
                    )}
                </div>
            </div>

            {errors.root && (
                <p className="text-sm text-destructive">
                    {errors.root.message}
                </p>
            )}

            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
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
                            : "Add budget"}
                </Button>
            </div>
        </form>
    );
}