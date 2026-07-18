import { describe, expect, it } from "vitest";
import { routeGraph } from "../fixture/network";
import { comfortBalanceProfile, routeWeight, shortestTimeProfile } from "./routeProfile";
import type { RouteEdge } from "./type";

const baseEdge: RouteEdge = {
  edgeId: "test-edge",
  fromNodeId: "a",
  toNodeId: "b",
  distanceM: 100,
  costMinute: 4,
  score: 100,
  isOneWay: false,
  roadClass: "path",
  explanation: "Test edge",
};

describe("route profile", () => {
  it("keeps actual minutes for the shortest-time profile", () => {
    expect(shortestTimeProfile.weightEdge(baseEdge)).toEqual({ isValid: true, weightMinute: 4 });
  });

  it("applies a bounded inverse comfort priority", () => {
    expect(comfortBalanceProfile.weightEdge(baseEdge)).toEqual({ isValid: true, weightMinute: 4 });
    expect(comfortBalanceProfile.weightEdge({ ...baseEdge, score: 50 })).toEqual({ isValid: true, weightMinute: 8 });
    expect(comfortBalanceProfile.weightEdge({ ...baseEdge, score: 0 })).toEqual({ isValid: true, weightMinute: 16 });
  });

  it("distinguishes invalid and negative cost", () => {
    expect(shortestTimeProfile.weightEdge({ ...baseEdge, costMinute: Number.NaN })).toEqual({ isValid: false, reason: "invalid_cost" });
    expect(shortestTimeProfile.weightEdge({ ...baseEdge, costMinute: -1 })).toEqual({ isValid: false, reason: "negative_cost" });
    expect(comfortBalanceProfile.weightEdge({ ...baseEdge, score: 101 })).toEqual({ isValid: false, reason: "invalid_cost" });
  });

  it("makes the fixture side-street route the comfort-balanced choice", () => {
    const edgeById = new Map(routeGraph.edge.map((edge) => [edge.edgeId, edge]));
    const directEdge = ["gate3-gate25", "gate25-footbridge", "footbridge-lrt"].map((edgeId) => edgeById.get(edgeId)!);
    const comfortEdge = ["gate3-regis", "regis-esteban", "esteban-popup", "popup-blue", "blue-lrt"].map((edgeId) => edgeById.get(edgeId)!);
    const directWeight = routeWeight(comfortBalanceProfile, directEdge);
    const comfortWeight = routeWeight(comfortBalanceProfile, comfortEdge);
    expect(directWeight.isValid && directWeight.weightMinute).toBeCloseTo(34.28, 2);
    expect(comfortWeight.isValid && comfortWeight.weightMinute).toBeCloseTo(31.35, 2);
  });
});
