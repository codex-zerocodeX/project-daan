import { describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { fakeSupabase } from "./helpers";

const sampleThread = {
  id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  author_id: "5a2f8f3e-3b2a-4c58-9d7a-1e2f3a4b5c6d",
  title: "EDSA Carousel is fastest at rush hour",
  body: "Take the busway from Monumento. Skip the regular city bus.",
  category: "route",
  image_url: null,
  created_at: "2026-07-18T00:00:00+00:00",
};

describe("GET /v1/threads", () => {
  it("returns threads from supabase", async () => {
    const app = createApp({ supabase: fakeSupabase({ data: [sampleThread], error: null }) });
    const res = await app.request("/v1/threads");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: [sampleThread] });
  });

  it("returns a generic 500 when supabase fails", async () => {
    const app = createApp({ supabase: fakeSupabase({ data: null, error: { message: "boom" } }) });
    const res = await app.request("/v1/threads");
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to load threads" });
  });
});
