import routeAfternoonJson from "../fixture/route.json";
import routeMorningJson from "../fixture/route-morning.json";
import { review, routeThread } from "../fixture/discussion";
import { routeGraph } from "../fixture/network";
import { routeIdentity, shortestPath } from "./path";
import { comfortBalanceProfile, shortestTimeProfile, type RouteProfileId } from "./routeProfile";
import { resolveThread } from "./thread";
import type { DepartureTime, Evidence, PathFailure, PlaceNode, Route, RouteAlternative, RouteEdge, Segment, Weather } from "./type";
import { verdictFromScore } from "./verdict";

interface EvidenceJson {
  kind: Evidence["kind"];
  value: string;
  state: Evidence["state"];
  delta: number;
  source: Evidence["source"];
  weight: number;
  source_url: string | null;
  report_id: string | null;
  reporter_karma: number | null;
  reported_at: string | null;
}

interface SegmentJson {
  segment_id: string;
  name: string;
  length_m: number;
  score: number;
  polyline: [number, number][];
  road_class: string;
  evidence: EvidenceJson[];
  explanation: string;
}

interface RouteJson {
  route_id: string;
  origin_label: string;
  destination_label: string;
  departure_time: string;
  distance_m: number;
  duration_min: number;
  score: number;
  verdict: Route["verdict"];
  coverage_pct: number;
  weather: {
    apparent_temperature_c: number;
    rain_probability_pct: number;
    multiplier: number;
    source: Weather["source"];
    fetched_at: string;
  };
  is_fixture: boolean;
  segment: SegmentJson[];
}

type UnknownRecord = Record<string, unknown>;

const routeKey = [
  "route_id",
  "origin_label",
  "destination_label",
  "departure_time",
  "distance_m",
  "duration_min",
  "score",
  "verdict",
  "coverage_pct",
  "weather",
  "is_fixture",
  "segment",
];
const weatherKey = ["apparent_temperature_c", "rain_probability_pct", "multiplier", "source", "fetched_at"];
const segmentKey = ["segment_id", "name", "length_m", "score", "polyline", "road_class", "evidence", "explanation"];
const evidenceKey = [
  "kind",
  "value",
  "state",
  "delta",
  "source",
  "weight",
  "source_url",
  "report_id",
  "reporter_karma",
  "reported_at",
];

function assertRecord(value: unknown, label: string): asserts value is UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertExactKey(record: UnknownRecord, expectedKey: string[], label: string) {
  const actualKey = Object.keys(record).sort();
  const normalizedExpectedKey = [...expectedKey].sort();
  if (actualKey.join("|") !== normalizedExpectedKey.join("|")) {
    throw new Error(`${label} does not match the frozen data contract`);
  }
}

function assertType(value: unknown, type: "string" | "number" | "boolean", label: string) {
  if (typeof value !== type) throw new Error(`${label} must be ${type}`);
}

function assertNullableType(value: unknown, type: "string" | "number", label: string) {
  if (value !== null && typeof value !== type) throw new Error(`${label} must be ${type} or null`);
}

