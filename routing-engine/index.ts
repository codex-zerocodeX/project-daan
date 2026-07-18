/** Pure, in-memory trusted transport routing. It performs no I/O. */
export type VehicleMode = 'jeepney' | 'tricycle' | 'uv_express' | 'bus' | 'train';
export type Coordinates = Readonly<{
    latitude: number;
    longitude: number;
}>;
export interface RawTerminal extends Coordinates {
    readonly id: string;
    readonly mode: VehicleMode;
    readonly netVotes: number;
}
export interface RawThread {
    readonly id: string;
    readonly originTerminalId: string;
    readonly destinationTerminalId: string;
    readonly durationMinutes: number;
    readonly estimatedFare: number;
    readonly walkabilityScore: number;
    readonly netVotes: number;
}
export interface RoutingWeights {
    readonly epsilon: number;
    readonly alpha: number;
    readonly beta: number;
    readonly gamma: number;
    readonly modeTransferPenalty: number;
    readonly walkingTransferPenalty: number;
    readonly walkingSpeedMetersPerMinute: number;
    readonly walkingSafetyScore: number;
    readonly maximumTransitSpeedMetersPerMinute: number;
    readonly walkRadiusMeters: number;
    readonly closeTerminalMeters: number;
    readonly gridCellDegrees: number;
    readonly maxSettledNodes: number;
    readonly maxQueueEntries: number;
}
export const DEFAULT_ROUTING_WEIGHTS: RoutingWeights = Object.freeze({ epsilon: .01, alpha: 1.5, beta: .2, gamma: .5, modeTransferPenalty: 3, walkingTransferPenalty: 2, walkingSpeedMetersPerMinute: 80, walkingSafetyScore: 70, maximumTransitSpeedMetersPerMinute: 1000, walkRadiusMeters: 1000, closeTerminalMeters: 300, gridCellDegrees: .0025, maxSettledNodes: 10000, maxQueueEntries: 200000 });
export interface GraphTerminal extends RawTerminal {
}
export type GraphEdgeKind = 'ride' | 'transfer_walk';
export interface GraphEdge {
    readonly id: string;
    readonly from: string;
    readonly to: string;
    readonly kind: GraphEdgeKind;
    readonly cost: number;
    readonly durationMinutes: number;
    readonly estimatedFare: number;
    readonly walkabilityScore: number;
    readonly modeFrom: VehicleMode;
    readonly modeTo: VehicleMode;
    readonly sourceThreadId?: string;
}
export interface RouteWalkEdge {
    readonly kind: 'entrance_walk' | 'exit_walk';
    readonly from: Coordinates;
    readonly to: Coordinates;
    readonly terminalId: string;
    readonly distanceMeters: number;
    readonly durationMinutes: number;
    readonly cost: number;
}
export interface RouteResult {
    readonly totalCost: number;
    readonly totalDurationMinutes: number;
    readonly totalFare: number;
    readonly entrance: RouteWalkEdge;
    readonly edges: readonly GraphEdge[];
    readonly exit: RouteWalkEdge;
    readonly settledNodes: number;
    readonly usedAStar: boolean;
}
export interface PathNotFoundDiagnostic {
    readonly originCandidateCount: number;
    readonly destinationCandidateCount: number;
    readonly closestReachableTerminalId?: string;
    readonly closestReachableTerminalDistanceMeters?: number;
}
export class PathNotFoundError extends Error {
    constructor(readonly diagnostic: PathNotFoundDiagnostic) { super('No verified community transport path connects the requested locations.'); this.name = 'PathNotFoundError'; }
}
export class SearchLimitError extends Error {
    constructor(message: string) { super(message); this.name = 'SearchLimitError'; }
}
const radians = (n: number) => n * Math.PI / 180;
function finite(n: number, label: string) { if (!Number.isFinite(n))
    throw new TypeError(`${label} must be finite.`); }
function validPoint(p: Coordinates, label: string) { finite(p.latitude, `${label}.latitude`); finite(p.longitude, `${label}.longitude`); if (p.latitude < -90 || p.latitude > 90 || p.longitude < -180 || p.longitude > 180)
    throw new RangeError(`${label} is outside WGS84 bounds.`); }
