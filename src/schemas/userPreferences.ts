import { z } from "zod";

/**
 * Schema for validating user preferences update command
 */
export const UpdateUserPreferencesCommandSchema = z.object({
  preferences: z
    .array(z.string().uuid(), {
      required_error: "Preferences array is required",
      invalid_type_error: "Preferences must be an array",
    })
    .min(1, "At least one preference must be provided"),
});

export type UpdateUserPreferencesCommandSchemaType = z.infer<
  typeof UpdateUserPreferencesCommandSchema
>;
