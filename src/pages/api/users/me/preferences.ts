import { type APIRoute } from "astro";
import { UpdateUserPreferencesCommandSchema } from "../../../../schemas/userPreferences";
import {
  updateUserPreferences,
  getUserPreferences,
} from "../../../../services/userPreferencesService";
import { ZodError } from "zod";
import { createSupabaseServerInstance } from "../../../../db/supabase.client";
import type { ExtendedUserPreferencesResponseDTO } from "../../../../types";

export const prerender = false;

export const GET: APIRoute = async ({ locals, cookies, request }) => {
  const headers = { "Content-Type": "application/json" };

  // // Get current user from session
  const userId = locals.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });
    // Get user preferences with names
    const userPreferences = await getUserPreferences(supabase, userId);

    // Prepare response according to API contract
    const response: ExtendedUserPreferencesResponseDTO = {
      data: userPreferences,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers,
    });
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "Failed to retrieve user preferences") {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 404,
          headers,
        });
      }
    }

    // Log the error and return a generic error response
    console.error("Error retrieving user preferences:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

export const PUT: APIRoute = async ({ request, locals, cookies }) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = UpdateUserPreferencesCommandSchema.parse(body);

    // // Get current user from session
    const userId = locals.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Update preferences using the service
    const updatedPreferences = await updateUserPreferences(
      supabase,
      userId,
      validatedData.preferences,
    );

    // Return success response
    return new Response(JSON.stringify({ data: updatedPreferences }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle specific error types
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      error instanceof Error &&
      error.message === "One or more preferences do not exist"
    ) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Log the error and return a generic error response
    console.error("Error updating preferences:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
