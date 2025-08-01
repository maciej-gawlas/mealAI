import type { AIRecipeDTO } from "../../types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenerateRecipeInput } from "../../schemas/generateRecipe";

export async function generateRecipeWithAI(
  supabase: SupabaseClient,
  userId: string,
  input: GenerateRecipeInput,
): Promise<AIRecipeDTO> {
  // TODO: Implement OpenRouter.ai API call
  // For now return mock data
  return {
    name: "Mock Recipe",
    ingredients: "Mock ingredients",
    instructions: "Mock instructions",
  };
}
