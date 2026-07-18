import { createClient } from "@supabase/supabase-js";
import { createApp } from "./app";
import { openAiChat } from "./lib/openai";

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

    // Optional config, so read it off `env` without requiring the generated
    // types to declare it. Absent OPENAI_API_KEY just means AI search 503s.
    const opt = env as Partial<{ OPENAI_MODEL: string; CORS_ORIGIN: string }>;

    const app = createApp({
      supabase: createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY),
      chat: env.OPENAI_API_KEY
        ? openAiChat(env.OPENAI_API_KEY, opt.OPENAI_MODEL)
        : undefined,
      corsOrigin: opt.CORS_ORIGIN,
    });
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
