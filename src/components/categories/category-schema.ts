import { z } from "zod";

export const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required.")
        .max(
            50,
            "Category name must be 50 characters or less.",
        ),

    icon: z
        .string()
        .optional(),

    color: z
        .string()
        .optional(),
});

export type CategoryFormValues = z.infer<
    typeof categorySchema
>;