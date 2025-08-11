import type { APIRoute } from "astro";
import { getRecipeById, deleteRecipe } from "../../../services/recipeService";
import { uuidSchema } from "../../../schemas/recipe";
import { supabaseAdminClient } from "../../../db/supabase.client";

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    // 1. Parse and validate the ID parameter
    const { id } = params;
    const validationResult = uuidSchema.safeParse(id);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid recipe ID format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // // Get current user from session
    const userId = locals.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Get recipe using service
    const recipe = await getRecipeById(
      supabaseAdminClient,
      userId,
      validationResult.data,
    );

    if (!recipe) {
      return new Response(JSON.stringify({ error: "Recipe not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Return response
    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    // 1. Parse and validate the ID parameter
    const { id } = params;
    const validationResult = uuidSchema.safeParse(id);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid recipe ID format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Get current user from session
    const userId = locals.user?.id;

    if (!userId) {
      return;
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Check if recipe exists and belongs to user
    const recipe = await getRecipeById(
      supabaseAdminClient,
      userId,
      validationResult.data,
    );

    if (!recipe) {
      return new Response(JSON.stringify({ error: "Recipe not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Delete the recipe
    await deleteRecipe(supabaseAdminClient, validationResult.data);

    // 5. Return success response with no content
    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
