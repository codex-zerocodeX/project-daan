import { describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { fakeSupabaseSelect } from "./helpers";

const ROUTE = "11111111-1111-4111-8111-111111111111";
const THREAD = "22222222-2222-4222-8222-222222222222";
const nodeId = (i: number) => `00000000-0000-4000-8000-00000000000${i}`;

const spanningNodes = [
  { id: nodeId(1), route_id: ROUTE, seq: 0, lat: 14.6005, lng: 121.0005, label: "Board", routes: { thread_id: THREAD } },
  { id: nodeId(2), route_id: ROUTE, seq: 1, lat: 14.603, lng: 121.003, label: "Transfer", routes: { thread_id: THREAD } },
  { id: nodeId(3), route_id: ROUTE, seq: 2, lat: 14.606, lng: 121.006, label: "Alight", routes: { thread_id: THREAD } },
];

const body = JSON.stringify({
  origin: { lat: 14.6, lng: 121.0 },
  destination: { lat: 14.6062, lng: 121.0062 },
});

function post(app: ReturnType<typeof createApp>, raw = body) {
  return app.request("/v1/routes/compose", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw,
  });
}

describe("POST /v1/routes/compose", () => {
  it("composes a GeoJSON route from community nodes", async () => {
    const app = createApp({ supabase: fakeSupabaseSelect({ data: spanningNodes, error: null }) });
    const res = await post(app);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.route.geometry.type).toBe("LineString");
    expect(json.data.route.properties.existing).toBe(true);
    expect(json.data.route.properties.route_ids).toEqual([ROUTE]);
    expect(json.data.route.properties.thread_ids).toEqual([THREAD]);
    expect(json.data.route.properties.steps).toHaveLength(3);
  });

  it("returns 422 when no route can be composed", async () => {
    const app = createApp({ supabase: fakeSupabaseSelect({ data: [], error: null }) });
    const res = await post(app);
    expect(res.status).toBe(422);
    expect((await res.json()).error).toBe("No route could be composed");
  });

  it("rejects an out-of-range coordinate with 400", async () => {
    const app = createApp({ supabase: fakeSupabaseSelect({ data: [], error: null }) });
    const res = await post(app, JSON.stringify({ origin: { lat: 999, lng: 121 }, destination: { lat: 14.6, lng: 121 } }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Invalid request");
  });

  it("returns a generic 500 when the nodes query fails", async () => {
    const app = createApp({ supabase: fakeSupabaseSelect({ data: null, error: { message: "boom" } }) });
    const res = await post(app);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Failed to load nodes");
  });
});
