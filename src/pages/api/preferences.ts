import type { APIRoute } from "astro";
import { getAllPreferences } from "../../services/preferencesService";
import type { PreferencesResponseDTO } from "../../types";
import { GetPreferencesResponseSchema } from "../../schemas/preferences";
import { createSupabaseServerInstance } from "../../db/supabase.client";

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, request }) => {
  try {
    const nameFilter = url.searchParams.get("name");
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });
    const prefs = await getAllPreferences(supabase, nameFilter || undefined);
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
