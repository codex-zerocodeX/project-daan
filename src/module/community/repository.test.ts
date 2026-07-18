import { describe, expect, it } from "vitest";
import { createCommunityRepository } from "./repository";
import { createMemoryStorage } from "./storage";

function repositoryFixture() {
  let ordinal = 0;
  const repository = createCommunityRepository(
    createMemoryStorage(),
    () => `2026-07-18T13:0${ordinal}:00Z`,
    () => `id-${ordinal++}`,
  );
  return repository;
}

describe("community repository", () => {
  it("auto-accepts a new report and recasts without duplicate vote", () => {
    const repository = repositoryFixture();
    const contributorId = repository.getSnapshot().contributorId;
    const report = repository.createReport({ threadId: "thread-shortest-crossing", routeId: "route-new", segmentId: "segment-new", contributorId, kind: "blocked", body: "Path is blocked." });
    expect(repository.queryThread(report.threadId, contributorId).report.find((item) => item.report.reportId === report.reportId)?.tally.acceptCount).toBe(1);
    repository.castVote({ contributorId, targetKind: "report", reportId: report.reportId, value: "dispute" });
    expect(repository.queryThread(report.threadId, contributorId).report.find((item) => item.report.reportId === report.reportId)?.tally).toMatchObject({ acceptCount: 0, disputeCount: 1, isScoringActive: false });
    repository.castVote({ contributorId, targetKind: "report", reportId: report.reportId, value: "accept" });
    const scopedVote = repository.getSnapshot().state.vote.filter((item) => item.targetKind === "report" && item.reportId === report.reportId && item.contributorId === contributorId);
    expect(scopedVote).toHaveLength(1);
    expect(repository.getProjection("route-new", "segment-new").activeCount).toBe(1);
  });

  it("votes on a reply without changing report-author karma", () => {
    const repository = repositoryFixture();
    const contributorId = repository.getSnapshot().contributorId;
    const report = repository.createReport({ threadId: "thread-shortest-crossing", routeId: "route-new", segmentId: null, contributorId, kind: "answer", body: "Context." });
    const replyResult = repository.createReply({ reportId: report.reportId, parentReplyId: null, contributorId, body: "Reply." });
    expect(replyResult.isSuccess).toBe(true);
    if (!replyResult.isSuccess) return;
    const karma = repository.getKarma(contributorId);
    repository.castVote({ contributorId, targetKind: "reply", replyId: replyResult.reply.replyId, value: "dispute" });
    expect(repository.getKarma(contributorId)).toBe(karma);
  });

  it("accepts reply depth one through three and rejects depth four", () => {
    const repository = repositoryFixture();
    const contributorId = repository.getSnapshot().contributorId;
    const report = repository.createReport({ threadId: "thread-shortest-crossing", routeId: "route-new", segmentId: null, contributorId, kind: "answer", body: "Context." });
    const replyOne = repository.createReply({ reportId: report.reportId, parentReplyId: null, contributorId, body: "one" });
    expect(replyOne.isSuccess).toBe(true);
    if (!replyOne.isSuccess) return;
    const replyTwo = repository.createReply({ reportId: report.reportId, parentReplyId: replyOne.reply.replyId, contributorId, body: "two" });
    expect(replyTwo.isSuccess).toBe(true);
    if (!replyTwo.isSuccess) return;
    const replyThree = repository.createReply({ reportId: report.reportId, parentReplyId: replyTwo.reply.replyId, contributorId, body: "three" });
    expect(replyThree.isSuccess).toBe(true);
    if (!replyThree.isSuccess) return;
    expect(repository.createReply({ reportId: report.reportId, parentReplyId: replyThree.reply.replyId, contributorId, body: "four" })).toEqual({ isSuccess: false, code: "reply_depth" });
  });
});
