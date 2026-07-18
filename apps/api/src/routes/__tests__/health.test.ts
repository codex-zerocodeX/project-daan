import { describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { fakeSupabase } from "./helpers";

describe("GET /health", () => {
  it("reports ok", async () => {
    const app = createApp({ supabase: fakeSupabase({ data: [], error: null }) });
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Daan-Service")).toBe("api");
    expect(await res.json()).toEqual({ data: { status: "ok" } });
  });
});
