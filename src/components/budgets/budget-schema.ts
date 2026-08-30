import { z } from "zod";

export const budgetSchema = z.object({
    categoryId: z
        .string()
        .min(1, "Please select a category"),

    amount: z
        .string()
        .min(1, "Budget amount is required")
        .refine(
            (value) => {
                const amount = Number(value);

                return (
                    Number.isFinite(amount) &&
                    amount > 0
                );
            },
            {
                message:
                    "Enter a valid amount greater than 0",
            },
        ),

    month: z
        .string()
        .min(1, "Please select a month"),

    year: z
        .string()
        .min(1, "Please select a year"),
});

export type BudgetFormValues = z.infer<
    typeof budgetSchema
>;