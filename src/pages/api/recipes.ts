import type { APIRoute } from "astro";
import { CreateRecipeSchema } from "../../schemas/recipe";
import { createRecipe } from "../../services/recipeService";
import { DEFAULT_USER_ID, supabaseAdminClient } from "../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // // Get Supabase client from context
    // const supabase = locals.supabase;

    // // Verify authentication
    // const { data: { session } } = await supabase.auth.getSession();
    // if (!session) {
    //   return new Response(
    //     JSON.stringify({ error: "Unauthorized" }),
    //     { status: 401, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateRecipeSchema.parse(body);

    // Create recipe
    const recipe = await createRecipe(
      supabaseAdminClient,
      DEFAULT_USER_ID,
      validatedData,
    );

    return new Response(JSON.stringify(recipe), {
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
