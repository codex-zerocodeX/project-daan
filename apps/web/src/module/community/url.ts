import type { CommunityUrlState } from "./type";

const communityQueryKey = ["routeId", "segmentId", "threadId", "reportId", "replyId"] as const;

export interface CommunityUrlContext {
  routeId: string[];
  segmentId: string[];
  threadId: string[];
  reportId: string[];
  replyId: string[];
}

export function readCommunityUrl(url: URL): CommunityUrlState {
  return {
    routeId: url.searchParams.get("routeId"),
    segmentId: url.searchParams.get("segmentId"),
    threadId: url.searchParams.get("threadId"),
    reportId: url.searchParams.get("reportId"),
    replyId: url.searchParams.get("replyId"),
  };
}

export function writeCommunityUrl(url: URL, state: CommunityUrlState): URL {
  const nextUrl = new URL(url.toString());
  for (const key of communityQueryKey) {
    const value = state[key];
    if (value) nextUrl.searchParams.set(key, value);
    else nextUrl.searchParams.delete(key);
  }
  return nextUrl;
}

export function normalizeCommunityUrl(state: CommunityUrlState, context: CommunityUrlContext): CommunityUrlState {
  if (state.routeId && !context.routeId.includes(state.routeId)) {
    return { routeId: null, segmentId: null, threadId: null, reportId: null, replyId: null };
  }
  if (state.segmentId && !context.segmentId.includes(state.segmentId)) {
    return { ...state, segmentId: null, threadId: null, reportId: null, replyId: null };
  }
  if (state.threadId && !context.threadId.includes(state.threadId)) {
    return { ...state, threadId: null, reportId: null, replyId: null };
  }
  if (state.reportId && !context.reportId.includes(state.reportId)) {
    return { ...state, reportId: null, replyId: null };
  }
  if (state.replyId && !context.replyId.includes(state.replyId)) return { ...state, replyId: null };
  return state;
}

export function isSameCommunityUrl(left: CommunityUrlState, right: CommunityUrlState) {
  return communityQueryKey.every((key) => left[key] === right[key]);
}
