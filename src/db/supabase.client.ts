import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);
export type SupabaseClient = typeof supabaseClient;

export const DEFAULT_USER_ID = "b7ee6dd1-f782-4663-9bd3-12bd4f316139";

// Service role key client for server-side operations (bypasses RLS)
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdminClient = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
);
