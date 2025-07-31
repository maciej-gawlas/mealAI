import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);
export type SupabaseClient = typeof supabaseClient;

export const DEFAULT_USER_ID = "85bb7b19-ed26-44c0-95b3-1bac87f9a937";

// Service role key client for server-side operations (bypasses RLS)
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdminClient = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
);
