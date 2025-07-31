import type { SupabaseClient } from '../db/supabase.client';
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
  command: CreateRecipeCommand
): Promise<RecipeDTO> {
  const { data, error } = await supabase
    .from("recipes")
    .insert({ user_id: userId, ...command })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
