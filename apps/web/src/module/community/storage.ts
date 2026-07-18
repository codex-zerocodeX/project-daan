import { mergeCommunitySeed, seedCommunityState } from "./seed";
import type { CommunityIdentity, CommunityReply, CommunityReport, CommunityState, CommunityVote } from "./type";

export const communityStateKey = "daan.community.v1";
export const communityIdentityKey = "daan.contributor.v1";

export interface CommunityStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isReport(value: unknown): value is CommunityReport {
  if (!isRecord(value)) return false;
  return (
    isString(value.reportId) &&
    isString(value.threadId) &&
    isString(value.routeId) &&
    isNullableString(value.segmentId) &&
    isString(value.contributorId) &&
    isString(value.kind) &&
    ["blocked", "flooded", "unlit", "queue", "answer"].includes(value.kind) &&
    isString(value.body) &&
    isString(value.createdAt)
  );
}

function isReply(value: unknown): value is CommunityReply {
  if (!isRecord(value)) return false;
  return (
    isString(value.replyId) &&
    isString(value.reportId) &&
    isNullableString(value.parentReplyId) &&
    isString(value.contributorId) &&
    isString(value.body) &&
    isString(value.createdAt)
  );
}

function isVote(value: unknown): value is CommunityVote {
  if (!isRecord(value)) return false;
  const isBase =
    isString(value.voteId) &&
    isString(value.contributorId) &&
    (value.value === "accept" || value.value === "dispute") &&
    isString(value.castAt);
  if (!isBase) return false;
  if (value.targetKind === "report") return isString(value.reportId) && value.replyId === undefined;
  if (value.targetKind === "reply") return isString(value.replyId) && value.reportId === undefined;
  return false;
}

export function parseCommunityState(value: unknown): CommunityState | null {
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.report) || !Array.isArray(value.reply) || !Array.isArray(value.vote)) {
    return null;
  }
  if (!value.report.every(isReport) || !value.reply.every(isReply) || !value.vote.every(isVote)) return null;
  return {
    schemaVersion: 1,
    seedVersion: 1,
    report: value.report,
    reply: value.reply,
    vote: value.vote,
  };
}

export function saveCommunityState(storage: CommunityStorage, state: CommunityState) {
  storage.setItem(communityStateKey, JSON.stringify(state));
}

export function loadCommunityState(storage: CommunityStorage): CommunityState {
  const rawState = storage.getItem(communityStateKey);
  if (!rawState) {
    const state = seedCommunityState();
    saveCommunityState(storage, state);
    return state;
  }
  try {
    const existingState = parseCommunityState(JSON.parse(rawState));
    const state = existingState ? mergeCommunitySeed(existingState) : seedCommunityState();
    saveCommunityState(storage, state);
    return state;
  } catch {
    const state = seedCommunityState();
    saveCommunityState(storage, state);
    return state;
  }
}

export function loadCommunityIdentity(
  storage: CommunityStorage,
  createId: () => string = () => crypto.randomUUID(),
): CommunityIdentity {
  const rawIdentity = storage.getItem(communityIdentityKey);
  if (rawIdentity) {
    try {
      const identity = JSON.parse(rawIdentity) as unknown;
      if (isRecord(identity) && isString(identity.contributorId)) return { contributorId: identity.contributorId };
    } catch {
      // Replace invalid anonymous identity below.
    }
  }
  const identity = { contributorId: `community-${createId()}` };
  storage.setItem(communityIdentityKey, JSON.stringify(identity));
  return identity;
}

export function createMemoryStorage(initialEntry: Record<string, string> = {}): CommunityStorage {
  const entry = new Map(Object.entries(initialEntry));
  return {
    getItem: (key) => entry.get(key) ?? null,
    setItem: (key, value) => {
      entry.set(key, value);
    },
    removeItem: (key) => {
      entry.delete(key);
    },
  };
}