function parseRouteJson(value: unknown): RouteJson {
  assertRecord(value, "route");
  assertExactKey(value, routeKey, "route");
  for (const key of ["route_id", "origin_label", "destination_label", "departure_time", "verdict"] as const) {
    assertType(value[key], "string", `route.${key}`);
  }
  for (const key of ["distance_m", "duration_min", "score", "coverage_pct"] as const) {
    assertType(value[key], "number", `route.${key}`);
  }
  assertType(value.is_fixture, "boolean", "route.is_fixture");

  assertRecord(value.weather, "route.weather");
  assertExactKey(value.weather, weatherKey, "route.weather");
  for (const key of ["apparent_temperature_c", "rain_probability_pct", "multiplier"] as const) {
    assertType(value.weather[key], "number", `route.weather.${key}`);
  }
  for (const key of ["source", "fetched_at"] as const) {
    assertType(value.weather[key], "string", `route.weather.${key}`);
  }

  if (!Array.isArray(value.segment)) throw new Error("route.segment must be an array");
  value.segment.forEach((segment, segmentIndex) => {
    assertRecord(segment, `route.segment[${segmentIndex}]`);
    assertExactKey(segment, segmentKey, `route.segment[${segmentIndex}]`);
    for (const key of ["segment_id", "name", "road_class", "explanation"] as const) {
      assertType(segment[key], "string", `route.segment[${segmentIndex}].${key}`);
    }
    for (const key of ["length_m", "score"] as const) {
      assertType(segment[key], "number", `route.segment[${segmentIndex}].${key}`);
    }
    if (!Array.isArray(segment.polyline)) throw new Error(`route.segment[${segmentIndex}].polyline must be an array`);
    segment.polyline.forEach((coordinate, coordinateIndex) => {
      if (!Array.isArray(coordinate) || coordinate.length !== 2 || coordinate.some((item) => typeof item !== "number")) {
        throw new Error(`route.segment[${segmentIndex}].polyline[${coordinateIndex}] must be a coordinate pair`);
      }
    });
    if (!Array.isArray(segment.evidence)) throw new Error(`route.segment[${segmentIndex}].evidence must be an array`);
    segment.evidence.forEach((evidence, evidenceIndex) => {
      assertRecord(evidence, `route.segment[${segmentIndex}].evidence[${evidenceIndex}]`);
      assertExactKey(evidence, evidenceKey, `route.segment[${segmentIndex}].evidence[${evidenceIndex}]`);
      for (const key of ["kind", "value", "state", "source"] as const) {
        assertType(evidence[key], "string", `evidence.${key}`);
      }
      for (const key of ["delta", "weight"] as const) {
        assertType(evidence[key], "number", `evidence.${key}`);
      }
      assertNullableType(evidence.source_url, "string", "evidence.source_url");
      assertNullableType(evidence.report_id, "string", "evidence.report_id");
      assertNullableType(evidence.reporter_karma, "number", "evidence.reporter_karma");
      assertNullableType(evidence.reported_at, "string", "evidence.reported_at");
    });
  });

  return value as unknown as RouteJson;
}

function mapEvidence(evidence: EvidenceJson): Evidence {
  return {
    kind: evidence.kind,
    value: evidence.value,
    state: evidence.state,
    delta: evidence.delta,
    source: evidence.source,
    weight: evidence.weight,
    sourceUrl: evidence.source_url,
    reportId: evidence.report_id,
    reporterKarma: evidence.reporter_karma,
    reportedAt: evidence.reported_at,
  };
}

function mapSegment(segment: SegmentJson): Segment {
  return {
    segmentId: segment.segment_id,
    name: segment.name,
    lengthM: segment.length_m,
    score: segment.score,
    polyline: segment.polyline,
    roadClass: segment.road_class,
    evidence: segment.evidence.map(mapEvidence),
    explanation: segment.explanation,
  };
}

function mapRoute(route: RouteJson): Route {
  return {
    routeId: route.route_id,
    originLabel: route.origin_label,
    destinationLabel: route.destination_label,
    departureTime: route.departure_time,
    distanceM: route.distance_m,
    durationMin: route.duration_min,
    score: route.score,
    verdict: route.verdict,
    coveragePct: route.coverage_pct,
    weather: {
      apparentTemperatureC: route.weather.apparent_temperature_c,
      rainProbabilityPct: route.weather.rain_probability_pct,
      multiplier: route.weather.multiplier,
      source: route.weather.source,
      fetchedAt: route.weather.fetched_at,
    },
    isFixture: route.is_fixture,
    segment: route.segment.map(mapSegment),
  };
}

const routeByDeparture: Record<DepartureTime, RouteJson> = {
  "06:00": parseRouteJson(routeMorningJson),
  "14:00": parseRouteJson(routeAfternoonJson),
};

export function loadRoute(departureTime: DepartureTime): Route {
  return mapRoute(routeByDeparture[departureTime]);
}

const nodeById = new Map(routeGraph.node.map((node) => [node.nodeId, node]));
const edgeById = new Map(routeGraph.edge.map((edge) => [edge.edgeId, edge]));

function dynamicEvidence(edge: RouteEdge): Evidence[] {
  return [
    {
      kind: "road_class",
      value: edge.roadClass,
      state: edge.score >= 50 ? "positive" : "negative",
      delta: Math.round((edge.score - 50) / 2),
      source: "osm",
      weight: 1,
      sourceUrl: null,
      reportId: null,
      reporterKarma: null,
      reportedAt: null,
    },
    {
      kind: "sidewalk",
      value: edge.score >= 60 ? "reported continuous" : "coverage varies",
      state: edge.score >= 60 ? "positive" : "unknown",
      delta: edge.score >= 60 ? 10 : 0,
      source: edge.score >= 60 ? "community" : "osm",
      weight: edge.score >= 60 ? 0.8 : 1,
      sourceUrl: null,
      reportId: edge.score >= 60 ? `report-${edge.edgeId}` : null,
      reporterKarma: edge.score >= 60 ? 3 : null,
      reportedAt: edge.score >= 60 ? "2026-07-18T10:20:00+08:00" : null,
    },
  ];
}

