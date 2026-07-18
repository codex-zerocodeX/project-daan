import { describe, expect, it } from "vitest";
import { rankThreads, type RelevanceNode } from "../threadRelevance";

const ORIGIN = { lat: 14.6, lng: 121.0 };
const DEST = { lat: 14.65, lng: 121.0 };

const node = (
  thread_id: string,
  route_id: string,
  seq: number,
  lat: number,
  lng: number,
): RelevanceNode => ({ thread_id, route_id, seq, lat, lng });

// ~0.0005 deg lat is ~55 m; ~0.02 deg is ~2.2 km (well outside the 800 m radius).
const nearOrigin = 14.6005;
const nearDest = 14.6495;
const midway = 14.625;

describe("rankThreads", () => {
  it("marks a thread exact when one answer spans origin then destination", () => {
    const nodes = [
      node("t-exact", "r1", 0, nearOrigin, 121.0),
      node("t-exact", "r1", 1, midway, 121.0),
      node("t-exact", "r1", 2, nearDest, 121.0),
    ];

    const [result] = rankThreads(nodes, ORIGIN, DEST);
    expect(result.thread_id).toBe("t-exact");
    expect(result.match).toBe("exact");
    expect(result.route_ids).toEqual(["r1"]);
    expect(result.origin_distance_m).toBeGreaterThan(0);
    expect(result.origin_distance_m).toBeLessThan(800);
    expect(result.destination_distance_m).toBeLessThan(800);
    // distances are whole metres
    expect(Number.isInteger(result.origin_distance_m)).toBe(true);
    expect(Number.isInteger(result.destination_distance_m)).toBe(true);
  });

  it("marks a thread partial when only one endpoint is covered", () => {
    const nodes = [
      node("t-partial", "r2", 0, nearOrigin, 121.0),
      node("t-partial", "r2", 1, midway, 121.0),
    ];

    const [result] = rankThreads(nodes, ORIGIN, DEST);
    expect(result.match).toBe("partial");
    expect(result.origin_distance_m).toBeLessThan(800);
    expect(result.destination_distance_m).toBeNull();
    expect(result.route_ids).toEqual(["r2"]);
  });

  it("excludes a thread whose nodes are near neither endpoint", () => {
    const nodes = [
      node("t-far", "r3", 0, 14.9, 121.4),
      node("t-far", "r3", 1, 14.95, 121.45),
    ];

    expect(rankThreads(nodes, ORIGIN, DEST)).toEqual([]);
  });

  it("does not count a wrong-direction answer as exact", () => {
    // The answer travels destination -> origin, so it does not serve this trip.
    const nodes = [
      node("t-reverse", "r4", 0, nearDest, 121.0),
      node("t-reverse", "r4", 1, midway, 121.0),
      node("t-reverse", "r4", 2, nearOrigin, 121.0),
    ];

    const [result] = rankThreads(nodes, ORIGIN, DEST);
    expect(result.match).toBe("partial");
    // both endpoints still have a nearby node, they are just in the wrong order
    expect(result.origin_distance_m).not.toBeNull();
    expect(result.destination_distance_m).not.toBeNull();
  });

  it("orders exact before partial and nearer before farther, deterministically", () => {
    const nodes = [
      // partial: only the origin end is covered
      node("t-partial", "rp", 0, 14.6005, 121.0),
      // exact but farther from both endpoints
      node("t-far-exact", "rf", 0, 14.6055, 121.0),
      node("t-far-exact", "rf", 1, 14.6445, 121.0),
      // exact and closest
      node("t-near-exact", "rn", 0, 14.6001, 121.0),
      node("t-near-exact", "rn", 1, 14.6499, 121.0),
    ];

    const ids = rankThreads(nodes, ORIGIN, DEST).map((r) => r.thread_id);
    expect(ids).toEqual(["t-near-exact", "t-far-exact", "t-partial"]);

    // input order must not change the output order
    const shuffled = rankThreads([...nodes].reverse(), ORIGIN, DEST).map((r) => r.thread_id);
    expect(shuffled).toEqual(ids);
  });

  it("dedupes contributing route ids and honours a custom radius", () => {
    const nodes = [
      node("t-exact", "r1", 0, nearOrigin, 121.0),
      node("t-exact", "r1", 1, nearDest, 121.0),
      node("t-exact", "r2", 0, nearOrigin, 121.0),
      node("t-exact", "r2", 1, nearDest, 121.0),
    ];

    expect(rankThreads(nodes, ORIGIN, DEST)[0].route_ids).toEqual(["r1", "r2"]);
    // a 10 m radius snaps to nothing
    expect(rankThreads(nodes, ORIGIN, DEST, { radiusMeters: 10 })).toEqual([]);
  });
});
