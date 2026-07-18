import { serve } from "@hono/node-server";
import { createClient } from "@supabase/supabase-js";
import { createApp } from "./app";
import { openAiChat } from "./lib/openai";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env first.");
  process.exit(1);
}

const openAiKey = process.env.OPENAI_API_KEY;
if (!openAiKey) {
  console.warn("No OPENAI_API_KEY set - AI thread search will return 503.");
}

const app = createApp({
  supabase: createClient(url, key),
  chat: openAiKey
    ? openAiChat(openAiKey, process.env.OPENAI_MODEL)
    : undefined,
  corsOrigin: process.env.CORS_ORIGIN,
});
const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port }, () => {
  console.log(`Komyut API listening on http://localhost:${port}`);
});
