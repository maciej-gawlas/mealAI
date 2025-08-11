import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";
import type { AuthUserDTO } from "../types";

export const onRequest = defineMiddleware(
  async ({ cookies, request, locals }, next) => {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });
    locals.supabase = supabase;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const authUser: AuthUserDTO = {
        id: user.id,
        email: user.email ?? "",
      };
      locals.user = authUser;
    } else {
      locals.user = null;
    }

    return next();
  },
);
