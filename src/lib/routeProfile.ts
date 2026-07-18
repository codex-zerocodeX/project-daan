import type { RouteEdge } from "./type";

export type RouteProfileId = "shortest_time" | "comfort_balance";
export type RouteWeightFailure = "negative_cost" | "invalid_cost";

export type RouteWeightResult =
  | { isValid: true; weightMinute: number }
  | { isValid: false; reason: RouteWeightFailure };

export interface RouteProfile {
  profileId: RouteProfileId;
  label: string;
  weightEdge: (edge: RouteEdge) => RouteWeightResult;
}

function validCostMinute(costMinute: number): RouteWeightResult | null {
  if (!Number.isFinite(costMinute)) return { isValid: false, reason: "invalid_cost" };
  if (costMinute < 0) return { isValid: false, reason: "negative_cost" };
  return null;
}

export const shortestTimeProfile: RouteProfile = {
  profileId: "shortest_time",
  label: "Shortest time",
  weightEdge(edge) {
    return validCostMinute(edge.costMinute) ?? { isValid: true, weightMinute: edge.costMinute };
  },
};

export const comfortBalanceProfile: RouteProfile = {
  profileId: "comfort_balance",
  label: "Comfort balance",
  weightEdge(edge) {
    const costFailure = validCostMinute(edge.costMinute);
    if (costFailure) return costFailure;
    if (!Number.isFinite(edge.score) || edge.score < 0 || edge.score > 100) {
      return { isValid: false, reason: "invalid_cost" };
    }
    const comfortPriority = Math.max(edge.score / 100, 0.25);
    const weightMinute = edge.costMinute / comfortPriority;
    if (!Number.isFinite(weightMinute)) return { isValid: false, reason: "invalid_cost" };
    if (weightMinute < 0) return { isValid: false, reason: "negative_cost" };
    return { isValid: true, weightMinute };
  },
};

export function routeWeight(profile: RouteProfile, edge: RouteEdge[]) {
  let weightMinute = 0;
  for (const item of edge) {
    const result = profile.weightEdge(item);
    if (!result.isValid) return result;
    weightMinute += result.weightMinute;
  }
  return Number.isFinite(weightMinute)
    ? { isValid: true as const, weightMinute }
    : { isValid: false as const, reason: "invalid_cost" as const };
}
