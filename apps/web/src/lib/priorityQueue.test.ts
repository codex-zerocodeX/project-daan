import { describe, expect, it } from "vitest";
import { MinPriorityQueue } from "./priorityQueue";

interface QueueValue {
  weightMinute: number;
  pathKey: string;
  nodeId: string;
}

function compareQueueValue(left: QueueValue, right: QueueValue) {
  return left.weightMinute - right.weightMinute
    || left.pathKey.localeCompare(right.pathKey)
    || left.nodeId.localeCompare(right.nodeId);
}

describe("MinPriorityQueue", () => {
  it("orders weight before the complete path key", () => {
    const queue = new MinPriorityQueue(compareQueueValue);
    queue.push({ weightMinute: 3, pathKey: "origin>z", nodeId: "z" });
    queue.push({ weightMinute: 1, pathKey: "origin>b", nodeId: "b" });
    queue.push({ weightMinute: 1, pathKey: "origin>a", nodeId: "a" });

    expect(queue.pop()?.nodeId).toBe("a");
    expect(queue.pop()?.nodeId).toBe("b");
    expect(queue.pop()?.nodeId).toBe("z");
    expect(queue.pop()).toBeUndefined();
  });

  it("supports interleaved push and pop operations", () => {
    const queue = new MinPriorityQueue(compareQueueValue);
    queue.push({ weightMinute: 4, pathKey: "origin>d", nodeId: "d" });
    queue.push({ weightMinute: 2, pathKey: "origin>b", nodeId: "b" });
    expect(queue.pop()?.nodeId).toBe("b");
    queue.push({ weightMinute: 1, pathKey: "origin>a", nodeId: "a" });
    expect(queue.size).toBe(2);
    expect(queue.pop()?.nodeId).toBe("a");
    expect(queue.pop()?.nodeId).toBe("d");
  });
});