function routeFromPath(path: RouteAlternative["path"], departureTime: DepartureTime): Route {
  const fixture = loadRoute(departureTime);
  const edge = path.edgeId.map((edgeId) => edgeById.get(edgeId)).filter((item): item is RouteEdge => Boolean(item));
  const segment: Segment[] = edge.map((item, index) => {
    const fromNode = nodeById.get(path.nodeId[index])!;
    const toNode = nodeById.get(path.nodeId[index + 1])!;
    return {
      segmentId: item.edgeId,
      name: `${fromNode.shortName} → ${toNode.shortName}`,
      lengthM: item.distanceM,
      score: item.score,
      polyline: [
        [fromNode.position[1], fromNode.position[0]],
        [toNode.position[1], toNode.position[0]],
      ],
      roadClass: item.roadClass,
      evidence: dynamicEvidence(item),
      explanation: item.explanation,
    };
  });
  const baseScore = path.distanceM === 0 ? 100 : edge.reduce((sum, item) => sum + item.score * item.distanceM, 0) / path.distanceM;
  const distancePenalty = Math.max(0, Math.floor((path.distanceM - 1500) / 1000) * 5);
  const score = Math.max(0, Math.min(100, Math.round(baseScore * fixture.weather.multiplier - distancePenalty)));
  return {
    routeId: routeIdentity(path.nodeId, path.edgeId),
    originLabel: nodeById.get(path.nodeId[0])?.name ?? "Origin",
    destinationLabel: nodeById.get(path.nodeId.at(-1) ?? "")?.name ?? "Destination",
    departureTime: fixture.departureTime,
    distanceM: path.distanceM,
    durationMin: Math.round(path.costMinute),
    score,
    verdict: verdictFromScore(score),
    coveragePct: path.edgeId.length === 0 ? 100 : Math.round(edge.reduce((sum, item) => sum + (item.score >= 50 ? item.distanceM : item.distanceM * 0.62), 0) / path.distanceM * 100),
    weather: fixture.weather,
    isFixture: true,
    segment,
  };
}

export interface RoutePlanResult {
  alternative: RouteAlternative[];
  failure: PathFailure | null;
}

function profileLabel(profile: RouteProfileId[]) {
  if (profile.includes("shortest_time") && profile.includes("comfort_balance")) {
    return "Shortest time · Comfort balance";
  }
  return profile.includes("comfort_balance") ? comfortBalanceProfile.label : shortestTimeProfile.label;
}

function routeAlternative(path: RouteAlternative["path"], departureTime: DepartureTime, profile: RouteProfileId[]): RouteAlternative {
  const routeId = routeIdentity(path.nodeId, path.edgeId);
  return {
    routeId,
    label: profileLabel(profile),
    profile,
    path,
    route: routeFromPath(path, departureTime),
    thread: resolveThread(routeId, path.nodeId, routeThread),
  };
}

export function planRoute(originNodeId: string, destinationNodeId: string, departureTime: DepartureTime): RoutePlanResult {
  const shortestPathResult = shortestPath(routeGraph, originNodeId, destinationNodeId, new Set(), shortestTimeProfile);
  if (!shortestPathResult.isSuccess) return { alternative: [], failure: shortestPathResult };

  const comfortPathResult = shortestPath(routeGraph, originNodeId, destinationNodeId, new Set(), comfortBalanceProfile);
  if (!comfortPathResult.isSuccess) return { alternative: [], failure: comfortPathResult };

  const shortestRouteId = routeIdentity(shortestPathResult.nodeId, shortestPathResult.edgeId);
  const comfortRouteId = routeIdentity(comfortPathResult.nodeId, comfortPathResult.edgeId);
  if (shortestRouteId === comfortRouteId) {
    return {
      alternative: [routeAlternative(shortestPathResult, departureTime, ["shortest_time", "comfort_balance"])],
      failure: null,
    };
  }

  return {
    alternative: [
      routeAlternative(shortestPathResult, departureTime, ["shortest_time"]),
      routeAlternative(comfortPathResult, departureTime, ["comfort_balance"]),
    ],
    failure: null,
  };
}

export function placeNode(): PlaceNode[] {
  return routeGraph.node;
}

export { review, routeGraph, routeThread };
