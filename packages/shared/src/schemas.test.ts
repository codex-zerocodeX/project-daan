import { describe, expect, it } from "vitest";
import {
  AiSearchRequestSchema,
  AiSearchResponseSchema,
  NodeSchema,
  RoutePlanRequestSchema,
  RouteSchema,
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

describe("RouteSchema", () => {
  it("accepts a valid answer-route", () => {
    const route = {
      id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      thread_id: "5a2f8f3e-3b2a-4c58-9d7a-1e2f3a4b5c6d",
      author_id: "5a2f8f3e-3b2a-4c58-9d7a-1e2f3a4b5c6d",
      summary: "Jeep to Cubao, then walk.",
      created_at: "2026-07-18T00:00:00+00:00",
    };
    expect(RouteSchema.parse(route)).toEqual(route);
  });
});

describe("NodeSchema", () => {
  it("rejects a negative seq", () => {
    const result = NodeSchema.safeParse({
      id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      route_id: "5a2f8f3e-3b2a-4c58-9d7a-1e2f3a4b5c6d",
      seq: -1,
      lat: 14.6,
      lng: 121.0,
      label: "Board here",
      image_url: null,
      created_at: "2026-07-18T00:00:00+00:00",
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

describe("AiSearchRequestSchema", () => {
  it("rejects a query that is too short to be meaningful", () => {
    expect(AiSearchRequestSchema.safeParse({ query: "hi" }).success).toBe(false);
  });
});

describe("AiSearchResponseSchema", () => {
  it("round-trips an answer with thread citations", () => {
    const res = {
      answer: "Take the Cubao-bound jeep from Katipunan.",
      thread_ids: ["9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"],
    };
    expect(AiSearchResponseSchema.parse(res)).toEqual(res);
  });

  it("rejects a non-uuid thread id", () => {
    const result = AiSearchResponseSchema.safeParse({
      answer: "…",
      thread_ids: ["not-a-uuid"],
    });
    expect(result.success).toBe(false);
  });
});
