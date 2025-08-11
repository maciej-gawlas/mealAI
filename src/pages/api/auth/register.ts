import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 400
        }
      );
    }

    // After successful registration, automatically sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return new Response(
        JSON.stringify({
          error: "Rejestracja udana, ale wystąpił błąd podczas automatycznego logowania"
        }),
        {
          status: 400
        }
      );
    }

    return new Response(
      JSON.stringify({
        user: data.user,
        session: signInData.session
      }),
      {
        status: 201
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas przetwarzania żądania"
      }),
      {
        status: 500
      }
    );
  }
};
