import { Hono } from "hono";
import { RouteExplainRequestSchema, RouteExplainResponseSchema } from "@alitaptap/shared";
import { zodTextFormat } from "openai/helpers/zod";
import type { AppDeps } from "../app";

const instruction = `Explain a route that Alitaptap has already computed.

Use only facts in the supplied route receipt and commuter preference. Never invent a fare, travel time, safety claim, landmark, road condition, or transport step. Keep the language practical for a commuter in the Philippines. If the receipt does not support a caution, return an empty caution list.`;

export function routeExplainRoute({ openai, openaiModel = "gpt-5.6" }: AppDeps) {
  const route = new Hono();

  route.post("/explain", async (context) => {
    const body = await context.req.json().catch(() => null);
    const parsed = RouteExplainRequestSchema.safeParse(body);
    if (!parsed.success) {
      return context.json({ error: "Invalid request", issues: parsed.error.issues }, 400);
    }

    if (!openai) {
      return context.json({ error: "Route explanation is not configured" }, 503);
    }

    try {
      const response = await openai.responses.parse({
        model: openaiModel,
        instructions: instruction,
        input: JSON.stringify(parsed.data),
        text: {
          format: zodTextFormat(RouteExplainResponseSchema, "route_explanation"),
        },
      });

      const explanation = RouteExplainResponseSchema.safeParse(response.output_parsed);
      if (!explanation.success) {
        return context.json({ error: "Route explanation was unavailable" }, 502);
      }

      return context.json({ data: explanation.data });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      console.error("OpenAI route explanation failed:", message);
      return context.json({ error: "Route explanation failed" }, 502);
    }
  });

  return route;
}
