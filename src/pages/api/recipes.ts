import type { APIRoute } from "astro";
import {
  CreateRecipeSchema,
  ListRecipesQuerySchema,
} from "../../schemas/recipe";
import { createRecipe, listRecipes } from "../../services/recipeService";
import { createSupabaseServerInstance } from "../../db/supabase.client";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals, cookies }) => {
  try {
    // Extract query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);

    // Validate query parameters
    const validatedQuery = ListRecipesQuerySchema.parse(queryParams);

    // // Get current user from session
    const userId = locals.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get recipes from service
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });
    const response = await listRecipes(supabase, userId, validatedQuery);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (_error) {
    console.error("Error fetching recipes:", _error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  try {
    // Get current user from session
    const userId = locals.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateRecipeSchema.parse(body);

    // Create recipe with preferences
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });
    const recipe = await createRecipe(supabase, userId, validatedData);

    // Transform preferences to match the expected format
    const responseData = {
      ...recipe,
      preferences: recipe.recipe_preferences?.map((rp) => rp.preference) || [],
    };

    return new Response(JSON.stringify(responseData), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
