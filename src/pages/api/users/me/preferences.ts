import { type APIRoute } from 'astro';
import { UpdateUserPreferencesCommandSchema } from '../../../../schemas/userPreferences';
import { updateUserPreferences } from '../../../../services/userPreferencesService';
import { ZodError } from 'zod';
import { DEFAULT_USER_ID, supabaseAdminClient } from '../../../../db/supabase.client';

export const prerender = false;

export const PUT: APIRoute = async ({ request, locals }) => {
  try {

    // Parse and validate request body
    const body = await request.json();
    const validatedData = UpdateUserPreferencesCommandSchema.parse(body);

    // Update preferences using the service
    const updatedPreferences = await updateUserPreferences(
      supabaseAdminClient,
      DEFAULT_USER_ID,
      validatedData.preferences
    );

    // Return success response
    return new Response(JSON.stringify({ data: updatedPreferences }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    // Handle specific error types
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (error instanceof Error && error.message === 'One or more preferences do not exist') {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log the error and return a generic error response
    console.error('Error updating preferences:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
