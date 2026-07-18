import { Hono } from "hono";
import type { SupabaseClient } from "@supabase/supabase-js";
import { healthRoute } from "./routes/health";
import { threadsRoute } from "./routes/threads";
import { routePlanRoute } from "./routes/plan";
import { routeComposeRoute } from "./routes/compose";
import { aiSearchRoute } from "./routes/aiSearch";
import type { ChatFn } from "./lib/openai";

/** `chat` is optional: with no OpenAI key the app still boots, AI search 503s. */
export type AppDeps = { supabase: SupabaseClient; chat?: ChatFn };

export function createApp(deps: AppDeps) {
  const app = new Hono();
  app.route("/health", healthRoute());
  app.route("/v1/threads", threadsRoute(deps));
  app.route("/v1/routes", routePlanRoute());
  app.route("/v1/routes", routeComposeRoute(deps));
  app.route("/v1/ai", aiSearchRoute(deps));
  return app;
}
