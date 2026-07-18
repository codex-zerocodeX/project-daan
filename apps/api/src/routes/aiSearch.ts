import { Hono } from "hono";
import { z } from "zod";
import { AiSearchRequestSchema, AiSearchResponseSchema } from "@komyut/shared";
import type { AppDeps } from "../app";

// What we accept *from the model*: deliberately looser than the response
// contract. Ids are plain strings here because membership in the candidate set
// is the real check - rejecting on uuid format would throw away a good answer
// over one malformed citation.
const ModelReplySchema = z.object({
  answer: z.string(),
  thread_ids: z.array(z.string()).default([]),
});

/** Candidate pool size. Small enough to fit one cheap prompt without retrieval. */
const CANDIDATE_LIMIT = 50;
/** Thread bodies are truncated before prompting — the gist is enough to rank on. */
const BODY_CHARS = 300;

type Candidate = { id: string; title: string; body: string; category: string };

function buildPrompt(query: string, candidates: Candidate[]): string {
  const threads = candidates
    .map((t) => `[${t.id}] (${t.category}) ${t.title}\n${t.body.slice(0, BODY_CHARS)}`)
    .join("\n\n");

  return [
    "You help Filipino commuters by answering questions using ONLY the community threads below.",
    "Never invent routes, fares, or thread ids. If the threads do not answer the question, say so plainly.",
    "",
    // Many threads are themselves unanswered questions. Treating one as fact
    // produces confident misinformation with a citation attached, so be explicit.
    "IMPORTANT: many threads are questions, not answers. A thread asking whether",
    "something is true is NOT evidence that it is true. Only state something as",
    "fact if a thread actually reports it. If the threads merely ask the same",
    "question, say that other commuters have asked it too but it is unanswered.",
    "",
    "THREADS:",
    threads,
    "",
    `QUESTION: ${query}`,
    "",
    'Reply with JSON only: {"answer": "<2-3 sentences>", "thread_ids": ["<id you used>"]}',
    "Cite at most 3 ids, most relevant first. Use an empty array when nothing is relevant.",
    // Otherwise it cites the answer AND the question it answers, and the UI
    // renders a source card that tells the reader nothing.
    "Cite only threads whose content you actually used. Never cite a thread that",
    "merely asks the same question.",
    // Without this, gibberish or an off-topic string gets answered with whatever
    // thread happens to be first - a confident answer to a question nobody asked.
    "If the question is unintelligible, empty of meaning, or not about commuting,",
    "reply that you cannot tell what is being asked and cite nothing. Do not fall",
    "back to summarising an arbitrary thread.",
  ].join("\n");
}

export function aiSearchRoute({ supabase, chat }: AppDeps) {
  const route = new Hono();

  // Natural-language search over existing threads. Additive: the app works
  // fine without it, so every failure path degrades to a plain 503.
  route.post("/search", async (c) => {
    if (!chat) {
      return c.json({ error: "AI search unavailable" }, 503);
    }

    const body = await c.req.json().catch(() => null);
    const parsed = AiSearchRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid request", issues: parsed.error.issues }, 400);
    }

    const { data, error } = await supabase
      .from("threads")
      .select("id, title, body, category")
      .order("created_at", { ascending: false })
      .limit(CANDIDATE_LIMIT);

    if (error) {
      console.error("threads query failed:", (error as { message?: string }).message);
      return c.json({ error: "Failed to load threads" }, 500);
    }

    const candidates = (data ?? []) as Candidate[];
    if (candidates.length === 0) {
      return c.json({
        data: { answer: "There are no threads to search yet.", thread_ids: [] },
      });
    }

    let rawReply: string;
    try {
      rawReply = await chat(buildPrompt(parsed.data.query, candidates));
    } catch (err) {
      console.error("openai call failed:", (err as Error).message);
      return c.json({ error: "AI search unavailable" }, 503);
    }

    // A refusal or a stray prose preamble lands here as non-JSON — treat it
    // the same as a malformed payload rather than throwing.
    let payload: unknown;
    try {
      payload = JSON.parse(rawReply);
    } catch {
      payload = null;
    }

    const reply = ModelReplySchema.safeParse(payload);
    if (!reply.success) {
      console.error("openai returned an unusable payload");
      return c.json({ error: "AI search unavailable" }, 503);
    }

    // Trust the prose, not the citations: keep only ids we actually sent.
    const known = new Set(candidates.map((t) => t.id));
    const result = AiSearchResponseSchema.parse({
      answer: reply.data.answer,
      thread_ids: reply.data.thread_ids.filter((id) => known.has(id)).slice(0, 5),
    });

    return c.json({ data: result });
  });

  return route;
}
