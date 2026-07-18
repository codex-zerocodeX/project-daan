import legacyReportJson from "../../fixture/report.json";
import { review, routeThread } from "../../fixture/discussion";
import type { ReportKind, RouteThread } from "../../lib/type";
import type { CommunityReport, CommunityState, CommunityVote } from "./type";

interface LegacyReportJson {
  report_id: string;
  device_id: string;
  segment_ref: string;
  kind: ReportKind;
  note: string | null;
  accept_count: number;
  dispute_count: number;
  created_at: string;
}

const segmentThreadId: Record<string, string> = {
  s1: "thread-shortest-crossing",
  s2: "thread-shortest-crossing",
  s3: "thread-shortest-crossing",
  s4: "thread-shortest-crossing",
  s5: "thread-shortest-crossing",
};

function threadForReview(target: "node" | "thread", targetId: string): RouteThread | null {
  if (target === "thread") return routeThread.find((item) => item.threadId === targetId) ?? null;
  return routeThread.find((item) => item.nodeId.includes(targetId)) ?? null;
}

function discussionSeed() {
  const report: CommunityReport[] = [];
  const vote: CommunityVote[] = [];

  for (const item of review) {
    const thread = threadForReview(item.target, item.targetId);
    if (!thread) continue;
    const reportId = `discussion-${item.reviewId}`;
    const contributorId = `discussion-contributor-${item.reviewId}`;
    report.push({
      reportId,
      threadId: thread.threadId,
      routeId: thread.routeId,
      segmentId: null,
      contributorId,
      kind: /\b(queue|crowd|rush)\w*\b/i.test(item.body) ? "queue" : "answer",
      body: item.body,
      createdAt: item.createdAt,
    });
    vote.push({
      voteId: `discussion-vote-${item.reviewId}`,
      contributorId,
      targetKind: "report",
      reportId,
      value: "accept",
      castAt: item.createdAt,
    });
  }

  return { report, vote };
}

function legacyVote(item: LegacyReportJson): CommunityVote[] {
  const vote: CommunityVote[] = [];
  for (let ordinal = 0; ordinal < item.accept_count; ordinal += 1) {
    vote.push({
      voteId: `legacy-vote-${item.report_id}-accept-${ordinal}`,
      contributorId: `legacy-voter-${item.report_id}-accept-${ordinal}`,
      targetKind: "report",
      reportId: `legacy-${item.report_id}`,
      value: "accept",
      castAt: item.created_at,
    });
  }
  for (let ordinal = 0; ordinal < item.dispute_count; ordinal += 1) {
    vote.push({
      voteId: `legacy-vote-${item.report_id}-dispute-${ordinal}`,
      contributorId: `legacy-voter-${item.report_id}-dispute-${ordinal}`,
      targetKind: "report",
      reportId: `legacy-${item.report_id}`,
      value: "dispute",
      castAt: item.created_at,
    });
  }
  return vote;
}

function legacySeed() {
  const legacyReport = legacyReportJson as LegacyReportJson[];
  const report: CommunityReport[] = legacyReport.map((item) => ({
    reportId: `legacy-${item.report_id}`,
    threadId: segmentThreadId[item.segment_ref] ?? "thread-shortest-crossing",
    routeId: routeThread[0].routeId,
    segmentId: item.segment_ref,
    contributorId: `legacy-${item.device_id}`,
    kind: item.kind,
    body: item.note ?? `${item.kind} reported along this segment.`,
    createdAt: item.created_at,
  }));
  const vote = legacyReport.flatMap(legacyVote);
  return { report, vote };
}

export function seedCommunityState(): CommunityState {
  const discussion = discussionSeed();
  const legacy = legacySeed();
  return {
    schemaVersion: 1,
    seedVersion: 1,
    report: [...discussion.report, ...legacy.report],
    reply: [],
    vote: [...discussion.vote, ...legacy.vote],
  };
}

function mergeEntity<Entity>(existingEntity: Entity[], seedEntity: Entity[], entityId: (item: Entity) => string) {
  const knownEntityId = new Set(existingEntity.map(entityId));
  return [...existingEntity, ...seedEntity.filter((item) => !knownEntityId.has(entityId(item)))];
}

export function mergeCommunitySeed(existingState: CommunityState, seedState = seedCommunityState()): CommunityState {
  return {
    schemaVersion: 1,
    seedVersion: 1,
    report: mergeEntity(existingState.report, seedState.report, (item) => item.reportId),
    reply: mergeEntity(existingState.reply, seedState.reply, (item) => item.replyId),
    vote: mergeEntity(existingState.vote, seedState.vote, (item) => item.voteId),
  };
}
