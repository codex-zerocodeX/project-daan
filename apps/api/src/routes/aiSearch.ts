import { Hono } from "hono";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
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
/** Answers per thread. The first few carry the consensus; the tail is noise. */
const ANSWERS_PER_THREAD = 3;
/** Steps per answer. Long enough for a real multi-leg commute, short enough to fit. */
const NODES_PER_ANSWER = 8;
/** An answer summary is a headline, not the directions — the nodes carry those. */
const SUMMARY_CHARS = 200;
/** A node label is one instruction; anything longer is prose that got pasted in. */
const LABEL_CHARS = 120;

type Candidate = { id: string; title: string; body: string; category: string };
type Turn = { question: string; answer: string };
/** An answer-route flattened for prompting: its summary plus its steps in order. */
type Answer = { summary: string; steps: string[] };

function buildPrompt(
  query: string,
  candidates: Candidate[],
  answersByThread: Map<string, Answer[]>,
  history: Turn[],
): string {
  const threads = candidates
    .map((t) => {
      const head = `[${t.id}] (${t.category}) ${t.title}\n${t.body.slice(0, BODY_CHARS)}`;
      const answers = (answersByThread.get(t.id) ?? []).map((a, i) => {
        const steps = a.steps.map((s, n) => `    ${n + 1}. ${s}`);
        return [`  ANSWER ${i + 1}: ${a.summary}`, ...steps].join("\n");
      });
      // A thread with no answers is just its own question - no empty block.
      return [head, ...answers].join("\n");
    })
    .join("\n\n");

  return [
    "You help Filipino commuters by answering questions using ONLY the community threads below.",
    "Never invent routes, fares, or thread ids. If the threads do not answer the question, say so plainly.",
    "",
    // Threads are questions; the ANSWER blocks under them are the actual
    // knowledge. Conflating the two either invents facts from a question or
    // throws away a real answer, so spell out which is which.
    "IMPORTANT: a thread is a QUESTION. A thread asking whether something is true",
    "is NOT evidence that it is true. A thread with no ANSWER block under it is",
    "unanswered: if such threads merely ask the same question, say that other",
    "commuters have asked it too but it is unanswered.",
    "",
    "An ANSWER block IS evidence: it is a reply posted by a commuter who made the",
    "trip, and its numbered steps are the directions they gave. You may state what",
    "an ANSWER says as fact and cite the thread it sits under. Prefer answers over",
    "thread bodies. Still never add a step, fare, or line that no ANSWER mentions.",
    "",
    "THREADS:",
    threads,
    "",
    // Earlier turns resolve pronouns ("what about at night?"). They are context
    // for reading the question, never a source of facts.
    ...(history.length > 0
      ? [
          "EARLIER IN THIS CONVERSATION (context only - never cite it as a source):",
          ...history.map((t) => `Q: ${t.question}\nA: ${t.answer}`),
          "",
        ]
      : []),
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

/** An answer-route row with its nodes nested by the join. */
type AnswerRow = {
  thread_id: string;
  summary: string | null;
  created_at: string;
  nodes: { seq: number; label: string | null }[] | null;
};

/**
 * Load the answers for the candidate threads, grouped by thread.
 *
 * Answers are an enrichment: search still works without them, so every failure
 * here returns an empty map instead of propagating. Losing the answers degrades
 * the result; failing the request loses it entirely.
 */
async function loadAnswers(
  supabase: SupabaseClient,
  threadIds: string[],
): Promise<Map<string, Answer[]>> {
  const byThread = new Map<string, Answer[]>();

  let rows: AnswerRow[];
  try {
    const { data, error } = await supabase
      .from("routes")
      .select("id, thread_id, summary, created_at, nodes(seq, label)")
      .in("thread_id", threadIds);

    if (error) {
      console.error("answers query failed:", (error as { message?: string }).message);
      return byThread;
    }
    rows = (data ?? []) as AnswerRow[];
  } catch (err) {
    console.error("answers query threw:", (err as Error).message);
    return byThread;
  }

  // Oldest first: the earliest answers are the ones the thread has had time to
  // correct, and a stable order keeps the per-thread cap deterministic.
  const ordered = [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at));

  for (const row of ordered) {
    const bucket = byThread.get(row.thread_id) ?? [];
    if (bucket.length >= ANSWERS_PER_THREAD) continue;

    const steps = [...(row.nodes ?? [])]
      .sort((a, b) => a.seq - b.seq)
      // an unlabelled node is a map point with nothing to read out loud
      .flatMap((n) => (n.label ? [n.label.slice(0, LABEL_CHARS)] : []))
      .slice(0, NODES_PER_ANSWER);

    bucket.push({
      summary: (row.summary ?? "").slice(0, SUMMARY_CHARS),
      steps,
    });
    byThread.set(row.thread_id, bucket);
  }

  return byThread;
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

    const answers = await loadAnswers(
      supabase,
      candidates.map((t) => t.id),
    );

    let rawReply: string;
    try {
      rawReply = await chat(
        buildPrompt(parsed.data.query, candidates, answers, parsed.data.history),
      );
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
