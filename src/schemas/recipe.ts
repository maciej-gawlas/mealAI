import { z } from "zod";

export const CreateRecipeSchema = z.object({
  name: z.string().min(1).max(255),
  ingredients: z.string().min(1),
  instructions: z.string().min(1),
  is_ai_generated: z.boolean()
});
