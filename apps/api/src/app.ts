import { Hono } from "hono";
import type { SupabaseClient } from "@supabase/supabase-js";
import { healthRoute } from "./routes/health";

export type AppDeps = { supabase: SupabaseClient };

export function createApp(deps: AppDeps) {
  void deps; // used by Tasks 4-5 when data routes mount
  const app = new Hono();
  app.route("/health", healthRoute());
  return app;
}
