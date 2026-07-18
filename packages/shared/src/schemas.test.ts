import { describe, expect, it } from "vitest";
import {
  RoutePlanRequestSchema,
  ThreadSchema,
  VoteSchema,
} from "./schemas";

const validThread = {
  id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  author_id: "5a2f8f3e-3b2a-4c58-9d7a-1e2f3a4b5c6d",
  title: "EDSA Carousel is fastest at rush hour",
  body: "Take the busway from Monumento. Skip the regular city bus.",
  category: "route",
  image_url: null,
  created_at: "2026-07-18T00:00:00+00:00",
};

describe("ThreadSchema", () => {
  it("accepts a valid thread", () => {
    expect(ThreadSchema.parse(validThread)).toEqual(validThread);
  });

  it("rejects an unknown category", () => {
    const result = ThreadSchema.safeParse({ ...validThread, category: "gossip" });
    expect(result.success).toBe(false);
  });
});

describe("VoteSchema", () => {
  it("rejects a zero vote value", () => {
    const result = VoteSchema.safeParse({
      thread_id: validThread.id,
      user_id: validThread.author_id,
      value: 0,
      created_at: validThread.created_at,
    });
    expect(result.success).toBe(false);
  });
});

describe("RoutePlanRequestSchema", () => {
  it("rejects out-of-range latitude", () => {
    const result = RoutePlanRequestSchema.safeParse({
      origin: { lat: 999, lng: 121.0 },
      destination: { lat: 14.6, lng: 121.0 },
    });
    expect(result.success).toBe(false);
  });
});
