import { describe, expect, it } from "vitest";
import { routeGraph } from "../fixture/network";
import { alternativePath, routeIdentity, shortestPath } from "./path";
import { comfortBalanceProfile } from "./routeProfile";
import type { RouteGraph } from "./type";

describe("shortestPath", () => {
  it("returns the deterministic shortest Ateneo to LRT path", () => {
    const result = shortestPath(routeGraph, "ateneo-gate-3", "lrt-katipunan");
    expect(result.isSuccess).toBe(true);
    if (!result.isSuccess) return;
    expect(result.edgeId).toEqual(["gate3-gate25", "gate25-footbridge", "footbridge-lrt"]);
    expect(result.costMinute).toBeCloseTo(14.9);
  });

  it("returns a zero-length path when both endpoints match", () => {
    expect(shortestPath(routeGraph, "regis-center", "regis-center")).toEqual({
      isSuccess: true,
      nodeId: ["regis-center"],
      edgeId: [],
      costMinute: 0,
      distanceM: 0,
    });
  });

  it("returns a stable unreachable result", () => {
    expect(shortestPath(routeGraph, "ateneo-gate-3", "closed-court")).toMatchObject({
      isSuccess: false,
      reason: "unreachable",
    });
  });

  it("uses the complete path key to break equal-weight ties", () => {
    const graph: RouteGraph = {
      node: [
        { nodeId: "a", name: "A", shortName: "A", alias: [], kind: "junction", position: [0, 0], isAccessible: true },
        { nodeId: "b", name: "B", shortName: "B", alias: [], kind: "junction", position: [1, 0], isAccessible: true },
        { nodeId: "c", name: "C", shortName: "C", alias: [], kind: "junction", position: [0, 1], isAccessible: true },
        { nodeId: "d", name: "D", shortName: "D", alias: [], kind: "junction", position: [1, 1], isAccessible: true },
      ],
      edge: [
        { edgeId: "c-d", fromNodeId: "c", toNodeId: "d", distanceM: 1, costMinute: 1, score: 50, isOneWay: true, roadClass: "path", explanation: "" },
        { edgeId: "a-c", fromNodeId: "a", toNodeId: "c", distanceM: 1, costMinute: 1, score: 50, isOneWay: true, roadClass: "path", explanation: "" },
        { edgeId: "b-d", fromNodeId: "b", toNodeId: "d", distanceM: 1, costMinute: 1, score: 50, isOneWay: true, roadClass: "path", explanation: "" },
        { edgeId: "a-b", fromNodeId: "a", toNodeId: "b", distanceM: 1, costMinute: 1, score: 50, isOneWay: true, roadClass: "path", explanation: "" },
      ],
    };
    const result = shortestPath(graph, "a", "d");
    expect(result.isSuccess && result.nodeId).toEqual(["a", "b", "d"]);
  });

  it("ignores a stale heap entry after finding a better path", () => {
    const graph: RouteGraph = {
      node: ["a", "b", "c", "d", "z"].map((nodeId, index) => ({
        nodeId,
        name: nodeId,
        shortName: nodeId,
        alias: [],
        kind: "junction" as const,
        position: [index, 0] as [number, number],
        isAccessible: true,
      })),
      edge: [
        { edgeId: "a-b", fromNodeId: "a", toNodeId: "b", distanceM: 5, costMinute: 5, score: 50, isOneWay: true, roadClass: "path", explanation: "" },
        { edgeId: "a-c", fromNodeId: "a", toNodeId: "c", distanceM: 1, costMinute: 1, score: 50, isOneWay: true, roadClass: "path", explanation: "" },
        { edgeId: "c-b", fromNodeId: "c", toNodeId: "b", distanceM: 1, costMinute: 1, score: 50, isOneWay: true, roadClass: "path", explanation: "" },
        { edgeId: "b-d", fromNodeId: "b", toNodeId: "d", distanceM: 1, costMinute: 1, score: 50, isOneWay: true, roadClass: "path", explanation: "" },
        { edgeId: "d-z", fromNodeId: "d", toNodeId: "z", distanceM: 10, costMinute: 10, score: 50, isOneWay: true, roadClass: "path", explanation: "" },
      ],
    };
    const result = shortestPath(graph, "a", "z");
    expect(result.isSuccess && result.nodeId).toEqual(["a", "c", "b", "d", "z"]);
    expect(result.isSuccess && result.costMinute).toBe(13);
  });

  it("keeps actual time while optimizing the comfort balance", () => {
    const result = shortestPath(routeGraph, "ateneo-gate-3", "lrt-katipunan", new Set(), comfortBalanceProfile);
    expect(result.isSuccess).toBe(true);
    if (!result.isSuccess) return;
    expect(result.edgeId).toEqual(["gate3-regis", "regis-esteban", "esteban-popup", "popup-blue", "blue-lrt"]);
    expect(result.costMinute).toBeCloseTo(18.9);
  });

  it("distinguishes invalid and negative edge costs", () => {
    const invalidGraph: RouteGraph = { ...routeGraph, edge: routeGraph.edge.map((edge, index) => index === 0 ? { ...edge, costMinute: Number.NaN } : edge) };
    const negativeGraph: RouteGraph = { ...routeGraph, edge: routeGraph.edge.map((edge, index) => index === 0 ? { ...edge, costMinute: -1 } : edge) };
    const invalidScoreGraph: RouteGraph = { ...routeGraph, edge: routeGraph.edge.map((edge, index) => index === 0 ? { ...edge, score: 101 } : edge) };
    expect(shortestPath(invalidGraph, "ateneo-gate-3", "lrt-katipunan")).toMatchObject({ isSuccess: false, reason: "invalid_cost" });
    expect(shortestPath(negativeGraph, "ateneo-gate-3", "lrt-katipunan")).toMatchObject({ isSuccess: false, reason: "negative_cost" });
    expect(shortestPath(invalidScoreGraph, "ateneo-gate-3", "lrt-katipunan", new Set(), comfortBalanceProfile)).toMatchObject({ isSuccess: false, reason: "invalid_cost" });
  });

  it("deduplicates alternatives and keeps stable route identity", () => {
    const result = alternativePath(routeGraph, "ateneo-gate-3", "lrt-katipunan");
    const success = result.filter((item) => item.isSuccess);
    expect(success).toHaveLength(2);
    expect(new Set(success.map((item) => routeIdentity(item.nodeId, item.edgeId))).size).toBe(2);
    expect(routeIdentity(success[0].nodeId, success[0].edgeId)).toBe(
      "route:ateneo-gate-3>ateneo-gate-2-5>katipunan-footbridge>lrt-katipunan::gate3-gate25|gate25-footbridge|footbridge-lrt",
    );
    expect(routeIdentity(success[1].nodeId, success[1].edgeId)).toBe(
      "route:ateneo-gate-3>regis-center>esteban-abada>pop-up-katipunan>blue-residence>lrt-katipunan::gate3-regis|regis-esteban|esteban-popup|popup-blue|blue-lrt",
    );
  });
});
