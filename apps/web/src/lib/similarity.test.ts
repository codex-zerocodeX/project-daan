import { describe, expect, it } from "vitest";
import { review, routeThread } from "../fixture/discussion";
import { cosineSimilarity, matchReview } from "./similarity";
import { resolveThread, reviewForTarget, summarizeReview } from "./thread";

describe("review similarity", () => {
  it("ranks the footbridge review above unrelated shade feedback", () => {
    const match = matchReview("crowded footbridge stairs and crossing", review);
    expect(match[0].review.reviewId).toBe("review-node-footbridge-2");
    expect(match[0].similarity).toBeGreaterThanOrEqual(0.35);
  });

  it("returns no match below the threshold", () => {
    expect(matchReview("wheel bearing replacement", review)).toEqual([]);
    expect(cosineSimilarity("wheel bearing", "sidewalk shade")).toBe(0);
  });
});

describe("review compilation", () => {
  it("aggregates only the requested target", () => {
    const summary = summarizeReview("node", "katipunan-footbridge", review);
    expect(summary.reviewCount).toBe(2);
    expect(summary.ratingAverage).toBe(2.5);
    expect(summary.rating.find((item) => item.value === 3)?.count).toBe(1);
    expect(reviewForTarget("node", "katipunan-footbridge", review)).toHaveLength(2);
  });

  it("returns an explicit empty state", () => {
    expect(summarizeReview("thread", "missing-thread", review)).toMatchObject({
      reviewCount: 0,
      ratingAverage: null,
      theme: [],
    });
  });
});

describe("route question scope", () => {
  it("returns questions only for the exact computed route", () => {
    const routeId = routeThread[0].routeId;
    expect(resolveThread(routeId, ["katipunan-footbridge", "lrt-katipunan"], routeThread).map((item) => item.threadId)).toEqual([
      "thread-shortest-crossing",
    ]);
    expect(resolveThread("route:another-path", ["katipunan-footbridge", "lrt-katipunan"], routeThread)).toEqual([]);
  });
});
