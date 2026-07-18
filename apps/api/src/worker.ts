import { createClient } from "@supabase/supabase-js";
import { createApp } from "./app";

/**
 * Cloudflare Workers entry point. `src/index.ts` stays the Node entry for
 * local dev (`npm run dev:api`); both share the same runtime-agnostic
 * `createApp()`, so routes and the compose algorithm are unchanged.
 *
 * The Supabase client is built per request: on Workers, `env` only exists
 * inside the handler, and module-level request state leaks across requests.
 */
export default {
  async fetch(request, env, ctx): Promise<Response> {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY secret");
      return Response.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const app = createApp({
      supabase: createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY),
    });
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
