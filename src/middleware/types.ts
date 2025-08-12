import type { SupabaseClient } from "../db/supabase.client";
import type { AuthUserDTO } from "../types";

export interface Locals {
  supabase: SupabaseClient;
  user: AuthUserDTO | null;
}
