import { Hono } from "hono";

export function healthRoute() {
  const route = new Hono();
  route.get("/", (c) => c.json({ data: { status: "ok" } }));
  return route;
}
