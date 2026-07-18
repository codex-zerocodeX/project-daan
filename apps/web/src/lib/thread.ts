import { tokenize } from "./similarity";
import type { Review, ReviewSummary, RouteThread } from "./type";

function roundedAverage(value: number) {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

export function resolveThread(routeId: string, nodeId: string[], thread: RouteThread[]) {
  const routeNodeId = new Set(nodeId);
  return thread.filter((item) => item.routeId === routeId && item.nodeId.every((itemNodeId) => routeNodeId.has(itemNodeId)));
}

export function reviewForTarget(target: Review["target"], targetId: string, review: Review[]) {
  return review
    .filter((item) => item.target === target && item.targetId === targetId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || left.reviewId.localeCompare(right.reviewId));
}

export function summarizeReview(target: Review["target"], targetId: string, review: Review[]): ReviewSummary {
  const scoped = reviewForTarget(target, targetId, review);
  const rating = [5, 4, 3, 2, 1].map((value) => ({
    value,
    count: scoped.filter((item) => item.rating === value).length,
  }));
  const frequency = new Map<string, number>();
  for (const item of scoped) {
    for (const term of new Set(tokenize(item.body))) frequency.set(term, (frequency.get(term) ?? 0) + 1);
  }
  const theme = [...frequency.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 3)
    .map(([term]) => term);

  return {
    reviewCount: scoped.length,
    ratingAverage: scoped.length === 0 ? null : roundedAverage(scoped.reduce((sum, item) => sum + item.rating, 0) / scoped.length),
    rating,
    theme,
  };
}
