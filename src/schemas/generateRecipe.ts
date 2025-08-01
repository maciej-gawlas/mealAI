import { z } from "zod";

export const GenerateRecipeSchema = z.object({
  description: z.string().min(1).max(500),
  preferences: z.array(z.string().uuid()),
});

export type GenerateRecipeInput = z.infer<typeof GenerateRecipeSchema>;
