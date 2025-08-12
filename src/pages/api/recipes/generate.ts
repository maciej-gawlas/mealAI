import type { APIRoute } from "astro";
import { GenerateRecipeSchema } from "../../../schemas/generateRecipe";
import { generateRecipeWithAI } from "../../../services/ai/openrouter";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = GenerateRecipeSchema.parse(body);

    // Fetch preference names from database
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });
    const { data: preferences, error: preferencesError } = await supabase
      .from("preferences")
      .select("name")
      .in("id", validatedData.preferences);

    if (preferencesError) {
      console.error("Error fetching preferences:", preferencesError);
      return new Response(
        JSON.stringify({ error: "Error fetching preferences" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const preferenceNames = preferences?.map((pref) => pref.name) || [];

    // Generate recipe using AI with preference names
    const recipe = await generateRecipeWithAI({
      description: validatedData.description,
      preferences: preferenceNames,
    });

    return new Response(JSON.stringify({ recipe }), {
      status: 202,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating recipe:", error);

    // Type guard for Zod validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return new Response(JSON.stringify({ error: "Invalid request data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
