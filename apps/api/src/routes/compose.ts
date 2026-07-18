import { Hono } from "hono";
import { ComposeRequestSchema, ComposeResponseSchema } from "@komyut/shared";
import type { AppDeps } from "../app";
import { composeRoute, type ComposeNode } from "../lib/composeAlgorithm";

/** A node row joined with its parent route's thread id. */
type NodeRow = {
  id: string;
  route_id: string;
  seq: number;
  lat: number;
  lng: number;
  label: string | null;
  routes: { thread_id: string } | { thread_id: string }[] | null;
};

export function routeComposeRoute({ supabase }: AppDeps) {
  const route = new Hono();

  // Stitch community-contributed nodes into a route from origin to destination.
  route.post("/compose", async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = ComposeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid request", issues: parsed.error.issues }, 400);
    }

    const { data, error } = await supabase
      .from("nodes")
      .select("id, route_id, seq, lat, lng, label, routes(thread_id)");

    if (error) {
      console.error("nodes query failed:", (error as { message?: string }).message);
      return c.json({ error: "Failed to load nodes" }, 500);
    }

    const nodes: ComposeNode[] = ((data ?? []) as NodeRow[]).map((row) => {
      const rel = Array.isArray(row.routes) ? row.routes[0] : row.routes;
      return {
        id: row.id,
        route_id: row.route_id,
        thread_id: rel?.thread_id ?? "",
        seq: row.seq,
        lat: row.lat,
        lng: row.lng,
        label: row.label ?? "",
      };
    });

    const result = composeRoute(nodes, parsed.data.origin, parsed.data.destination);
    if (!result) {
      return c.json({ error: "No route could be composed" }, 422);
    }

    const summary = result.existing
      ? `Existing community route across ${result.thread_ids.length} thread(s), ${result.distance_m} m.`
      : `New route stitched from ${result.route_ids.length} answers across ${result.thread_ids.length} threads, ${result.distance_m} m.`;

    const response = ComposeResponseSchema.parse({
      route: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: result.coordinates },
        properties: {
          existing: result.existing,
          distance_m: result.distance_m,
          thread_ids: result.thread_ids,
          route_ids: result.route_ids,
          steps: result.steps,
          summary,
        },
      },
    });

    return c.json({ data: response });
  });

  return route;
}
