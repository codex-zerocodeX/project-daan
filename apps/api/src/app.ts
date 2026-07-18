import { Hono } from "hono";
import { cors } from "hono/cors";
import type { SupabaseClient } from "@supabase/supabase-js";
import { healthRoute } from "./routes/health";
import { threadsRoute } from "./routes/threads";
import { threadSearchRoute } from "./routes/threadSearch";
import { routePlanRoute } from "./routes/plan";
import { routeComposeRoute } from "./routes/compose";
import { aiSearchRoute } from "./routes/aiSearch";
import type { ChatFn } from "./lib/openai";

/**
 * `chat` is optional: with no OpenAI key the app still boots, AI search 503s.
 * `corsOrigin` is passed in because this runs on both Node and Cloudflare
 * Workers, and `process.env` does not exist on the latter.
 */
export type AppDeps = {
  supabase: SupabaseClient;
  chat?: ChatFn;
  corsOrigin?: string;
};

export function createApp(deps: AppDeps) {
  const app = new Hono();

  // The Expo web build runs on a different origin than the API, so without this
  // the browser blocks every call and preflights 404. Native is unaffected.
  // CORS_ORIGIN is a comma-separated allowlist - the deployed web origin plus
  // localhost for dev. Falling back to "*" leaves the API callable from any
  // page, and it has no auth of its own.
  const origins = deps.corsOrigin
    ?.split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.use("*", cors({ origin: origins?.length ? origins : "*" }));

  app.route("/health", healthRoute());
  app.route("/v1/threads", threadsRoute(deps));
  app.route("/v1/threads", threadSearchRoute(deps));
  app.route("/v1/routes", routePlanRoute());
  app.route("/v1/routes", routeComposeRoute(deps));
  app.route("/v1/ai", aiSearchRoute(deps));
  return app;
}
