import type { SupabaseClient } from "@supabase/supabase-js";

/** Fake for the exact query chain the API uses: from().select().order().limit() */
export function fakeSupabase(result: { data: unknown; error: unknown }): SupabaseClient {
  return {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: async () => result,
        }),
      }),
    }),
  } as unknown as SupabaseClient;
}
