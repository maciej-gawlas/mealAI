import type { SupabaseClient } from "@/db/supabase.client";
import { describe, expect, it } from "vitest";
import { getAllPreferences } from "../preferencesService";

describe("preferencesService", () => {
  describe("getAllPreferences", () => {
    it("should handle empty preferences list", async () => {
      // Create a minimal mock that returns an empty data array
      const mockClient = {
        from: () => ({
          select: () => ({
            order: () => ({
              ilike: () => Promise.resolve({ data: [], error: null }),
              // For the non-filtered case
              then: (
                callback: (result: {
                  data: unknown[];
                  error: unknown;
                }) => unknown,
              ) => Promise.resolve(callback({ data: [], error: null })),
            }),
          }),
        }),
      } as unknown as SupabaseClient;

      const result = await getAllPreferences(mockClient);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([]);
    });
  });
});
