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
  // Set CORS_ORIGIN to the deployed web origin in production - "*" leaves the
  // API callable from any page, and it has no auth of its own.
  app.use("*", cors({ origin: deps.corsOrigin ?? "*" }));

  app.route("/health", healthRoute());
  app.route("/v1/threads", threadsRoute(deps));
  app.route("/v1/threads", threadSearchRoute(deps));
  app.route("/v1/routes", routePlanRoute());
  app.route("/v1/routes", routeComposeRoute(deps));
  app.route("/v1/ai", aiSearchRoute(deps));
  return app;
}
