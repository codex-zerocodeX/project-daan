import { describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { fakeSupabase } from "./helpers";

function makeApp() {
  return createApp({ supabase: fakeSupabase({ data: [], error: null }) });
}

describe("POST /v1/routes/plan", () => {
  it("returns a mock GeoJSON route from origin to destination", async () => {
    const res = await makeApp().request("/v1/routes/plan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        origin: { lat: 14.5547, lng: 121.0244 },
        destination: { lat: 14.6091, lng: 121.0223 },
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.route.geometry.type).toBe("LineString");
    expect(json.data.route.geometry.coordinates[0]).toEqual([121.0244, 14.5547]);
    expect(json.data.route.geometry.coordinates[1]).toEqual([121.0223, 14.6091]);
    expect(json.data.route.properties.walkability_score).toBe(50);
  });

  it("rejects out-of-range coordinates with 400", async () => {
    const res = await makeApp().request("/v1/routes/plan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        origin: { lat: 999, lng: 121.0244 },
        destination: { lat: 14.6091, lng: 121.0223 },
      }),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid request");
    expect(Array.isArray(json.issues)).toBe(true);
  });

  it("rejects a non-JSON body with 400", async () => {
    const res = await makeApp().request("/v1/routes/plan", { method: "POST", body: "not json" });
    expect(res.status).toBe(400);
  });
});
