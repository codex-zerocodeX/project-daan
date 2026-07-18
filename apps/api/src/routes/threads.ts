import { Hono } from "hono";
import { z } from "zod";
import { ThreadSchema } from "@daan/shared";
import type { AppDeps } from "../app";

export function threadsRoute({ supabase }: AppDeps) {
  const route = new Hono();

  route.get("/", async (c) => {
    const { data, error } = await supabase
      .from("threads")
      .select("id, author_id, title, body, category, image_url, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("threads query failed:", error.message);
      return c.json({ error: "Failed to load threads" }, 500);
    }
    return c.json({ data: z.array(ThreadSchema).parse(data) });
  });

  return route;
}
