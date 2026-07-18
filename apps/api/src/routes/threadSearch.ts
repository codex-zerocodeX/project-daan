import { Hono } from "hono";
import { ThreadSearchRequestSchema, ThreadSearchResponseSchema } from "@komyut/shared";
import type { AppDeps } from "../app";
import { rankThreads, type RelevanceNode } from "../lib/threadRelevance";

/** A node row joined with its parent route's thread id. */
type NodeRow = {
  route_id: string;
  seq: number;
  lat: number;
  lng: number;
  routes: { thread_id: string } | { thread_id: string }[] | null;
};

type ThreadRow = { id: string };

export function threadSearchRoute({ supabase }: AppDeps) {
  const route = new Hono();

  // Find the community threads whose answers best serve origin -> destination.
  route.post("/search", async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = ThreadSearchRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid request", issues: parsed.error.issues }, 400);
    }

    const { data: nodeData, error: nodeError } = await supabase
      .from("nodes")
      .select("route_id, seq, lat, lng, routes(thread_id)");

    if (nodeError) {
      console.error("nodes query failed:", (nodeError as { message?: string }).message);
      return c.json({ error: "Failed to search threads" }, 500);
    }

    const nodes: RelevanceNode[] = [];
    for (const row of (nodeData ?? []) as NodeRow[]) {
      const rel = Array.isArray(row.routes) ? row.routes[0] : row.routes;
      // an orphaned node cannot be attributed to a thread, so it cannot match
      if (!rel?.thread_id) continue;
      nodes.push({
        thread_id: rel.thread_id,
        route_id: row.route_id,
        seq: row.seq,
        lat: row.lat,
        lng: row.lng,
      });
    }

    const ranked = rankThreads(nodes, parsed.data.origin, parsed.data.destination);
    // No relevant thread is a normal outcome - the client falls back to compose.
    if (ranked.length === 0) {
      return c.json({ data: ThreadSearchResponseSchema.parse({ results: [] }) });
    }

    const { data: threadData, error: threadError } = await supabase
      .from("threads")
      .select("id, author_id, title, body, category, image_url, created_at")
      .in(
        "id",
        ranked.map((result) => result.thread_id),
      );

    if (threadError) {
      console.error("threads query failed:", (threadError as { message?: string }).message);
      return c.json({ error: "Failed to search threads" }, 500);
    }

    const threadsById = new Map(
      ((threadData ?? []) as ThreadRow[]).map((thread) => [thread.id, thread]),
    );

    // answer_count is derived from the nodes we already loaded: an answer-route
    // with no nodes contributes nothing to the map, so it does not count.
    const answerRoutes = new Map<string, Set<string>>();
    for (const node of nodes) {
      const bucket = answerRoutes.get(node.thread_id);
      if (bucket) bucket.add(node.route_id);
      else answerRoutes.set(node.thread_id, new Set([node.route_id]));
    }

    const results = ranked.flatMap((result) => {
      const thread = threadsById.get(result.thread_id);
      // the thread row may be gone (deleted, or hidden by RLS) - drop it
      if (!thread) return [];
      return [
        {
          thread,
          match: result.match,
          origin_distance_m: result.origin_distance_m,
          destination_distance_m: result.destination_distance_m,
          route_ids: result.route_ids,
          answer_count: answerRoutes.get(result.thread_id)?.size ?? 0,
        },
      ];
    });

    return c.json({ data: ThreadSearchResponseSchema.parse({ results }) });
  });

  return route;
}
