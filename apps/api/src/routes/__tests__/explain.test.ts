import { describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { fakeOpenAI, fakeSupabase } from "./helpers";

const body = JSON.stringify({
  route: {
    summary: "Walk to the terminal, then take the jeep to Cubao.",
    distance_meter: 2400,
    step: ["Walk to the terminal", "Take the Cubao jeep"],
  },
  preference: "Prefer fewer transfers",
});

function post(app: ReturnType<typeof createApp>, raw = body) {
  return app.request("/v1/routes/explain", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw,
  });
}

describe("POST /v1/routes/explain", () => {
  it("returns a schema-validated route explanation", async () => {
    const app = createApp({
      supabase: fakeSupabase({ data: [], error: null }),
      openai: fakeOpenAI({
        headline: "A simple one-ride route to Cubao",
        reason: ["It follows the supplied terminal and jeep steps."],
        caution: [],
      }),
    });

    const response = await post(app);
    expect(response.status).toBe(200);
    expect((await response.json()).data.headline).toBe("A simple one-ride route to Cubao");
  });

  it("rejects an invalid route receipt", async () => {
    const app = createApp({
      supabase: fakeSupabase({ data: [], error: null }),
      openai: fakeOpenAI({}),
    });

    const response = await post(app, JSON.stringify({ route: { summary: "Missing fields" } }));
    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe("Invalid request");
  });

  it("returns 503 when OpenAI is not configured", async () => {
    const app = createApp({ supabase: fakeSupabase({ data: [], error: null }) });
    const response = await post(app);
    expect(response.status).toBe(503);
  });

  it("rejects model output that does not match the response schema", async () => {
    const app = createApp({
      supabase: fakeSupabase({ data: [], error: null }),
      openai: fakeOpenAI({ headline: "Incomplete" }),
    });

    const response = await post(app);
    expect(response.status).toBe(502);
    expect((await response.json()).error).toBe("Route explanation was unavailable");
  });
});
