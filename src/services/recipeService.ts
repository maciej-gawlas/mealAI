import type { SupabaseClient } from "../db/supabase.client";
import type { CreateRecipeCommand, RecipeDTO } from "../types";

/**
 * Creates a new recipe for the specified user.
 *
 * @param supabase - The Supabase client instance
 * @param userId - The ID of the user creating the recipe
 * @param command - The recipe creation command containing recipe details
 * @returns Promise resolving to the created recipe
 * @throws Will throw an error if the database operation fails
 */
export async function createRecipe(
  supabase: SupabaseClient,
  userId: string,
  command: CreateRecipeCommand,
): Promise<RecipeDTO> {
  const { data, error } = await supabase
    .from("recipes")
    .insert({ user_id: userId, ...command })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/**
 * Retrieves a specific recipe by ID for the specified user.
 *
 * @param supabase - The Supabase client instance
 * @param userId - The ID of the user who owns the recipe
 * @param recipeId - The ID of the recipe to retrieve
 * @returns Promise resolving to the recipe if found, null otherwise
 * @throws Will throw an error if the database operation fails
 */
export async function getRecipeById(
  supabase: SupabaseClient,
  userId: string,
  recipeId: string,
): Promise<RecipeDTO | null> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", recipeId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Record not found
    throw error;
  }

  return data;
}
