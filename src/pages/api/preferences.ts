import type { APIRoute } from "astro";
import { getAllPreferences } from "../../services/preferencesService";
import type { PreferencesResponseDTO } from "../../types";
import { GetPreferencesResponseSchema } from "../../schemas/preferences";
import { supabaseAdminClient } from "../../db/supabase.client";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const nameFilter = url.searchParams.get("name");
    const prefs = await getAllPreferences(
      supabaseAdminClient,
      // locals.supabase,
      nameFilter || undefined,
    );
    const response: PreferencesResponseDTO = { data: prefs };
    // Validate response format
    GetPreferencesResponseSchema.parse(response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching preferences:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Failed to retrieve preferences",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
