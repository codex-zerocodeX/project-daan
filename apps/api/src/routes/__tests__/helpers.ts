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

/** Fake for an awaited select with no further chaining: from().select() */
export function fakeSupabaseSelect(result: { data: unknown; error: unknown }): SupabaseClient {
  return {
    from: () => ({
      select: async () => result,
    }),
  } as unknown as SupabaseClient;
}
