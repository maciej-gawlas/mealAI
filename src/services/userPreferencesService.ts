import type { SupabaseClient } from "../db/supabase.client";
import type { UserPreferenceDTO, ExtendedUserPreferenceDTO } from "../types";
import { DB_TABLES } from "../db/database.constants";
import type { Database } from "../db/database.types";

type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
type TableRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

/**
 * Updates user preferences by replacing all existing preferences with new ones
 * @param supabase Supabase client instance
 * @param userId ID of the user whose preferences are being updated
 * @param preferencesIds Array of preference UUIDs to set for the user
 * @returns Array of created user preference mappings
 * @throws Error if database operation fails
 */
export async function updateUserPreferences(
  supabase: SupabaseClient,
  userId: string,
  preferencesIds: string[],
): Promise<UserPreferenceDTO[]> {
  // Verify preferences exist
  const { data: existingPrefs, error: checkError } = await supabase
    .from(DB_TABLES.PREFERENCES)
    .select("id")
    .in("id", preferencesIds);

  if (checkError) {
    throw new Error("Failed to validate preferences existence");
  }

  if (!existingPrefs || existingPrefs.length !== preferencesIds.length) {
    throw new Error("One or more preferences do not exist");
  }

  // Delete existing preferences
  const { error: deleteError } = await supabase
    .from(DB_TABLES.USER_PREFERENCES)
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error("Failed to delete existing preferences");
  }

  // Insert new preferences
  const { data: newPreferences, error: insertError } = (await supabase
    .from(DB_TABLES.USER_PREFERENCES)
    .insert(
      preferencesIds.map(
        (prefId) =>
          ({
            user_id: userId,
            preference_id: prefId,
          }) as TablesInsert<"user_preferences">,
      ),
    )
    .select()) as DbResult<
    Promise<{
      data: TableRow<"user_preferences">[] | null;
      error: Error | null;
    }>
  >;

  if (insertError || !newPreferences) {
    console.log("Insert error:", insertError);
    throw new Error("Failed to insert new preferences");
  }

  return newPreferences;
}

/**
 * Gets all preferences for a specific user including preference names
 * @param supabase Supabase client instance
 * @param userId ID of the user whose preferences are being retrieved
 * @returns Array of user preference mappings with preference names
 * @throws Error if database operation fails
 */
export async function getUserPreferences(
  supabase: SupabaseClient,
  userId: string,
): Promise<ExtendedUserPreferenceDTO[]> {
  const { data, error } = await supabase
    .from(DB_TABLES.USER_PREFERENCES)
    .select(
      `
      user_id,
      preference_id,
      ${DB_TABLES.PREFERENCES}!inner(name)
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to retrieve user preferences:", error);
    throw new Error("Failed to retrieve user preferences");
  }

  // Transform data to match the expected format
  const formattedData =
    data?.map((item) => ({
      user_id: item.user_id,
      preference_id: item.preference_id,
      name: item[DB_TABLES.PREFERENCES].name,
    })) || [];

  return formattedData;
}
