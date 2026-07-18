import type { ReportKind, RouteThread } from "../../lib/type";

export type CommunityKind = ReportKind | "answer";
export type CommunityVoteValue = "accept" | "dispute";

export interface CommunityReport {
  reportId: string;
  threadId: string;
  routeId: string;
  segmentId: string | null;
  contributorId: string;
  kind: CommunityKind;
  body: string;
  createdAt: string;
}

export interface CommunityReply {
  replyId: string;
  reportId: string;
  parentReplyId: string | null;
  contributorId: string;
  body: string;
  createdAt: string;
}

export interface CommunityReportVote {
  voteId: string;
  contributorId: string;
  targetKind: "report";
  reportId: string;
  value: CommunityVoteValue;
  castAt: string;
}

export interface CommunityReplyVote {
  voteId: string;
  contributorId: string;
  targetKind: "reply";
  replyId: string;
  value: CommunityVoteValue;
  castAt: string;
}

export type CommunityVote = CommunityReportVote | CommunityReplyVote;

export interface CommunityState {
  schemaVersion: 1;
  seedVersion: 1;
  report: CommunityReport[];
  reply: CommunityReply[];
  vote: CommunityVote[];
}

export interface CommunityIdentity {
  contributorId: string;
}

export interface CommunityTally {
  acceptCount: number;
  disputeCount: number;
  isScoringActive: boolean;
}

export interface CommunityReplyView {
  reply: CommunityReply;
  depth: 1 | 2 | 3;
  tally: CommunityTally;
  currentVote: CommunityVoteValue | null;
  child: CommunityReplyView[];
}

export interface CommunityReportView {
  report: CommunityReport;
  tally: CommunityTally;
  karma: number;
  weight: number;
  currentVote: CommunityVoteValue | null;
  reply: CommunityReplyView[];
}

export interface CommunityThreadView {
  threadId: string;
  report: CommunityReportView[];
  invalidReply: CommunityReply[];
}

export interface CommunityProjectionItem {
  report: CommunityReport;
  tally: CommunityTally;
  karma: number;
  weight: number;
}

export interface CommunityProjection {
  routeId: string;
  segmentId: string;
  activeReport: CommunityProjectionItem[];
  excludedReport: CommunityProjectionItem[];
  activeCount: number;
  excludedCount: number;
}

export interface CommunitySegmentOption {
  segmentId: string;
  name: string;
}

export interface CreateCommunityReportInput {
  threadId: string;
  routeId: string;
  segmentId: string | null;
  contributorId: string;
  kind: CommunityKind;
  body: string;
}

export interface CreateCommunityReplyInput {
  reportId: string;
  parentReplyId: string | null;
  contributorId: string;
  body: string;
}

export type CreateCommunityReplyResult =
  | { isSuccess: true; reply: CommunityReply }
  | { isSuccess: false; code: "missing_report" | "missing_parent" | "reply_depth" };

export type CastCommunityVoteInput =
  | { contributorId: string; targetKind: "report"; reportId: string; value: CommunityVoteValue }
  | { contributorId: string; targetKind: "reply"; replyId: string; value: CommunityVoteValue };

export type CastCommunityVoteAction =
  | { targetKind: "report"; reportId: string; value: CommunityVoteValue }
  | { targetKind: "reply"; replyId: string; value: CommunityVoteValue };

export interface CommunitySnapshot {
  state: CommunityState;
  contributorId: string;
}

export interface CommunityRepository {
  getSnapshot(): CommunitySnapshot;
  createReport(input: CreateCommunityReportInput): CommunityReport;
  createReply(input: CreateCommunityReplyInput): CreateCommunityReplyResult;
  castVote(input: CastCommunityVoteInput): CommunityVote;
  queryThread(threadId: string, contributorId: string): CommunityThreadView;
  getProjection(routeId: string, segmentId: string): CommunityProjection;
  getKarma(contributorId: string): number;
  subscribe(listener: () => void): () => void;
}

export interface CommunityUrlState {
  routeId: string | null;
  segmentId: string | null;
  threadId: string | null;
  reportId: string | null;
  replyId: string | null;
}

export interface CommunityPanelProp {
  routeId: string;
  thread: RouteThread[];
  segment: CommunitySegmentOption[];
  selectedThreadId: string | null;
  selectedReportId: string | null;
  selectedReplyId: string | null;
  threadView: CommunityThreadView[];
  onThreadSelect: (threadId: string) => void;
  onReportSelect: (reportId: string | null) => void;
  onReplySelect: (replyId: string | null) => void;
  onCreateReport: (input: Omit<CreateCommunityReportInput, "routeId" | "contributorId">) => void;
  onCreateReply: (input: Omit<CreateCommunityReplyInput, "contributorId">) => CreateCommunityReplyResult;
  onVote: (input: CastCommunityVoteAction) => void;
}
