import { z } from "zod";

export const transactionSchema = z.object({
    description: z
        .string()
        .trim()
        .min(2, "Description must be at least 2 characters")
        .max(100, "Description must be less than 100 characters"),

    amount: z
        .string()
        .min(1, "Amount is required")
        .refine(
            (value) => {
                const amount = Number(value);

                return (
                    Number.isFinite(amount) &&
                    amount > 0
                );
            },
            {
                message: "Enter a valid amount greater than 0",
            },
        ),

    type: z.enum(["income", "expense"]),

    category: z
        .string()
        .min(1, "Please select a category"),

    date: z
        .string()
        .min(1, "Date is required"),

    notes: z
        .string()
        .trim()
        .max(250, "Notes must be less than 250 characters")
        .optional(),
});

export type TransactionFormValues = z.infer<
    typeof transactionSchema
>;