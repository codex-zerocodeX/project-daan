import { haversineMeters, type Point } from "./geo";

/** A node loaded from the DB, flattened with its parent route + thread ids. */
export type ComposeNode = {
  id: string;
  route_id: string;
  thread_id: string;
  seq: number;
  lat: number;
  lng: number;
  label: string;
};

export type ComposeStep = { node_id: string; label: string; lat: number; lng: number };

export type ComposeResult = {
  existing: boolean;
  distance_m: number;
  thread_ids: string[];
  route_ids: string[];
  steps: ComposeStep[];
  /** GeoJSON [lng,lat] order, bracketed by the real origin and destination. */
  coordinates: [number, number][];
};

export type ComposeOptions = {
  /** Max distance to snap origin/destination onto a nearby node. */
  snapMeters?: number;
  /** Max distance to link two nodes from different routes into one graph. */
  stitchMeters?: number;
};

const DEFAULTS = { snapMeters: 300, stitchMeters: 150 };

const ORIGIN = "__origin__";
const DEST = "__dest__";

/**
 * Compose a route from origin to destination out of community-contributed nodes.
 * Prefers a single existing answer-route that already spans both ends; otherwise
 * stitches nodes from multiple threads via a proximity graph + Dijkstra.
 * Returns null when no path can be formed.
 */
export function composeRoute(
  nodes: ComposeNode[],
  origin: Point,
  destination: Point,
  options: ComposeOptions = {},
): ComposeResult | null {
  const { snapMeters, stitchMeters } = { ...DEFAULTS, ...options };
  if (nodes.length === 0) return null;

  const byId = new Map(nodes.map((node) => [node.id, node]));

  const existing = findExistingRoute(nodes, origin, destination, snapMeters);
  if (existing) return existing;

  const graph = buildGraph(nodes, origin, destination, snapMeters, stitchMeters);
  const path = dijkstra(graph, ORIGIN, DEST);
  if (!path) return null;

  const nodeIds = path.order.filter((id) => id !== ORIGIN && id !== DEST);
  if (nodeIds.length === 0) return null;

  const pathNodes = nodeIds.map((id) => byId.get(id)!);
  return toResult(pathNodes, origin, destination, path.distance, false);
}

/** A single existing answer with a node near the origin and a later node near the destination. */
function findExistingRoute(
  nodes: ComposeNode[],
  origin: Point,
  destination: Point,
  snapMeters: number,
): ComposeResult | null {
  const byRoute = groupBy(nodes, (node) => node.route_id);
  let best: { chain: ComposeNode[]; cost: number } | null = null;

  for (const chain of byRoute.values()) {
    const ordered = [...chain].sort((a, b) => a.seq - b.seq);
    const start = nearest(ordered, origin, snapMeters);
    const end = nearest(ordered, destination, snapMeters);
    if (!start || !end || start.node.seq > end.node.seq) continue;

    const cost = start.dist + end.dist;
    if (!best || cost < best.cost) {
      const slice = ordered.filter(
        (node) => node.seq >= start.node.seq && node.seq <= end.node.seq,
      );
      best = { chain: slice, cost };
    }
  }

  if (!best) return null;
  const distance = pathDistance(best.chain, origin, destination);
  return toResult(best.chain, origin, destination, distance, true);
}

type Graph = Map<string, { to: string; weight: number }[]>;

function buildGraph(
  nodes: ComposeNode[],
  origin: Point,
  destination: Point,
  snapMeters: number,
  stitchMeters: number,
): Graph {
  const graph: Graph = new Map();
  const link = (a: string, b: string, weight: number) => {
    if (!graph.has(a)) graph.set(a, []);
    if (!graph.has(b)) graph.set(b, []);
    graph.get(a)!.push({ to: b, weight });
    graph.get(b)!.push({ to: a, weight });
  };

  // consecutive nodes within the same answer-route (the author's intended order)
  for (const chain of groupBy(nodes, (node) => node.route_id).values()) {
    const ordered = [...chain].sort((a, b) => a.seq - b.seq);
    for (let i = 0; i + 1 < ordered.length; i++) {
      link(ordered[i].id, ordered[i + 1].id, haversineMeters(ordered[i], ordered[i + 1]));
    }
  }

  // cross-route stitch links between nearby nodes from different routes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].route_id === nodes[j].route_id) continue;
      const d = haversineMeters(nodes[i], nodes[j]);
      if (d <= stitchMeters) link(nodes[i].id, nodes[j].id, d);
    }
  }

  // virtual origin/destination vertices snapped to nearby nodes
  for (const node of nodes) {
    const dOrigin = haversineMeters(origin, node);
    if (dOrigin <= snapMeters) link(ORIGIN, node.id, dOrigin);
    const dDest = haversineMeters(destination, node);
    if (dDest <= snapMeters) link(node.id, DEST, dDest);
  }

  return graph;
}

function dijkstra(graph: Graph, source: string, target: string) {
  const dist = new Map<string, number>([[source, 0]]);
  const prev = new Map<string, string>();
  const visited = new Set<string>();

  while (visited.size < graph.size) {
    let current: string | null = null;
    let currentDist = Infinity;
    for (const [node, d] of dist) {
      if (!visited.has(node) && d < currentDist) {
        current = node;
        currentDist = d;
      }
    }
    if (current === null) break;
    if (current === target) break;
    visited.add(current);

    for (const edge of graph.get(current) ?? []) {
      const next = currentDist + edge.weight;
      if (next < (dist.get(edge.to) ?? Infinity)) {
        dist.set(edge.to, next);
        prev.set(edge.to, current);
      }
    }
  }

  if (!dist.has(target)) return null;

  const order: string[] = [];
  let step: string | undefined = target;
  while (step !== undefined) {
    order.unshift(step);
    step = prev.get(step);
  }
  if (order[0] !== source) return null;
  return { order, distance: dist.get(target)! };
}

function toResult(
  chain: ComposeNode[],
  origin: Point,
  destination: Point,
  distance: number,
  existing: boolean,
): ComposeResult {
  return {
    existing,
    distance_m: Math.round(distance),
    thread_ids: distinct(chain.map((node) => node.thread_id)),
    route_ids: distinct(chain.map((node) => node.route_id)),
    steps: chain.map((node) => ({ node_id: node.id, label: node.label, lat: node.lat, lng: node.lng })),
    coordinates: [
      [origin.lng, origin.lat],
      ...chain.map((node): [number, number] => [node.lng, node.lat]),
      [destination.lng, destination.lat],
    ],
  };
}

function pathDistance(chain: ComposeNode[], origin: Point, destination: Point): number {
  const points: Point[] = [origin, ...chain, destination];
  let total = 0;
  for (let i = 0; i + 1 < points.length; i++) total += haversineMeters(points[i], points[i + 1]);
  return total;
}

function nearest(nodes: ComposeNode[], to: Point, within: number) {
  let best: { node: ComposeNode; dist: number } | null = null;
  for (const node of nodes) {
    const dist = haversineMeters(to, node);
    if (dist <= within && (!best || dist < best.dist)) best = { node, dist };
  }
  return best;
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

function distinct<T>(items: T[]): T[] {
  return [...new Set(items)];
}
