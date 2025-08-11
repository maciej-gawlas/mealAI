import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '../../../db/supabase.client';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Nieprawidłowy e-mail lub hasło' }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({ user: data.user }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return new Response(
      JSON.stringify({ error: 'Wystąpił błąd podczas logowania' }),
      { status: 500 }
    );
  }
};
