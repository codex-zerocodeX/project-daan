import { describe, expect, it } from "vitest";
import { planRoute } from "./route";

describe("planRoute", () => {
  it("returns independently optimized time and comfort choices", () => {
    const plan = planRoute("ateneo-gate-3", "lrt-katipunan", "14:00");
    expect(plan.failure).toBeNull();
    expect(plan.alternative.map((item) => item.profile)).toEqual([["shortest_time"], ["comfort_balance"]]);
    expect(plan.alternative.map((item) => item.label)).toEqual(["Shortest time", "Comfort balance"]);
    expect(plan.alternative[0].path.edgeId).toEqual(["gate3-gate25", "gate25-footbridge", "footbridge-lrt"]);
    expect(plan.alternative[0].path.costMinute).toBeCloseTo(14.9);
    expect(plan.alternative[1].path.edgeId).toEqual(["gate3-regis", "regis-esteban", "esteban-popup", "popup-blue", "blue-lrt"]);
    expect(plan.alternative[1].path.costMinute).toBeCloseTo(18.9);
  });

  it("deduplicates a path that satisfies both profiles", () => {
    const plan = planRoute("regis-center", "esteban-abada", "14:00");
    expect(plan.failure).toBeNull();
    expect(plan.alternative).toHaveLength(1);
    expect(plan.alternative[0].profile).toEqual(["shortest_time", "comfort_balance"]);
    expect(plan.alternative[0].label).toBe("Shortest time · Comfort balance");
  });

  it("preserves typed route failures", () => {
    expect(planRoute("ateneo-gate-3", "missing", "14:00")).toEqual({
      alternative: [],
      failure: {
        isSuccess: false,
        reason: "missing_node",
        nodeId: [],
        edgeId: [],
        costMinute: 0,
        distanceM: 0,
      },
    });
  });
});
