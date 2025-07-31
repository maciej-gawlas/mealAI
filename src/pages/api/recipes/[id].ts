import type { APIRoute } from "astro";
import { getRecipeById } from "../../../services/recipeService";
import { uuidSchema } from "../../../schemas/recipe";
import {
  DEFAULT_USER_ID,
  supabaseAdminClient,
} from "../../../db/supabase.client";

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

    // 2. Get authenticated user from Supabase context
    // const {
    //   data: { user },
    // } = await locals.supabase.auth.getUser();

    // if (!user) {
    //   return getErrorResponse(401, "Unauthorized");
    // }

    // 3. Get recipe using service
    const recipe = await getRecipeById(
      //locals.supabase,
      // user.id,
      supabaseAdminClient,
      DEFAULT_USER_ID,
      validationResult.data,
    );

    if (!recipe) {
      return getErrorResponse(404, "Recipe not found");
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
