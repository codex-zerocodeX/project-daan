import { describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { fakeSupabase } from "./helpers";
import type { ChatFn } from "../../lib/openai";

const THREAD_ID = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";

const sampleThread = {
  id: THREAD_ID,
  author_id: "5a2f8f3e-3b2a-4c58-9d7a-1e2f3a4b5c6d",
  title: "EDSA Carousel is fastest at rush hour",
  body: "Take the busway from Monumento. Skip the regular city bus.",
  category: "route",
  image_url: null,
  created_at: "2026-07-18T00:00:00+00:00",
};

/** A ChatFn that ignores the prompt and replays a canned model reply. */
const replyWith = (content: string): ChatFn => async () => content;

const search = (app: ReturnType<typeof createApp>, query: unknown) =>
  app.request("/v1/ai/search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query }),
  });

describe("POST /v1/ai/search", () => {
  it("answers with the thread ids the model cited", async () => {
    const app = createApp({
      supabase: fakeSupabase({ data: [sampleThread], error: null }),
      chat: replyWith(
        JSON.stringify({ answer: "Use the EDSA Carousel.", thread_ids: [THREAD_ID] }),
      ),
    });

    const res = await search(app, "fastest way along EDSA");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      data: { answer: "Use the EDSA Carousel.", thread_ids: [THREAD_ID] },
    });
  });

  it("drops cited ids that are not real threads", async () => {
    const app = createApp({
      supabase: fakeSupabase({ data: [sampleThread], error: null }),
      chat: replyWith(
        JSON.stringify({
          answer: "Use the EDSA Carousel.",
          // second id is a hallucination — never appeared in the candidates
          thread_ids: [THREAD_ID, "11111111-2222-4333-8444-555555555555"],
        }),
      ),
    });

    const res = await search(app, "fastest way along EDSA");
    const body = (await res.json()) as { data: { thread_ids: string[] } };
    expect(body.data.thread_ids).toEqual([THREAD_ID]);
  });

  it("keeps the answer when a citation is not even a uuid", async () => {
    const app = createApp({
      supabase: fakeSupabase({ data: [sampleThread], error: null }),
      chat: replyWith(
        JSON.stringify({ answer: "Use the EDSA Carousel.", thread_ids: ["thread-1"] }),
      ),
    });

    const res = await search(app, "fastest way along EDSA");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { data: { answer: string; thread_ids: string[] } };
    expect(body.data.answer).toBe("Use the EDSA Carousel.");
    expect(body.data.thread_ids).toEqual([]);
  });

  it("passes prior turns to the model as context", async () => {
    let seen = "";
    const app = createApp({
      supabase: fakeSupabase({ data: [sampleThread], error: null }),
      chat: async (prompt) => {
        seen = prompt;
        return JSON.stringify({ answer: "At night it is quieter.", thread_ids: [] });
      },
    });

    const res = await app.request("/v1/ai/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: "what about at night?",
        history: [{ question: "how do I get to Ayala?", answer: "Take the busway." }],
      }),
    });

    expect(res.status).toBe(200);
    expect(seen).toContain("how do I get to Ayala?");
    expect(seen).toContain("Take the busway.");
  });

  it("works with no history field at all", async () => {
    const app = createApp({
      supabase: fakeSupabase({ data: [sampleThread], error: null }),
      chat: replyWith(JSON.stringify({ answer: "Use the busway.", thread_ids: [] })),
    });

    const res = await app.request("/v1/ai/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: "fastest way along EDSA" }),
    });
    expect(res.status).toBe(200);
  });

  it("rejects a query that is too short", async () => {
    const app = createApp({
      supabase: fakeSupabase({ data: [sampleThread], error: null }),
      chat: replyWith("{}"),
    });

    const res = await search(app, "no");
    expect(res.status).toBe(400);
  });

  it("returns 503 when no chat client is configured", async () => {
    const app = createApp({ supabase: fakeSupabase({ data: [sampleThread], error: null }) });
    const res = await search(app, "fastest way along EDSA");
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "AI search unavailable" });
  });

  it("returns 503 when the model replies with unusable JSON", async () => {
    const app = createApp({
      supabase: fakeSupabase({ data: [sampleThread], error: null }),
      chat: replyWith("I'm afraid I can't do that"),
    });

    const res = await search(app, "fastest way along EDSA");
    expect(res.status).toBe(503);
  });

  it("answers without calling the model when there are no threads", async () => {
    let called = false;
    const app = createApp({
      supabase: fakeSupabase({ data: [], error: null }),
      chat: async () => {
        called = true;
        return "{}";
      },
    });

    const res = await search(app, "fastest way along EDSA");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { data: { thread_ids: string[] } };
    expect(body.data.thread_ids).toEqual([]);
    expect(called).toBe(false);
  });
});
