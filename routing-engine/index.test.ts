import assert from 'node:assert/strict';
import test from 'node:test';
import { buildGraph, PathNotFoundError, SearchLimitError, solveRoute, trustWeightedCost } from './index.js';
const terminal = (id: string, longitude: number, mode: 'jeepney' | 'tricycle' = 'jeepney', netVotes = 0) => ({ id, latitude: 14.6, longitude, mode, netVotes });
const thread = (id: string, from: string, to: string, minutes: number, netVotes = 0) => ({ id, originTerminalId: from, destinationTerminalId: to, durationMinutes: minutes, estimatedFare: 12, walkabilityScore: 80, netVotes });
test('positive trust cost can prefer a trusted connected community path', () => {
    const graph = buildGraph([terminal('a', 121), terminal('b', 121.002), terminal('c', 121.004)], [thread('direct', 'a', 'c', 10), thread('ab', 'a', 'b', 6, 50), thread('bc', 'b', 'c', 6, 50)]);
    assert.ok(trustWeightedCost(thread('positive', 'a', 'b', 1, 500)) >= .01);
    assert.deepEqual(solveRoute(graph, terminal('origin', 121), terminal('destination', 121.004)).edges.map((edge) => edge.id), ['ab', 'bc']);
});
test('adds bidirectional local transfer seams and walks to arbitrary coordinates', () => {
    const graph = buildGraph([terminal('a', 121), terminal('b', 121.001, 'tricycle'), terminal('c', 121.004)], [thread('bc', 'b', 'c', 2)]);
    assert.equal(graph.adjacency.get('a')?.some((edge) => edge.kind === 'transfer_walk' && edge.to === 'b'), true);
    const route = solveRoute(graph, { latitude: 14.6, longitude: 121.0002 }, { latitude: 14.6, longitude: 121.0038 });
    assert.equal(route.entrance.kind, 'entrance_walk');
    assert.equal(route.exit.kind, 'exit_walk');
    const direct = buildGraph([terminal('a', 121), terminal('b', 121.001)], [thread('ab', 'a', 'b', 2)]);
    assert.equal(direct.adjacency.get('a')?.some((edge) => edge.kind === 'transfer_walk'), false);
});
test('prunes untrusted data and returns typed failures', () => {
    const graph = buildGraph([terminal('a', 121), terminal('b', 121.01)], [thread('bad', 'a', 'b', 1, -4)]);
    assert.equal(graph.adjacency.get('a')?.length, 0);
    assert.throws(() => solveRoute(graph, terminal('origin', 121), terminal('destination', 121.01)), PathNotFoundError);
    const limited = buildGraph([terminal('a', 121), terminal('b', 121.002)], [thread('ab', 'a', 'b', 1)], { maxSettledNodes: 1 });
    assert.throws(() => solveRoute(limited, terminal('origin', 121), terminal('destination', 121.002)), SearchLimitError);
});
test('handles a deterministic 10,000-terminal / 50,000-edge graph within the routing budget', () => {
    const terminals = Array.from({ length: 10000 }, (_, index) => ({ id: `t${index}`, latitude: 10 + Math.floor(index / 100) * .01, longitude: 120 + (index % 100) * .01, mode: 'jeepney' as const, netVotes: 0 }));
    const threads = Array.from({ length: 50000 }, (_, index) => thread(`e${index}`, `t${index % 9999}`, `t${(index % 9999) + 1}`, 1));
    const started = performance.now();
    const graph = buildGraph(terminals, threads);
    const route = solveRoute(graph, terminals[0]!, terminals[9999]!);
    assert.ok(route.edges.length > 0);
    assert.ok(performance.now() - started < 5000);
});
