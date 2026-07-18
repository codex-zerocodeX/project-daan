import type { PathFailure, PathResult, PathSuccess, RouteEdge, RouteGraph } from "./type";
import { MinPriorityQueue } from "./priorityQueue";
import { shortestTimeProfile, type RouteProfile } from "./routeProfile";

interface AdjacencyEntry {
  edge: RouteEdge;
  nextNodeId: string;
}

interface QueueEntry {
  nodeId: string;
  weightMinute: number;
  pathKey: string;
}

function pathFailure(reason: PathFailure["reason"]): PathFailure {
  return { isSuccess: false, reason, nodeId: [], edgeId: [], costMinute: 0, distanceM: 0 };
}

function buildAdjacency(graph: RouteGraph, excludedEdgeId: Set<string>) {
  const adjacency = new Map<string, AdjacencyEntry[]>();

  for (const node of graph.node) adjacency.set(node.nodeId, []);
  for (const edge of graph.edge) {
    if (excludedEdgeId.has(edge.edgeId)) continue;
    adjacency.get(edge.fromNodeId)?.push({ edge, nextNodeId: edge.toNodeId });
    if (!edge.isOneWay) adjacency.get(edge.toNodeId)?.push({ edge, nextNodeId: edge.fromNodeId });
  }

  for (const entry of adjacency.values()) {
    entry.sort((left, right) => left.nextNodeId.localeCompare(right.nextNodeId) || left.edge.edgeId.localeCompare(right.edge.edgeId));
  }
  return adjacency;
}

function queueSort(left: QueueEntry, right: QueueEntry) {
  return left.weightMinute - right.weightMinute || left.pathKey.localeCompare(right.pathKey) || left.nodeId.localeCompare(right.nodeId);
}

export function routeIdentity(nodeId: string[], edgeId: string[]) {
  return `route:${nodeId.join(">")}::${edgeId.join("|")}`;
}

export function shortestPath(
  graph: RouteGraph,
  originNodeId: string,
  destinationNodeId: string,
  excludedEdgeId = new Set<string>(),
  profile: RouteProfile = shortestTimeProfile,
): PathResult {
  const nodeId = new Set(graph.node.map((node) => node.nodeId));
  if (!nodeId.has(originNodeId) || !nodeId.has(destinationNodeId)) return pathFailure("missing_node");
  for (const edge of graph.edge) {
    const weight = profile.weightEdge(edge);
    if (!weight.isValid) return pathFailure(weight.reason);
  }
  if (originNodeId === destinationNodeId) {
    return { isSuccess: true, nodeId: [originNodeId], edgeId: [], costMinute: 0, distanceM: 0 };
  }

  const adjacency = buildAdjacency(graph, excludedEdgeId);
  const best = new Map<string, { weightMinute: number; pathKey: string; previousNodeId: string | null; edgeId: string | null }>();
  const queue = new MinPriorityQueue<QueueEntry>(queueSort);
  queue.push({ nodeId: originNodeId, weightMinute: 0, pathKey: originNodeId });
  best.set(originNodeId, { weightMinute: 0, pathKey: originNodeId, previousNodeId: null, edgeId: null });

  while (queue.size > 0) {
    const current = queue.pop()!;
    const known = best.get(current.nodeId);
    if (!known || current.weightMinute !== known.weightMinute || current.pathKey !== known.pathKey) continue;
    if (current.nodeId === destinationNodeId) break;

    for (const candidate of adjacency.get(current.nodeId) ?? []) {
      const edgeWeight = profile.weightEdge(candidate.edge);
      if (!edgeWeight.isValid) return pathFailure(edgeWeight.reason);
      const weightMinute = current.weightMinute + edgeWeight.weightMinute;
      const pathKey = `${current.pathKey}>${candidate.nextNodeId}`;
      const previous = best.get(candidate.nextNodeId);
      const isBetter = !previous || weightMinute < previous.weightMinute || (weightMinute === previous.weightMinute && pathKey < previous.pathKey);
      if (!isBetter) continue;
      best.set(candidate.nextNodeId, {
        weightMinute,
        pathKey,
        previousNodeId: current.nodeId,
        edgeId: candidate.edge.edgeId,
      });
      queue.push({ nodeId: candidate.nextNodeId, weightMinute, pathKey });
    }
  }

  if (!best.has(destinationNodeId)) return pathFailure("unreachable");

  const resultNodeId = [destinationNodeId];
  const resultEdgeId: string[] = [];
  let cursor = destinationNodeId;
  while (cursor !== originNodeId) {
    const entry = best.get(cursor)!;
    if (!entry.previousNodeId || !entry.edgeId) return pathFailure("unreachable");
    resultEdgeId.unshift(entry.edgeId);
    resultNodeId.unshift(entry.previousNodeId);
    cursor = entry.previousNodeId;
  }
  const edgeById = new Map(graph.edge.map((edge) => [edge.edgeId, edge]));
  const distanceM = resultEdgeId.reduce((sum, edgeId) => sum + (edgeById.get(edgeId)?.distanceM ?? 0), 0);
  const costMinute = resultEdgeId.reduce((sum, edgeId) => sum + (edgeById.get(edgeId)?.costMinute ?? 0), 0);
  return {
    isSuccess: true,
    nodeId: resultNodeId,
    edgeId: resultEdgeId,
    costMinute,
    distanceM,
  };
}

export function alternativePath(graph: RouteGraph, originNodeId: string, destinationNodeId: string, limit = 2): PathResult[] {
  const primary = shortestPath(graph, originNodeId, destinationNodeId);
  if (!primary.isSuccess || primary.edgeId.length === 0) return [primary];

  const candidate: PathSuccess[] = [primary];
  for (const edgeId of primary.edgeId) {
    const path = shortestPath(graph, originNodeId, destinationNodeId, new Set([edgeId]));
    if (path.isSuccess) candidate.push(path);
  }

  const unique = new Map(candidate.map((path) => [routeIdentity(path.nodeId, path.edgeId), path]));
  return [...unique.values()]
    .sort((left, right) => left.costMinute - right.costMinute || routeIdentity(left.nodeId, left.edgeId).localeCompare(routeIdentity(right.nodeId, right.edgeId)))
    .slice(0, limit);
}
