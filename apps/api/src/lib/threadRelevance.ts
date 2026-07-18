import { haversineMeters, type Point } from "./geo";

/** A node loaded from the DB, flattened with its parent route + thread ids. */
export type RelevanceNode = {
  thread_id: string;
  route_id: string;
  seq: number;
  lat: number;
  lng: number;
};

export type ThreadMatch = "exact" | "partial";

export type RelevanceResult = {
  thread_id: string;
  match: ThreadMatch;
  /** metres to the nearest matching node, or null when that endpoint is unmatched */
  origin_distance_m: number | null;
  destination_distance_m: number | null;
  /** the answer-routes on this thread that contributed to the match */
  route_ids: string[];
};

export type RelevanceOptions = {
  /** Max distance from a trip endpoint to a node for it to count as matching. */
  radiusMeters?: number;
};

const DEFAULTS = { radiusMeters: 800 };

/** Sort weight for an unmatched endpoint - always loses to any real distance. */
const UNMATCHED = Number.MAX_SAFE_INTEGER;

/**
 * Rank community threads by how well their answer-routes serve a trip.
 * "exact" = one answer has a node near the origin and a *later* node near the
 * destination; "partial" = nodes near only one endpoint. Threads near neither
 * endpoint are dropped. Ordering is fully deterministic for a given input set.
 */
export function rankThreads(
  nodes: RelevanceNode[],
  origin: Point,
  destination: Point,
  options: RelevanceOptions = {},
): RelevanceResult[] {
  const { radiusMeters } = { ...DEFAULTS, ...options };

  const results: RelevanceResult[] = [];
  for (const [thread_id, threadNodes] of groupBy(nodes, (node) => node.thread_id)) {
    const result = rankThread(thread_id, threadNodes, origin, destination, radiusMeters);
    if (result) results.push(result);
  }

  return results.sort(compareResults);
}

/** Classify a single thread from all of its nodes. Null when nothing is near. */
function rankThread(
  thread_id: string,
  threadNodes: RelevanceNode[],
  origin: Point,
  destination: Point,
  radiusMeters: number,
): RelevanceResult | null {
  const byRoute = groupBy(threadNodes, (node) => node.route_id);

  // An answer-route qualifies as exact when it has an origin node at or before
  // a destination node; keep the cheapest such pair per route.
  const exact: { route_id: string; originDist: number; destDist: number }[] = [];
  const partial: { route_id: string; originDist: number | null; destDist: number | null }[] = [];

  for (const [route_id, routeNodes] of byRoute) {
    const originHits = withinRadius(routeNodes, origin, radiusMeters);
    const destHits = withinRadius(routeNodes, destination, radiusMeters);
    if (originHits.length === 0 && destHits.length === 0) continue;

    const pair = bestForwardPair(originHits, destHits);
    if (pair) exact.push({ route_id, ...pair });
    else {
      partial.push({
        route_id,
        originDist: nearest(originHits),
        destDist: nearest(destHits),
      });
    }
  }

  if (exact.length > 0) {
    return {
      thread_id,
      match: "exact",
      origin_distance_m: Math.round(Math.min(...exact.map((hit) => hit.originDist))),
      destination_distance_m: Math.round(Math.min(...exact.map((hit) => hit.destDist))),
      route_ids: exact.map((hit) => hit.route_id),
    };
  }

  if (partial.length === 0) return null;

  return {
    thread_id,
    match: "partial",
    origin_distance_m: roundOrNull(smallest(partial.map((hit) => hit.originDist))),
    destination_distance_m: roundOrNull(smallest(partial.map((hit) => hit.destDist))),
    route_ids: partial.map((hit) => hit.route_id),
  };
}

type Hit = { seq: number; dist: number };

/** Nodes of one route within `radius` of a point, with their distances. */
function withinRadius(nodes: RelevanceNode[], to: Point, radius: number): Hit[] {
  const hits: Hit[] = [];
  for (const node of nodes) {
    const dist = haversineMeters(to, node);
    if (dist <= radius) hits.push({ seq: node.seq, dist });
  }
  return hits;
}

/** Cheapest origin/destination hit pair that travels forwards (seq ascending). */
function bestForwardPair(originHits: Hit[], destHits: Hit[]) {
  let best: { originDist: number; destDist: number } | null = null;
  for (const start of originHits) {
    for (const end of destHits) {
      if (start.seq > end.seq) continue;
      const cost = start.dist + end.dist;
      if (!best || cost < best.originDist + best.destDist) {
        best = { originDist: start.dist, destDist: end.dist };
      }
    }
  }
  return best;
}

/** Distance of the closest hit, or null when there are none. */
function nearest(hits: Hit[]): number | null {
  return smallest(hits.map((hit) => hit.dist));
}

function smallest(values: (number | null)[]): number | null {
  let best: number | null = null;
  for (const value of values) {
    if (value !== null && (best === null || value < best)) best = value;
  }
  return best;
}

function roundOrNull(value: number | null): number | null {
  return value === null ? null : Math.round(value);
}

/** Exact before partial, then nearest combined distance, then thread id. */
function compareResults(a: RelevanceResult, b: RelevanceResult): number {
  if (a.match !== b.match) return a.match === "exact" ? -1 : 1;
  const delta = combinedDistance(a) - combinedDistance(b);
  if (delta !== 0) return delta;
  return a.thread_id < b.thread_id ? -1 : a.thread_id > b.thread_id ? 1 : 0;
}

function combinedDistance(result: RelevanceResult): number {
  return (result.origin_distance_m ?? UNMATCHED) + (result.destination_distance_m ?? UNMATCHED);
}

function groupBy<T, K>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = map.get(k);
    if (bucket) bucket.push(item);
    else map.set(k, [item]);
  }
  return map;
}
