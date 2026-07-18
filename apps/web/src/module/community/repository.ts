import { depthForReply, karmaForContributor, projectCommunity, queryCommunityThread } from "./domain";
import { loadCommunityIdentity, loadCommunityState, saveCommunityState, type CommunityStorage } from "./storage";
import type {
  CastCommunityVoteInput,
  CommunityRepository,
  CommunitySnapshot,
  CommunityVote,
  CreateCommunityReplyInput,
  CreateCommunityReportInput,
} from "./type";

function targetMatches(vote: CommunityVote, input: CastCommunityVoteInput) {
  if (vote.targetKind !== input.targetKind || vote.contributorId !== input.contributorId) return false;
  return vote.targetKind === "report" && input.targetKind === "report"
    ? vote.reportId === input.reportId
    : vote.targetKind === "reply" && input.targetKind === "reply" && vote.replyId === input.replyId;
}

export function createCommunityRepository(
  storage: CommunityStorage,
  now: () => string = () => new Date().toISOString(),
  createId: () => string = () => crypto.randomUUID(),
): CommunityRepository {
  let state = loadCommunityState(storage);
  const identity = loadCommunityIdentity(storage, createId);
  let snapshot: CommunitySnapshot = { state, contributorId: identity.contributorId };
  const listener = new Set<() => void>();

  function publish() {
    saveCommunityState(storage, state);
    snapshot = { state, contributorId: identity.contributorId };
    for (const notify of listener) notify();
  }

  function castVote(input: CastCommunityVoteInput): CommunityVote {
    const existingIndex = state.vote.findIndex((item) => targetMatches(item, input));
    const castAt = now();
    if (existingIndex >= 0) {
      const existingVote = state.vote[existingIndex];
      const vote: CommunityVote =
        input.targetKind === "report"
          ? { ...existingVote, targetKind: "report", reportId: input.reportId, value: input.value, castAt }
          : { ...existingVote, targetKind: "reply", replyId: input.replyId, value: input.value, castAt };
      state = { ...state, vote: state.vote.map((item, index) => (index === existingIndex ? vote : item)) };
      publish();
      return vote;
    }

    const vote: CommunityVote =
      input.targetKind === "report"
        ? {
            voteId: `community-vote-${createId()}`,
            contributorId: input.contributorId,
            targetKind: "report",
            reportId: input.reportId,
            value: input.value,
            castAt,
          }
        : {
            voteId: `community-vote-${createId()}`,
            contributorId: input.contributorId,
            targetKind: "reply",
            replyId: input.replyId,
            value: input.value,
            castAt,
          };
    state = { ...state, vote: [...state.vote, vote] };
    publish();
    return vote;
  }

  return {
    getSnapshot: () => snapshot,
    createReport: (input: CreateCommunityReportInput) => {
      const createdAt = now();
      const report = {
        reportId: `community-report-${createId()}`,
        threadId: input.threadId,
        routeId: input.routeId,
        segmentId: input.segmentId,
        contributorId: input.contributorId,
        kind: input.kind,
        body: input.body.trim(),
        createdAt,
      };
      state = { ...state, report: [...state.report, report] };
      castVote({
        contributorId: input.contributorId,
        targetKind: "report",
        reportId: report.reportId,
        value: "accept",
      });
      return report;
    },
    createReply: (input: CreateCommunityReplyInput) => {
      if (!state.report.some((item) => item.reportId === input.reportId)) {
        return { isSuccess: false, code: "missing_report" };
      }
      if (input.parentReplyId) {
        const parent = state.reply.find((item) => item.replyId === input.parentReplyId);
        if (!parent || parent.reportId !== input.reportId) return { isSuccess: false, code: "missing_parent" };
        const depth = depthForReply(parent.replyId, state.reply);
        if (!depth) return { isSuccess: false, code: "missing_parent" };
        if (depth >= 3) return { isSuccess: false, code: "reply_depth" };
      }
      const reply = {
        replyId: `community-reply-${createId()}`,
        reportId: input.reportId,
        parentReplyId: input.parentReplyId,
        contributorId: input.contributorId,
        body: input.body.trim(),
        createdAt: now(),
      };
      state = { ...state, reply: [...state.reply, reply] };
      publish();
      return { isSuccess: true, reply };
    },
    castVote,
    queryThread: (threadId, contributorId) => queryCommunityThread(state, threadId, contributorId),
    getProjection: (routeId, segmentId) => projectCommunity(state, routeId, segmentId),
    getKarma: (contributorId) => karmaForContributor(contributorId, state.report, state.vote),
    subscribe: (notify) => {
      listener.add(notify);
      return () => listener.delete(notify);
    },
  };
}

export function createBrowserCommunityRepository() {
  return createCommunityRepository(window.localStorage);
}
