// Minimal OpenAI chat wrapper. Deliberately a bare fetch rather than the SDK:
// one call site, one shape, and injecting a plain function keeps routes testable.

/** Sends a prompt, returns the model's raw reply text. Throws on any failure. */
export type ChatFn = (prompt: string) => Promise<string>;

const ENDPOINT = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-5.6-luna";
const TIMEOUT_MS = 30_000;
// A reasoning model spends completion tokens thinking before it emits anything,
// so this budget covers reasoning + the JSON answer, not the answer alone.
const MAX_COMPLETION_TOKENS = 2000;

export function openAiChat(apiKey: string): ChatFn {
  return async (prompt) => {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // gpt-5.6 rejects `max_tokens` and any `temperature` other than the
        // default, so neither may be reintroduced without checking the model.
        model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`OpenAI responded ${res.status}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned no content");
    }
    return content;
  };
}
