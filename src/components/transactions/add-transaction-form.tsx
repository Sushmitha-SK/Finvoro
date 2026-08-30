"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { transactionSchema } from "./transaction-schema";
import type { TransactionFormValues } from "./transaction-schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const categories = [
    "Food",
    "Entertainment",
    "Transport",
    "Freelance",
    "Utilities",
    "Shopping",
    "Health",
    "Salary",
];

type AddTransactionFormProps = {
    onSuccess: (
        data: TransactionFormValues,
    ) => Promise<void>;
    onCancel: () => void;
};

export function AddTransactionForm({
    onSuccess,
    onCancel,
}: AddTransactionFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            description: "",
            amount: "",
            type: "expense",
            category: "",
            date: new Date()
                .toISOString()
                .split("T")[0],
            notes: "",
        },
    });

    const onSubmit = async (data: TransactionFormValues) => {
        await onSuccess(data);
    };
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <div className="space-y-2">
                <Label htmlFor="description">
                    Description
                </Label>

                <Input
                    id="description"
                    placeholder="e.g. Grocery shopping"
                    {...register("description")}
                />

                {errors.description && (
                    <p className="text-sm text-destructive">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="amount">
                        Amount
                    </Label>

                    <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...register("amount")}
                    />

                    {errors.amount && (
                        <p className="text-sm text-destructive">
                            {errors.amount.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">
                        Type
                    </Label>

                    <select
                        id="type"
                        className="flex h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none"
                        {...register("type")}
                    >
                        <option value="expense">
                            Expense
                        </option>

                        <option value="income">
                            Income
                        </option>
                    </select>

                    {errors.type && (
                        <p className="text-sm text-destructive">
                            {errors.type.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">
                    Category
                </Label>

                <select
                    id="category"
                    className="flex h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none"
                    {...register("category")}
                >
                    <option value="">
                        Select a category
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>
                    ))}
                </select>

                {errors.category && (
                    <p className="text-sm text-destructive">
                        {errors.category.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="date">
                    Date
                </Label>

                <Input
                    id="date"
                    type="date"
                    {...register("date")}
                />

                {errors.date && (
                    <p className="text-sm text-destructive">
                        {errors.date.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">
                    Notes
                </Label>

                <textarea
                    id="notes"
                    placeholder="Optional notes..."
                    rows={3}
                    className="flex w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    {...register("notes")}
                />

                {errors.notes && (
                    <p className="text-sm text-destructive">
                        {errors.notes.message}
                    </p>
                )}
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
                        ? "Adding..."
                        : "Add transaction"}
                </Button>
            </div>
        </form>
    );
}