export function haversineMeters(a: Coordinates, b: Coordinates): number { const lat = radians(b.latitude - a.latitude), lng = radians(b.longitude - a.longitude); const h = Math.sin(lat / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(lng / 2) ** 2; return 2 * 6371008.8 * Math.asin(Math.min(1, Math.sqrt(h))); }
export function trustWeightedCost(thread: Pick<RawThread, 'durationMinutes' | 'walkabilityScore' | 'netVotes'>, weights: RoutingWeights = DEFAULT_ROUTING_WEIGHTS): number { finite(thread.durationMinutes, 'durationMinutes'); finite(thread.walkabilityScore, 'walkabilityScore'); finite(thread.netVotes, 'netVotes'); if (thread.durationMinutes <= 0 || thread.walkabilityScore < 0 || thread.walkabilityScore > 100)
    throw new RangeError('Thread duration or walkability is invalid.'); return Math.max(weights.epsilon, weights.alpha * thread.durationMinutes + weights.beta * (100 - thread.walkabilityScore) - weights.gamma * thread.netVotes); }
function walkingCost(meters: number, w: RoutingWeights, transfer: boolean) { return Math.max(w.epsilon, w.alpha * meters / w.walkingSpeedMetersPerMinute + w.beta * (100 - w.walkingSafetyScore) + (transfer ? w.walkingTransferPenalty : 0)); }
class SpatialIndex {
    private readonly cells = new Map<string, GraphTerminal[]>();
    constructor(private readonly degrees: number, terminals: Iterable<GraphTerminal>) { for (const t of terminals) {
        const key = this.key(t.latitude, t.longitude), cell = this.cells.get(key) ?? [];
        cell.push(t);
        this.cells.set(key, cell);
    } }
    private key(lat: number, lng: number) { return `${Math.floor((lat + 90) / this.degrees)}:${Math.floor((lng + 180) / this.degrees)}`; }
    within(point: Coordinates, radius: number) { validPoint(point, 'query point'); finite(radius, 'radiusMeters'); const ys = Math.ceil(radius / (111000 * this.degrees)) + 1, xs = Math.ceil(radius / (Math.max(1, 111000 * Math.cos(radians(point.latitude)) * this.degrees))) + 1, y0 = Math.floor((point.latitude + 90) / this.degrees), x0 = Math.floor((point.longitude + 180) / this.degrees); const matches: Array<{
        terminal: GraphTerminal;
        distanceMeters: number;
    }> = []; for (let y = -ys; y <= ys; y++)
        for (let x = -xs; x <= xs; x++)
            for (const t of this.cells.get(`${y0 + y}:${x0 + x}`) ?? []) {
                const distanceMeters = haversineMeters(point, t);
                if (distanceMeters <= radius)
                    matches.push({ terminal: t, distanceMeters });
            } return matches.sort((a, b) => a.distanceMeters - b.distanceMeters || a.terminal.id.localeCompare(b.terminal.id)); }
}
export class TransportGraph {
    readonly terminals: ReadonlyMap<string, GraphTerminal>;
    readonly adjacency: ReadonlyMap<string, readonly GraphEdge[]>;
    private readonly index: SpatialIndex;
    private readonly costPerMeter: number | null;
    constructor(terminals: Map<string, GraphTerminal>, adjacency: Map<string, GraphEdge[]>, readonly weights: RoutingWeights) { this.terminals = terminals; this.adjacency = adjacency; this.index = new SpatialIndex(weights.gridCellDegrees, terminals.values()); let min = weights.alpha / weights.maximumTransitSpeedMetersPerMinute; for (const edges of adjacency.values())
        for (const e of edges) {
            const m = haversineMeters(terminals.get(e.from)!, terminals.get(e.to)!);
            if (m > 0)
                min = Math.min(min, e.cost / m);
        } this.costPerMeter = Number.isFinite(min) && min > 0 ? min : null; }
    nearest(p: Coordinates, radius: number) { return this.index.within(p, radius); }
    heuristic(from: Coordinates, destination: Coordinates) { return this.costPerMeter === null ? 0 : haversineMeters(from, destination) * this.costPerMeter; }
    get canUseAStar() { return this.costPerMeter !== null; }
}
export function buildGraph(rawTerminals: readonly RawTerminal[], rawThreads: readonly RawThread[], overrides: Partial<RoutingWeights> = {}): TransportGraph {
    const weights: RoutingWeights = Object.freeze({ ...DEFAULT_ROUTING_WEIGHTS, ...overrides });
    for (const [k, v] of Object.entries(weights))
        finite(v, `weights.${k}`);
    if (weights.epsilon <= 0 || weights.walkRadiusMeters <= 0 || weights.closeTerminalMeters <= 0 || weights.walkingSpeedMetersPerMinute <= 0 || weights.maximumTransitSpeedMetersPerMinute <= 0 || weights.gridCellDegrees <= 0 || weights.maxSettledNodes <= 0 || weights.maxQueueEntries <= 0)
        throw new RangeError('Routing weights must be positive.');
    const terminals = new Map<string, GraphTerminal>();
    for (const t of rawTerminals) {
        validPoint(t, `terminal ${t.id}`);
        finite(t.netVotes, `terminal ${t.id}.netVotes`);
        if (!t.id)
            throw new TypeError('Terminal ID is required.');
        if (t.netVotes < -3)
            continue;
        if (terminals.has(t.id))
            throw new TypeError(`Duplicate terminal ID: ${t.id}`);
        terminals.set(t.id, Object.freeze({ ...t }));
    }
    const adjacency = new Map<string, GraphEdge[]>();
    for (const id of terminals.keys())
        adjacency.set(id, []);
    const direct = new Set<string>();
    for (const t of rawThreads) {
        const from = terminals.get(t.originTerminalId), to = terminals.get(t.destinationTerminalId);
        if (!from || !to || t.netVotes < -3 || !t.id || t.originTerminalId === t.destinationTerminalId)
            continue;
        finite(t.estimatedFare, `thread ${t.id}.estimatedFare`);
        if (t.estimatedFare < 0)
            throw new RangeError(`Thread ${t.id} has a negative fare.`);
        adjacency.get(from.id)!.push(Object.freeze({ id: t.id, from: from.id, to: to.id, kind: 'ride', cost: trustWeightedCost(t, weights) + (from.mode === to.mode ? 0 : weights.modeTransferPenalty), durationMinutes: t.durationMinutes, estimatedFare: t.estimatedFare, walkabilityScore: t.walkabilityScore, modeFrom: from.mode, modeTo: to.mode, sourceThreadId: t.id }));
        direct.add(`${from.id}|${to.id}`);
    }
    const index = new SpatialIndex(weights.gridCellDegrees, terminals.values());
    for (const t of terminals.values())
        for (const nearby of index.within(t, weights.closeTerminalMeters))
            if (nearby.terminal.id !== t.id && !direct.has(`${t.id}|${nearby.terminal.id}`))
                adjacency.get(t.id)!.push(Object.freeze({ id: `walk:${t.id}:${nearby.terminal.id}`, from: t.id, to: nearby.terminal.id, kind: 'transfer_walk', cost: walkingCost(nearby.distanceMeters, weights, true), durationMinutes: nearby.distanceMeters / weights.walkingSpeedMetersPerMinute, estimatedFare: 0, walkabilityScore: weights.walkingSafetyScore, modeFrom: t.mode, modeTo: nearby.terminal.mode }));
    for (const edges of adjacency.values())
        edges.sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id));
    return new TransportGraph(terminals, adjacency, weights);
}
class Heap<T> {
    private readonly values: Array<{
        p: number;
        v: T;
    }> = [];
    push(p: number, v: T) { this.values.push({ p, v }); for (let i = this.values.length - 1; i > 0;) {
        const parent = (i - 1) >>> 1;
        if (this.values[parent]!.p <= p)
            break;
        [this.values[parent], this.values[i]] = [this.values[i]!, this.values[parent]!];
        i = parent;
    } }
    pop() { const first = this.values[0], last = this.values.pop(); if (!first)
        return; if (last && this.values.length) {
        this.values[0] = last;
        for (let i = 0;;) {
            const l = i * 2 + 1, r = l + 1;
            let n = i;
            if (l < this.values.length && this.values[l]!.p < this.values[n]!.p)
                n = l;
            if (r < this.values.length && this.values[r]!.p < this.values[n]!.p)
                n = r;
            if (n === i)
                break;
            [this.values[i], this.values[n]] = [this.values[n]!, this.values[i]!];
            i = n;
        }
    } return first; }
    get size() { return this.values.length; }
}
export function solveRoute(graph: TransportGraph, origin: Coordinates, destination: Coordinates): RouteResult {
    validPoint(origin, 'origin');
    validPoint(destination, 'destination');
    const entrances = graph.nearest(origin, graph.weights.walkRadiusMeters), exits = graph.nearest(destination, graph.weights.walkRadiusMeters);
    if (!entrances.length || !exits.length)
        throw new PathNotFoundError({ originCandidateCount: entrances.length, destinationCandidateCount: exits.length });
    const exitById = new Map(exits.map(({ terminal, distanceMeters }) => [terminal.id, distanceMeters])), distance = new Map<string, number>(), previous = new Map<string, GraphEdge>(), queue = new Heap<string>();
    for (const { terminal, distanceMeters } of entrances) {
        const cost = walkingCost(distanceMeters, graph.weights, false);
        if (cost < (distance.get(terminal.id) ?? Infinity)) {
            distance.set(terminal.id, cost);
            queue.push(cost + graph.heuristic(terminal, destination), terminal.id);
        }
    }
    let settledNodes = 0, winner: string | undefined, winnerCost = Infinity;
    while (queue.size) {
        if (queue.size > graph.weights.maxQueueEntries)
            throw new SearchLimitError('Routing queue limit exceeded.');
        const current = queue.pop()!, terminal = graph.terminals.get(current.v)!, cost = distance.get(current.v)!;
        if (current.p !== cost + graph.heuristic(terminal, destination))
            continue;
        if (current.p >= winnerCost)
            break;
        if (++settledNodes > graph.weights.maxSettledNodes)
            throw new SearchLimitError('Routing node limit exceeded.');
        const exitDistance = exitById.get(current.v);
        if (exitDistance !== undefined) {
            const completed = cost + walkingCost(exitDistance, graph.weights, false);
            if (completed < winnerCost) {
                winner = current.v;
                winnerCost = completed;
            }
        }
        for (const e of graph.adjacency.get(current.v) ?? []) {
            const candidate = cost + e.cost;
            if (candidate < (distance.get(e.to) ?? Infinity)) {
                distance.set(e.to, candidate);
                previous.set(e.to, e);
                queue.push(candidate + graph.heuristic(graph.terminals.get(e.to)!, destination), e.to);
            }
        }
    }
    if (!winner) {
        let closest: {
            id: string;
            meters: number;
        } | undefined;
        for (const id of distance.keys()) {
            const meters = haversineMeters(graph.terminals.get(id)!, destination);
            if (!closest || meters < closest.meters)
                closest = { id, meters };
        }
        throw new PathNotFoundError(closest ? { originCandidateCount: entrances.length, destinationCandidateCount: exits.length, closestReachableTerminalId: closest.id, closestReachableTerminalDistanceMeters: closest.meters } : { originCandidateCount: entrances.length, destinationCandidateCount: exits.length });
    }
    const edges: GraphEdge[] = [];
    for (let id = winner; previous.has(id);) {
        const e = previous.get(id)!;
        edges.unshift(e);
        id = e.from;
    }
    const first = graph.terminals.get(edges[0]?.from ?? winner)!, last = graph.terminals.get(winner)!, entranceMeters = haversineMeters(origin, first), exitMeters = haversineMeters(last, destination);
    return Object.freeze({ totalCost: winnerCost, totalDurationMinutes: entranceMeters / graph.weights.walkingSpeedMetersPerMinute + edges.reduce((n, e) => n + e.durationMinutes, 0) + exitMeters / graph.weights.walkingSpeedMetersPerMinute, totalFare: edges.reduce((n, e) => n + e.estimatedFare, 0), entrance: { kind: 'entrance_walk' as const, from: origin, to: first, terminalId: first.id, distanceMeters: entranceMeters, durationMinutes: entranceMeters / graph.weights.walkingSpeedMetersPerMinute, cost: walkingCost(entranceMeters, graph.weights, false) }, edges, exit: { kind: 'exit_walk' as const, from: last, to: destination, terminalId: last.id, distanceMeters: exitMeters, durationMinutes: exitMeters / graph.weights.walkingSpeedMetersPerMinute, cost: walkingCost(exitMeters, graph.weights, false) }, settledNodes, usedAStar: graph.canUseAStar });
}
