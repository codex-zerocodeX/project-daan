import { describe, expect, it } from "vitest";
import { composeRoute, type ComposeNode } from "../composeAlgorithm";

const origin = { lat: 14.6, lng: 121.0 };
const destination = { lat: 14.6062, lng: 121.0062 };

describe("composeRoute", () => {
  it("returns an existing route when one answer already spans origin->destination", () => {
    const nodes: ComposeNode[] = [
      { id: n(1), route_id: "R1", thread_id: "T1", seq: 0, lat: 14.6005, lng: 121.0005, label: "Board" },
      { id: n(2), route_id: "R1", thread_id: "T1", seq: 1, lat: 14.603, lng: 121.003, label: "Transfer" },
      { id: n(3), route_id: "R1", thread_id: "T1", seq: 2, lat: 14.606, lng: 121.006, label: "Alight" },
    ];

    const result = composeRoute(nodes, origin, destination);

    expect(result).not.toBeNull();
    expect(result!.existing).toBe(true);
    expect(result!.route_ids).toEqual(["R1"]);
    expect(result!.steps.map((s) => s.node_id)).toEqual([n(1), n(2), n(3)]);
  });

  it("stitches nodes from two different threads into a new route", () => {
    const nodes: ComposeNode[] = [
      // answer A covers the origin half
      { id: n(1), route_id: "A", thread_id: "TA", seq: 0, lat: 14.6005, lng: 121.0005, label: "Start" },
      { id: n(2), route_id: "A", thread_id: "TA", seq: 1, lat: 14.603, lng: 121.003, label: "A end" },
      // answer B covers the destination half; B's first node is ~77m from A's last (stitch point)
      { id: n(3), route_id: "B", thread_id: "TB", seq: 0, lat: 14.6035, lng: 121.0035, label: "B start" },
      { id: n(4), route_id: "B", thread_id: "TB", seq: 1, lat: 14.606, lng: 121.006, label: "Arrive" },
    ];

    const result = composeRoute(nodes, origin, destination);

    expect(result).not.toBeNull();
    expect(result!.existing).toBe(false);
    expect(result!.route_ids).toEqual(["A", "B"]);
    expect(result!.thread_ids).toEqual(["TA", "TB"]);
    expect(result!.steps.map((s) => s.node_id)).toEqual([n(1), n(2), n(3), n(4)]);
    // geometry is [lng,lat] and brackets the path with the real origin/destination
    expect(result!.coordinates[0]).toEqual([origin.lng, origin.lat]);
    expect(result!.coordinates.at(-1)).toEqual([destination.lng, destination.lat]);
  });

  it("collapses two answers meeting at the same stop into one transfer step", () => {
    const transfer = { lat: 14.603, lng: 121.003 };
    const nodes: ComposeNode[] = [
      { id: n(1), route_id: "A", thread_id: "TA", seq: 0, lat: 14.6005, lng: 121.0005, label: "Start" },
      { id: n(2), route_id: "A", thread_id: "TA", seq: 1, ...transfer, label: "Board southbound (stale)" },
      // answer B starts at the exact same stop -> must not appear twice
      { id: n(3), route_id: "B", thread_id: "TB", seq: 0, ...transfer, label: "Board northbound" },
      { id: n(4), route_id: "B", thread_id: "TB", seq: 1, lat: 14.606, lng: 121.006, label: "Arrive" },
    ];

    const result = composeRoute(nodes, origin, destination);

    expect(result).not.toBeNull();
    // the stale arriving instruction is dropped, the onward one kept
    expect(result!.steps.map((s) => s.node_id)).toEqual([n(1), n(3), n(4)]);
    expect(result!.steps.map((s) => s.label)).not.toContain("Board southbound (stale)");
    // both threads are still credited
    expect(result!.thread_ids).toEqual(["TA", "TB"]);
  });

  it("returns null when the two clusters are too far apart to stitch", () => {
    const nodes: ComposeNode[] = [
      { id: n(1), route_id: "A", thread_id: "TA", seq: 0, lat: 14.6005, lng: 121.0005, label: "Start" },
      { id: n(2), route_id: "A", thread_id: "TA", seq: 1, lat: 14.6015, lng: 121.0015, label: "A end" },
      // ~4km away, beyond both snap and stitch distance
      { id: n(3), route_id: "B", thread_id: "TB", seq: 0, lat: 14.63, lng: 121.03, label: "B start" },
      { id: n(4), route_id: "B", thread_id: "TB", seq: 1, lat: 14.631, lng: 121.031, label: "Arrive" },
    ];

    const result = composeRoute(nodes, { lat: 14.6, lng: 121.0 }, { lat: 14.6312, lng: 121.0312 });

    expect(result).toBeNull();
  });

  it("returns null when there are no nodes", () => {
    expect(composeRoute([], origin, destination)).toBeNull();
  });
});

// helper: deterministic uuids so the test reads cleanly
function n(i: number): string {
  return `00000000-0000-4000-8000-00000000000${i}`;
}
