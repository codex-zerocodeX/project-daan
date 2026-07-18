import { Hono } from "hono";
import type { SupabaseClient } from "@supabase/supabase-js";
import { healthRoute } from "./routes/health";
import { threadsRoute } from "./routes/threads";
import { threadSearchRoute } from "./routes/threadSearch";
import { routePlanRoute } from "./routes/plan";
import { routeComposeRoute } from "./routes/compose";

export type AppDeps = { supabase: SupabaseClient };

export function createApp(deps: AppDeps) {
  const app = new Hono();
  app.route("/health", healthRoute());
  app.route("/v1/threads", threadsRoute(deps));
  app.route("/v1/threads", threadSearchRoute(deps));
  app.route("/v1/routes", routePlanRoute());
  app.route("/v1/routes", routeComposeRoute(deps));
  return app;
}
