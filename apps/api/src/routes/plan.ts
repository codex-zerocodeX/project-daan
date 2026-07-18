import { Hono } from "hono";
import { RoutePlanRequestSchema, RoutePlanResponseSchema } from "@daan/shared";

export function routePlanRoute() {
  const route = new Hono();

  route.post("/plan", async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = RoutePlanRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid request", issues: parsed.error.issues }, 400);
    }

    const { origin, destination } = parsed.data;

    // Mock: straight line origin->destination. The real routing algorithm
    // (community-thread graph + walkability scoring) replaces this body.
    const response = RoutePlanResponseSchema.parse({
      route: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [origin.lng, origin.lat],
            [destination.lng, destination.lat],
          ],
        },
        properties: {
          walkability_score: 50,
          summary: "Mock route - replace with the routing algorithm",
        },
      },
    });

    return c.json({ data: response });
  });

  return route;
}
