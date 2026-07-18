import { describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { fakeSupabaseTables } from "./helpers";

const AUTHOR = "33333333-3333-4333-8333-333333333333";
const THREAD_EXACT = "11111111-1111-4111-8111-111111111111";
const THREAD_PARTIAL = "22222222-2222-4222-8222-222222222222";
const ROUTE_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const ROUTE_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

const thread = (id: string, title: string) => ({
  id,
  author_id: AUTHOR,
  title,
  body: "How do I get there?",
  category: "route",
  image_url: null,
  created_at: "2026-01-01T00:00:00.000Z",
});

const nodes = [
  { route_id: ROUTE_A, seq: 0, lat: 14.6005, lng: 121.0, routes: { thread_id: THREAD_EXACT } },
  { route_id: ROUTE_A, seq: 1, lat: 14.625, lng: 121.0, routes: { thread_id: THREAD_EXACT } },
  { route_id: ROUTE_A, seq: 2, lat: 14.6495, lng: 121.0, routes: { thread_id: THREAD_EXACT } },
  { route_id: ROUTE_B, seq: 0, lat: 14.601, lng: 121.0, routes: { thread_id: THREAD_PARTIAL } },
  { route_id: ROUTE_B, seq: 1, lat: 14.62, lng: 121.0, routes: { thread_id: THREAD_PARTIAL } },
];

const threads = [thread(THREAD_EXACT, "Cubao to Katipunan"), thread(THREAD_PARTIAL, "Cubao to Anonas")];

const body = JSON.stringify({
  origin: { lat: 14.6, lng: 121.0 },
  destination: { lat: 14.65, lng: 121.0 },
});

function post(app: ReturnType<typeof createApp>, raw = body) {
  return app.request("/v1/threads/search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw,
  });
}

describe("POST /v1/threads/search", () => {
  it("returns hydrated threads ranked exact-first", async () => {
    const app = createApp({
      supabase: fakeSupabaseTables({
        nodes: { data: nodes, error: null },
        threads: { data: threads, error: null },
      }),
    });

    const res = await post(app);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.data.results).toHaveLength(2);

    const [first, second] = json.data.results;
    expect(first.thread.id).toBe(THREAD_EXACT);
    expect(first.thread.title).toBe("Cubao to Katipunan");
    expect(first.match).toBe("exact");
    expect(first.route_ids).toEqual([ROUTE_A]);
    expect(first.answer_count).toBe(1);
    expect(first.origin_distance_m).toBeLessThan(800);
    expect(first.destination_distance_m).toBeLessThan(800);

    expect(second.thread.id).toBe(THREAD_PARTIAL);
    expect(second.match).toBe("partial");
    expect(second.destination_distance_m).toBeNull();
  });

  it("returns 200 with an empty list when no thread is relevant", async () => {
    const app = createApp({
      supabase: fakeSupabaseTables({
        nodes: { data: [], error: null },
        threads: { data: [], error: null },
      }),
    });

    const res = await post(app);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: { results: [] } });
  });

  it("rejects an out-of-range coordinate with 400", async () => {
    const app = createApp({
      supabase: fakeSupabaseTables({ nodes: { data: [], error: null } }),
    });

    const res = await post(
      app,
      JSON.stringify({ origin: { lat: 999, lng: 121 }, destination: { lat: 14.6, lng: 121 } }),
    );
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Invalid request");
    expect(json.issues.length).toBeGreaterThan(0);
  });

  it("returns a generic 500 when the nodes query fails", async () => {
    const app = createApp({
      supabase: fakeSupabaseTables({ nodes: { data: null, error: { message: "boom" } } }),
    });

    const res = await post(app);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to search threads" });
  });

  it("returns a generic 500 when the threads query fails", async () => {
    const app = createApp({
      supabase: fakeSupabaseTables({
        nodes: { data: nodes, error: null },
        threads: { data: null, error: { message: "boom" } },
      }),
    });

    const res = await post(app);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to search threads" });
  });
});
