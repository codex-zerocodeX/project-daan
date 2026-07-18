import { describe, expect, it } from "vitest";
import { normalizeCommunityUrl, readCommunityUrl, writeCommunityUrl } from "./url";

describe("community URL", () => {
  it("preserves unrelated query and hash while writing singular community keys", () => {
    const source = new URL("https://daan.example/?map=fail&origin=gate#receipt");
    const next = writeCommunityUrl(source, { routeId: "route-a", segmentId: "segment-a", threadId: "thread-a", reportId: null, replyId: null });
    expect(next.searchParams.get("map")).toBe("fail");
    expect(next.searchParams.get("origin")).toBe("gate");
    expect(next.hash).toBe("#receipt");
    expect(readCommunityUrl(next).threadId).toBe("thread-a");
  });

  it("falls back to the nearest valid ancestor", () => {
    const normalized = normalizeCommunityUrl(
      { routeId: "route-a", segmentId: "segment-a", threadId: "missing", reportId: "report-a", replyId: "reply-a" },
      { routeId: ["route-a"], segmentId: ["segment-a"], threadId: ["thread-a"], reportId: ["report-a"], replyId: ["reply-a"] },
    );
    expect(normalized).toEqual({ routeId: "route-a", segmentId: "segment-a", threadId: null, reportId: null, replyId: null });
  });
});
