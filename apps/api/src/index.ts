import { serve } from "@hono/node-server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { createApp } from "./app";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env first.");
  process.exit(1);
}

const app = createApp({
  supabase: createClient(url, key),
  openai: openaiKey ? new OpenAI({ apiKey: openaiKey }) : undefined,
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-5.6",
});
const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port }, () => {
  console.log(`Alitaptap API listening on http://localhost:${port}`);
});
