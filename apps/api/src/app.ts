import { Hono } from "hono";
import type { SupabaseClient } from "@supabase/supabase-js";
import type OpenAI from "openai";
import { healthRoute } from "./routes/health";
import { threadsRoute } from "./routes/threads";
import { routePlanRoute } from "./routes/plan";
import { routeComposeRoute } from "./routes/compose";
import { routeExplainRoute } from "./routes/explain";

export type AppDeps = {
  supabase: SupabaseClient;
  openai?: OpenAI;
  openaiModel?: string;
};

export function createApp(deps: AppDeps) {
  const app = new Hono();
  app.use("*", async (context, next) => {
    await next();
    context.header("X-Alitaptap-Service", "api");
    context.header("X-Daan-Service", "api");
  });
  app.route("/health", healthRoute());
  app.route("/v1/threads", threadsRoute(deps));
  app.route("/v1/routes", routePlanRoute());
  app.route("/v1/routes", routeComposeRoute(deps));
  app.route("/v1/routes", routeExplainRoute(deps));
  return app;
}
