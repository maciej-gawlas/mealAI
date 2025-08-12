import type { AstroCookies } from "astro";
import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

export const cookieOptions: CookieOptions = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax",
};

// Client-side Supabase client
export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);
export type SupabaseClient = typeof supabaseClient;

// Server-side Supabase client with SSR support
export function createSupabaseServerInstance(context: {
  headers: Headers;
  cookies: AstroCookies;
}) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return context.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        context.cookies.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        context.cookies.delete(name, options);
      },
    },
  });
}

// Service role key client for server-side operations (bypasses RLS)
// const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
// export const supabaseClient = createClient<Database>(
//   supabaseUrl,
//   supabaseServiceRoleKey,
// );
