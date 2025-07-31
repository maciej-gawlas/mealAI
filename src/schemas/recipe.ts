import { z } from "zod";

/**
 * Schema for validating UUID format
 */
export const uuidSchema = z.string().uuid("Invalid UUID format");

/**
 * Schema for validating recipe list query parameters
 */
export const ListRecipesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z
    .enum(["created_at", "created_at desc", "name", "name desc"])
    .optional(),
  ai_generated: z.coerce.boolean().optional(),
});

export const CreateRecipeSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(255),
  ingredients: z.string().min(1),
  instructions: z.string().min(1),
  is_ai_generated: z.boolean(),
});

/**
 * Schema for validating recipe ID in delete request
 */
export const DeleteRecipeSchema = z.object({
  id: uuidSchema,
});
