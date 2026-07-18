import { describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { fakeSupabase } from "./helpers";

const supabase = fakeSupabase({ data: [], error: null });
const ALLOWED = "https://komyut-web.pages.dev";

const health = (app: ReturnType<typeof createApp>, origin: string) =>
  app.request("/health", { headers: { Origin: origin } });

describe("CORS", () => {
  it("allows any origin when none is configured", async () => {
    const res = await health(createApp({ supabase }), "https://anything.example");
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("echoes an allowed origin from the list", async () => {
    const app = createApp({
      supabase,
      corsOrigin: `${ALLOWED}, http://localhost:8081`,
    });
    for (const origin of [ALLOWED, "http://localhost:8081"]) {
      const res = await health(app, origin);
      expect(res.headers.get("access-control-allow-origin")).toBe(origin);
    }
  });

  it("does not allow an origin outside the list", async () => {
    const app = createApp({ supabase, corsOrigin: ALLOWED });
    const res = await health(app, "https://evil.example");
    expect(res.headers.get("access-control-allow-origin")).not.toBe(
      "https://evil.example",
    );
  });

  it("answers a preflight for the AI search endpoint", async () => {
    const app = createApp({ supabase, corsOrigin: ALLOWED });
    const res = await app.request("/v1/ai/search", {
      method: "OPTIONS",
      headers: {
        Origin: ALLOWED,
        "Access-Control-Request-Method": "POST",
      },
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe(ALLOWED);
  });
});
