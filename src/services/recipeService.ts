import type { SupabaseClient } from "../db/supabase.client";
import type {
  CreateRecipeCommand,
  RecipeDTO,
  ListRecipesResponseDTO,
  ExtendedRecipeDTO,
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
): Promise<ExtendedRecipeDTO> {
  const { preference_ids, ...recipeData } = command;

  // Start a transaction
  const { data: newRecipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({
      user_id: userId,
      ...recipeData,
      is_ai_generated: recipeData.is_ai_generated || false,
    })
    .select(
      `
      *,
      recipe_preferences (
        preference:preferences (
          id,
          name
        )
      )
    `,
    )
    .single();

  if (recipeError) {
    throw recipeError;
  }

  if (preference_ids && preference_ids.length > 0) {
    const recipePreferences = preference_ids.map((preferenceId) => ({
      recipe_id: newRecipe.id,
      preference_id: preferenceId,
    }));

    const { error: preferencesError } = await supabase
      .from("recipe_preferences")
      .insert(recipePreferences);

    if (preferencesError) {
      // Attempt to delete the created recipe if preferences fail to be added
      await supabase.from("recipes").delete().eq("id", newRecipe.id);
      throw preferencesError;
    }

    // Fetch the recipe again with its preferences
    const { data: recipe, error: fetchError } = await supabase
      .from("recipes")
      .select(
        `
        *,
        recipe_preferences (
          preference:preferences (
            id,
            name
          )
        )
      `,
      )
      .eq("id", newRecipe.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    return recipe;
  }

  return newRecipe;
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
): Promise<ExtendedRecipeDTO | null> {
  const { data, error } = await supabase
    .from("recipes")
    .select(`
      *,
      recipe_preferences (
        preference:preferences (
          id,
          name
        )
      )
    `)
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
    .select(`
      *,
      recipe_preferences (
        preference:preferences (
          id,
          name
        )
      )
    `, { count: "exact" })
    .eq("user_id", userId);

  // Filter by preference if specified
  if (query.preference) {
    const { data: recipeIds } = await supabase
      .from("recipe_preferences")
      .select("recipe_id")
      .eq("preference_id", query.preference);

    if (recipeIds && recipeIds.length > 0) {
      queryBuilder = queryBuilder.in("id", recipeIds.map(r => r.recipe_id));
    } else {
      // If no recipes found with this preference, return empty result
      return {
        meta: {
          page,
          limit,
          total: 0,
        },
        data: [],
      };
    }
  }

  // Apply pagination after filtering
  queryBuilder = queryBuilder.range(start, end);

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
