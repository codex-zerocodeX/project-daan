import { describe, expect, it } from "vitest";
import { karmaForContributor, projectCommunity, queryCommunityThread, tallyReport, weightFromKarma } from "./domain";
import type { CommunityState } from "./type";

function baseState(): CommunityState {
  return {
    schemaVersion: 1,
    seedVersion: 1,
    report: [
      { reportId: "report-a", threadId: "thread-a", routeId: "route-a", segmentId: "segment-a", contributorId: "author-a", kind: "blocked", body: "Blocked", createdAt: "2026-01-01T00:00:00Z" },
      { reportId: "report-b", threadId: "thread-a", routeId: "route-a", segmentId: "segment-a", contributorId: "author-a", kind: "answer", body: "Context", createdAt: "2026-01-02T00:00:00Z" },
    ],
    reply: [],
    vote: [
      { voteId: "vote-a", contributorId: "voter-a", targetKind: "report", reportId: "report-a", value: "accept", castAt: "2026-01-01T00:00:00Z" },
      { voteId: "vote-b", contributorId: "voter-b", targetKind: "report", reportId: "report-b", value: "accept", castAt: "2026-01-02T00:00:00Z" },
    ],
  };
}

describe("community domain", () => {
  it("uses accept greater than dispute for activity and report-only karma", () => {
    const state = baseState();
    expect(tallyReport("report-a", state.vote).isScoringActive).toBe(true);
    expect(karmaForContributor("author-a", state.report, state.vote)).toBe(2);
    state.vote.push({ voteId: "vote-c", contributorId: "voter-c", targetKind: "reply", replyId: "reply-a", value: "dispute", castAt: "2026-01-03T00:00:00Z" });
    expect(karmaForContributor("author-a", state.report, state.vote)).toBe(2);
    state.vote.push({ voteId: "vote-d", contributorId: "voter-d", targetKind: "report", reportId: "report-a", value: "dispute", castAt: "2026-01-03T00:00:00Z" });
    expect(tallyReport("report-a", state.vote).isScoringActive).toBe(false);
    expect(karmaForContributor("author-a", state.report, state.vote)).toBe(1);
    expect(weightFromKarma(99)).toBe(1);
  });

  it("omits orphan and cyclic reply while preserving valid depth one through three", () => {
    const state = baseState();
    state.reply = [
      { replyId: "reply-1", reportId: "report-a", parentReplyId: null, contributorId: "author-b", body: "one", createdAt: "2026-01-01T00:01:00Z" },
      { replyId: "reply-2", reportId: "report-a", parentReplyId: "reply-1", contributorId: "author-c", body: "two", createdAt: "2026-01-01T00:02:00Z" },
      { replyId: "reply-3", reportId: "report-a", parentReplyId: "reply-2", contributorId: "author-d", body: "three", createdAt: "2026-01-01T00:03:00Z" },
      { replyId: "reply-orphan", reportId: "report-a", parentReplyId: "missing", contributorId: "author-e", body: "orphan", createdAt: "2026-01-01T00:04:00Z" },
      { replyId: "reply-cycle-a", reportId: "report-a", parentReplyId: "reply-cycle-b", contributorId: "author-f", body: "cycle", createdAt: "2026-01-01T00:05:00Z" },
      { replyId: "reply-cycle-b", reportId: "report-a", parentReplyId: "reply-cycle-a", contributorId: "author-g", body: "cycle", createdAt: "2026-01-01T00:06:00Z" },
    ];
    const view = queryCommunityThread(state, "thread-a", "viewer");
    expect(view.report.find((item) => item.report.reportId === "report-a")?.reply[0].child[0].child[0].depth).toBe(3);
    expect(view.invalidReply.map((item) => item.replyId).sort()).toEqual(["reply-cycle-a", "reply-cycle-b", "reply-orphan"]);
  });

  it("projects active and excluded reports without mutating route-like input", () => {
    const state = baseState();
    state.vote.push({ voteId: "vote-c", contributorId: "voter-c", targetKind: "report", reportId: "report-a", value: "dispute", castAt: "2026-01-03T00:00:00Z" });
    const route = { routeId: "route-a", score: 34, segment: [{ segmentId: "segment-a", score: 30 }] };
    const before = structuredClone(route);
    const projection = projectCommunity(state, "route-a", "segment-a");
    expect(projection.activeCount).toBe(0);
    expect(projection.excludedReport.map((item) => item.report.reportId)).toEqual(["report-a"]);
    expect(projection.activeReport.some((item) => item.report.kind === "answer")).toBe(false);
    expect(route).toEqual(before);
  });
});
