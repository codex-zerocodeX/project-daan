import { describe, expect, it } from "vitest";
import { mergeCommunitySeed, seedCommunityState } from "./seed";
import { communityStateKey, createMemoryStorage, loadCommunityIdentity, loadCommunityState } from "./storage";

describe("community storage", () => {
  it("seeds deterministically and merges repeatedly without reordering", () => {
    const first = seedCommunityState();
    const second = mergeCommunitySeed(first);
    const third = mergeCommunitySeed(second);
    expect(JSON.stringify(second)).toBe(JSON.stringify(third));
    expect(first.report.some((item) => item.reportId.startsWith("discussion-"))).toBe(true);
    expect(first.report.some((item) => item.reportId.startsWith("legacy-"))).toBe(true);
  });

  it("preserves an existing recast vote while adding missing seed entities", () => {
    const seed = seedCommunityState();
    const existing = structuredClone(seed);
    existing.vote[0] = { ...existing.vote[0], value: "dispute", castAt: "2026-07-18T13:00:00Z" };
    existing.report = existing.report.slice(0, 1);
    const merged = mergeCommunitySeed(existing, seed);
    expect(merged.vote[0].value).toBe("dispute");
    expect(merged.report.length).toBe(seed.report.length);
  });

  it("recovers corrupt storage and keeps one anonymous identity", () => {
    const storage = createMemoryStorage({ [communityStateKey]: "{bad" });
    const state = loadCommunityState(storage);
    expect(state.report.length).toBeGreaterThan(0);
    const first = loadCommunityIdentity(storage, () => "fixed");
    const second = loadCommunityIdentity(storage, () => "different");
    expect(first).toEqual({ contributorId: "community-fixed" });
    expect(second).toEqual(first);
  });
});
