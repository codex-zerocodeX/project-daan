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

type TableResult = { data: unknown; error: unknown };

/**
 * Fake for routes that read more than one table. Keyed by table name; each
 * query is awaitable directly or after `.in(...)`: from(t).select()[.in()]
 */
export function fakeSupabaseTables(results: Record<string, TableResult>): SupabaseClient {
  return {
    from: (table: string) => {
      const result = results[table] ?? { data: [], error: null };
      const query = {
        in: () => query,
        then: (onFulfilled: (value: TableResult) => unknown) =>
          Promise.resolve(result).then(onFulfilled),
      };
      return { select: () => query };
    },
  } as unknown as SupabaseClient;
}

/**
 * Like `fakeSupabaseTables`, but every builder step returns the builder, so
 * tables queried with different chain shapes in the same route (one paginated,
 * one filtered) both resolve. Used where `.order().limit()` and `.in()` meet.
 */
export function fakeSupabaseChains(results: Record<string, TableResult>): SupabaseClient {
  return {
    from: (table: string) => {
      const result = results[table] ?? { data: [], error: null };
      const query = {
        order: () => query,
        limit: () => query,
        in: () => query,
        then: (onFulfilled: (value: TableResult) => unknown) =>
          Promise.resolve(result).then(onFulfilled),
      };
      return { select: () => query };
    },
  } as unknown as SupabaseClient;
}
