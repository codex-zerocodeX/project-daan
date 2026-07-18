import { Hono } from "hono";
import type { SupabaseClient } from "@supabase/supabase-js";
import { healthRoute } from "./routes/health";
import { threadsRoute } from "./routes/threads";

export type AppDeps = { supabase: SupabaseClient };

export function createApp(deps: AppDeps) {
  const app = new Hono();
  app.route("/health", healthRoute());
  app.route("/v1/threads", threadsRoute(deps));
  return app;
}
