import { z } from "zod";

export const PreferenceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export const GetPreferencesResponseSchema = z.object({
  data: z.array(PreferenceSchema),
});
