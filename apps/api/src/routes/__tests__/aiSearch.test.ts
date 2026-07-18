import { describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { fakeSupabase, fakeSupabaseChains } from "./helpers";
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

const OTHER_THREAD_ID = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";

const otherThread = {
  ...sampleThread,
  id: OTHER_THREAD_ID,
  title: "How do I commute from Ateneo to Ayala?",
  body: "First time doing this trip, not sure where to transfer.",
};

/** An answer-route row as the join returns it: nodes nested, order not promised. */
const answer = (
  over: Partial<{
    id: string;
    thread_id: string;
    summary: string;
    created_at: string;
    nodes: { seq: number; label: string | null }[];
  }>,
) => ({
  id: "aaaaaaaa-0000-4000-8000-000000000001",
  thread_id: THREAD_ID,
  summary: "Carousel then walk",
  created_at: "2026-07-18T01:00:00+00:00",
  nodes: [],
  ...over,
});

/** Runs one search against threads + answer-routes and hands back the prompt. */
async function promptFor(threads: unknown[], routes: { data: unknown; error: unknown }) {
  let seen = "";
  const app = createApp({
    supabase: fakeSupabaseChains({
      threads: { data: threads, error: null },
      routes,
    }),
    chat: async (prompt) => {
      seen = prompt;
      return JSON.stringify({ answer: "ok", thread_ids: [] });
    },
  });

  const res = await search(app, "how do I get to Ayala?");
  return { res, prompt: seen };
}

describe("POST /v1/ai/search answer context", () => {
  it("puts an answer's summary and node labels into the prompt in seq order", async () => {
    const { res, prompt } = await promptFor([sampleThread], {
      data: [
        answer({
          summary: "LRT-2 then MRT-3",
          // deliberately out of order: the route must sort by seq, not by row order
          nodes: [
            { seq: 2, label: "Alight at Araneta-Cubao" },
            { seq: 1, label: "Board LRT-2 westbound at Katipunan" },
            { seq: 3, label: "Transfer to MRT-3 southbound" },
          ],
        }),
      ],
      error: null,
    });

    expect(res.status).toBe(200);
    expect(prompt).toContain("ANSWER 1: LRT-2 then MRT-3");
    expect(prompt).toContain("1. Board LRT-2 westbound at Katipunan");
    expect(prompt).toContain("2. Alight at Araneta-Cubao");
    expect(prompt).toContain("3. Transfer to MRT-3 southbound");
    expect(prompt.indexOf("Board LRT-2")).toBeLessThan(prompt.indexOf("Alight at Araneta"));
    expect(prompt.indexOf("Alight at Araneta")).toBeLessThan(prompt.indexOf("Transfer to MRT-3"));
  });

  it("nests each answer under its own thread and each node under its own answer", async () => {
    const { prompt } = await promptFor([sampleThread, otherThread], {
      data: [
        answer({
          id: "aaaaaaaa-0000-4000-8000-000000000001",
          thread_id: THREAD_ID,
          summary: "Carousel answer",
          nodes: [{ seq: 1, label: "Ride the busway from Monumento" }],
        }),
        answer({
          id: "aaaaaaaa-0000-4000-8000-000000000002",
          thread_id: OTHER_THREAD_ID,
          summary: "Ateneo answer",
          nodes: [{ seq: 1, label: "Walk to Katipunan station" }],
        }),
      ],
      error: null,
    });

    // each thread block runs until the next "[" id marker
    const blockFor = (id: string) => {
      const start = prompt.indexOf(`[${id}]`);
      const next = prompt.indexOf("\n\n[", start);
      return prompt.slice(start, next === -1 ? undefined : next);
    };

    const first = blockFor(THREAD_ID);
    expect(first).toContain("Carousel answer");
    expect(first).toContain("Ride the busway from Monumento");
    expect(first).not.toContain("Ateneo answer");
    expect(first).not.toContain("Walk to Katipunan station");

    const second = blockFor(OTHER_THREAD_ID);
    expect(second).toContain("Ateneo answer");
    expect(second).toContain("Walk to Katipunan station");
    expect(second).not.toContain("Carousel answer");
    expect(second).not.toContain("Ride the busway from Monumento");
  });

  it("still lists a thread that has no answers", async () => {
    const { prompt } = await promptFor([sampleThread, otherThread], {
      data: [answer({ thread_id: THREAD_ID, summary: "Carousel answer" })],
      error: null,
    });

    expect(prompt).toContain(`[${OTHER_THREAD_ID}]`);
    expect(prompt).toContain("How do I commute from Ateneo to Ayala?");
    // the unanswered thread carries no ANSWER block of its own
    const start = prompt.indexOf(`[${OTHER_THREAD_ID}]`);
    const next = prompt.indexOf("\n\n[", start);
    expect(prompt.slice(start, next === -1 ? undefined : next)).not.toContain("ANSWER");
  });

  it("caps the answers shown per thread", async () => {
    const { prompt } = await promptFor([sampleThread], {
      data: [1, 2, 3, 4, 5].map((n) =>
        answer({
          id: `aaaaaaaa-0000-4000-8000-00000000000${n}`,
          summary: `answer number ${n}`,
          created_at: `2026-07-1${n}T00:00:00+00:00`,
        }),
      ),
      error: null,
    });

    expect(prompt).toContain("answer number 1");
    expect(prompt).toContain("answer number 3");
    expect(prompt).not.toContain("answer number 4");
    expect(prompt).not.toContain("answer number 5");
  });

  it("caps the nodes shown per answer", async () => {
    const { prompt } = await promptFor([sampleThread], {
      data: [
        answer({
          nodes: Array.from({ length: 12 }, (_, i) => ({
            seq: i + 1,
            label: `step number ${i + 1}`,
          })),
        }),
      ],
      error: null,
    });

    expect(prompt).toContain("step number 8");
    expect(prompt).not.toContain("step number 9");
    expect(prompt).not.toContain("step number 12");
  });

  it("degrades to threads-only when the answers query fails", async () => {
    const { res, prompt } = await promptFor([sampleThread], {
      data: null,
      error: { message: "routes exploded" },
    });

    expect(res.status).toBe(200);
    expect(prompt).toContain(`[${THREAD_ID}]`);
    expect(prompt).not.toContain("ANSWER 1:");
  });

  it("tells the model that an answer is evidence but a bare question is not", async () => {
    const { prompt } = await promptFor([sampleThread], { data: [], error: null });

    expect(prompt).toContain("ANSWER");
    expect(prompt.toLowerCase()).toContain("evidence");
  });
});
