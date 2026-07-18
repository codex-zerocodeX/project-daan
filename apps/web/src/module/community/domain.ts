import type {
  CommunityProjection,
  CommunityProjectionItem,
  CommunityReply,
  CommunityReplyView,
  CommunityReport,
  CommunityReportView,
  CommunityState,
  CommunityTally,
  CommunityThreadView,
  CommunityVote,
  CommunityVoteValue,
} from "./type";

function reportVote(vote: CommunityVote, reportId: string) {
  return vote.targetKind === "report" && vote.reportId === reportId;
}

function replyVote(vote: CommunityVote, replyId: string) {
  return vote.targetKind === "reply" && vote.replyId === replyId;
}

function tally(vote: CommunityVote[], predicate: (item: CommunityVote) => boolean): CommunityTally {
  const scopedVote = vote.filter(predicate);
  const acceptCount = scopedVote.filter((item) => item.value === "accept").length;
  const disputeCount = scopedVote.filter((item) => item.value === "dispute").length;
  return { acceptCount, disputeCount, isScoringActive: acceptCount > disputeCount };
}

export function tallyReport(reportId: string, vote: CommunityVote[]): CommunityTally {
  return tally(vote, (item) => reportVote(item, reportId));
}

export function tallyReply(replyId: string, vote: CommunityVote[]): CommunityTally {
  return tally(vote, (item) => replyVote(item, replyId));
}

export function karmaForContributor(contributorId: string, report: CommunityReport[], vote: CommunityVote[]) {
  return report.filter(
    (item) => item.contributorId === contributorId && tallyReport(item.reportId, vote).isScoringActive,
  ).length;
}

export function weightFromKarma(karma: number) {
  return Math.min(1, 0.5 + 0.1 * Math.max(0, karma));
}

export function currentReportVote(reportId: string, contributorId: string, vote: CommunityVote[]): CommunityVoteValue | null {
  return vote.find((item) => item.contributorId === contributorId && reportVote(item, reportId))?.value ?? null;
}

export function currentReplyVote(replyId: string, contributorId: string, vote: CommunityVote[]): CommunityVoteValue | null {
  return vote.find((item) => item.contributorId === contributorId && replyVote(item, replyId))?.value ?? null;
}

function replyDepth(item: CommunityReply, replyById: Map<string, CommunityReply>): 1 | 2 | 3 | null {
  let depth = 1;
  let current: CommunityReply = item;
  const visitedReplyId = new Set<string>([item.replyId]);

  while (current.parentReplyId) {
    const parent = replyById.get(current.parentReplyId);
    if (!parent || parent.reportId !== item.reportId || visitedReplyId.has(parent.replyId)) return null;
    visitedReplyId.add(parent.replyId);
    depth += 1;
    if (depth > 3) return null;
    current = parent;
  }

  return depth as 1 | 2 | 3;
}

export function depthForReply(replyId: string, reply: CommunityReply[]): 1 | 2 | 3 | null {
  const replyById = new Map(reply.map((item) => [item.replyId, item]));
  const item = replyById.get(replyId);
  return item ? replyDepth(item, replyById) : null;
}

function viewForReply(
  item: CommunityReply,
  depth: 1 | 2 | 3,
  childByParentId: Map<string | null, CommunityReply[]>,
  vote: CommunityVote[],
  contributorId: string,
): CommunityReplyView {
  const child = (childByParentId.get(item.replyId) ?? []).map((childItem) =>
    viewForReply(childItem, (depth + 1) as 2 | 3, childByParentId, vote, contributorId),
  );
  return {
    reply: item,
    depth,
    tally: tallyReply(item.replyId, vote),
    currentVote: currentReplyVote(item.replyId, contributorId, vote),
    child,
  };
}

export function queryCommunityThread(state: CommunityState, threadId: string, contributorId: string): CommunityThreadView {
  const scopedReport = state.report.filter((item) => item.threadId === threadId);
  const reportId = new Set(scopedReport.map((item) => item.reportId));
  const scopedReply = state.reply.filter((item) => reportId.has(item.reportId));
  const replyById = new Map(scopedReply.map((item) => [item.replyId, item]));
  const validDepth = new Map<string, 1 | 2 | 3>();
  const invalidReply: CommunityReply[] = [];

  for (const item of scopedReply) {
    const depth = replyDepth(item, replyById);
    if (depth) validDepth.set(item.replyId, depth);
    else invalidReply.push(item);
  }

  const childByParentId = new Map<string | null, CommunityReply[]>();
  for (const item of scopedReply) {
    if (!validDepth.has(item.replyId)) continue;
    const child = childByParentId.get(item.parentReplyId) ?? [];
    child.push(item);
    childByParentId.set(item.parentReplyId, child);
  }
  for (const child of childByParentId.values()) {
    child.sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.replyId.localeCompare(right.replyId));
  }

  const report = scopedReport
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || left.reportId.localeCompare(right.reportId))
    .map((item): CommunityReportView => {
      const karma = karmaForContributor(item.contributorId, state.report, state.vote);
      const directReply = (childByParentId.get(null) ?? []).filter((replyItem) => replyItem.reportId === item.reportId);
      return {
        report: item,
        tally: tallyReport(item.reportId, state.vote),
        karma,
        weight: weightFromKarma(karma),
        currentVote: currentReportVote(item.reportId, contributorId, state.vote),
        reply: directReply.map((replyItem) => viewForReply(replyItem, 1, childByParentId, state.vote, contributorId)),
      };
    });

  return { threadId, report, invalidReply };
}

function projectionItem(report: CommunityReport, state: CommunityState): CommunityProjectionItem {
  const karma = karmaForContributor(report.contributorId, state.report, state.vote);
  return {
    report,
    tally: tallyReport(report.reportId, state.vote),
    karma,
    weight: weightFromKarma(karma),
  };
}

export function projectCommunity(state: CommunityState, routeId: string, segmentId: string): CommunityProjection {
  const scopedReport = state.report.filter(
    (item) => item.routeId === routeId && item.segmentId === segmentId && item.kind !== "answer",
  );
  const item = scopedReport.map((report) => projectionItem(report, state));
  const activeReport = item.filter((projection) => projection.tally.isScoringActive);
  const excludedReport = item.filter((projection) => !projection.tally.isScoringActive);
  return {
    routeId,
    segmentId,
    activeReport,
    excludedReport,
    activeCount: activeReport.length,
    excludedCount: excludedReport.length,
  };
}
