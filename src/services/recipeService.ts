import type { SupabaseClient } from "../db/supabase.client";
import type {
  CreateRecipeCommand,
  RecipeDTO,
  ListRecipesResponseDTO,
} from "../types";
import type { z } from "zod";
import type { ListRecipesQuerySchema } from "../schemas/recipe";

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

/**
 * Lists recipes for the specified user with pagination, sorting and filtering.
 *
 * @param supabase - The Supabase client instance
 * @param userId - The ID of the user whose recipes to list
 * @param query - The query parameters for pagination, sorting and filtering
 * @returns Promise resolving to paginated recipes response
 * @throws Will throw an error if the database operation fails
 */
export async function listRecipes(
  supabase: SupabaseClient,
  userId: string,
  query: z.infer<typeof ListRecipesQuerySchema>,
): Promise<ListRecipesResponseDTO> {
  const { page, limit, sort, ai_generated } = query;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let queryBuilder = supabase
    .from("recipes")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .range(start, end);

  if (ai_generated !== undefined) {
    queryBuilder = queryBuilder.eq("is_ai_generated", ai_generated);
  }

  if (sort) {
    const [column, direction] = sort.split(" ");
    queryBuilder = queryBuilder.order(column, { ascending: !direction });
  } else {
    queryBuilder = queryBuilder.order("created_at", { ascending: false });
  }

  const { data, error, count } = await queryBuilder;

  if (error) throw error;

  return {
    meta: {
      page,
      limit,
      total: count || 0,
    },
    data: data || [],
  };
}

/**
 * Deletes a recipe with the specified ID belonging to the given user.
 * Thanks to RLS policies, this will only delete the recipe if it belongs to the authenticated user.
 *
 * @param supabase - The Supabase client instance
 * @param recipeId - The ID of the recipe to delete
 * @returns Promise resolving when the recipe is deleted
 * @throws Will throw an error if the recipe doesn't exist or if the database operation fails
 */
export async function deleteRecipe(
  supabase: SupabaseClient,
  recipeId: string,
): Promise<void> {
  const { error } = await supabase.from("recipes").delete().eq("id", recipeId);

  if (error) throw error;
}
