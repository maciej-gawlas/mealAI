import { z } from "zod";

/**
 * Schema for validating UUID format
 */
export const uuidSchema = z.string().uuid("Invalid UUID format");

export const CreateRecipeSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(255),
  ingredients: z.string().min(1),
  instructions: z.string().min(1),
  is_ai_generated: z.boolean(),
});
