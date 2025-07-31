import type { SupabaseClient } from "../db/supabase.client";
import type { PreferenceDTO } from "../types";

/**
 * Retrieves all dietary preferences from the database.
 *
 * @param client - The Supabase client instance
 * @returns Array of dietary preferences sorted by name
 * @throws Error if the database operation fails
 */
export async function getAllPreferences(
  client: SupabaseClient,
  nameFilter?: string,
): Promise<PreferenceDTO[]> {
  let query = client
    .from("preferences")
    .select("id, name")
    .order("name", { ascending: true });

  if (nameFilter) {
    query = query.ilike("name", `%${nameFilter}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to retrieve preferences:", error);
    throw new Error("Failed to retrieve preferences");
  }

  return data || [];
}
