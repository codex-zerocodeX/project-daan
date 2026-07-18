import type { Review, ReviewMatch } from "./type";

const stopword = new Set(["a", "an", "and", "are", "at", "but", "for", "from", "in", "is", "it", "of", "on", "the", "this", "to", "was", "with"]);

export function tokenize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
    .match(/[a-z0-9]+/g)
    ?.filter((term) => term.length > 1 && !stopword.has(term)) ?? [];
}

function termFrequency(value: string) {
  const frequency = new Map<string, number>();
  for (const term of tokenize(value)) frequency.set(term, (frequency.get(term) ?? 0) + 1);
  return frequency;
}

export function cosineSimilarity(left: string, right: string) {
  const leftFrequency = termFrequency(left);
  const rightFrequency = termFrequency(right);
  if (leftFrequency.size === 0 || rightFrequency.size === 0) return 0;
  const term = new Set([...leftFrequency.keys(), ...rightFrequency.keys()]);
  let dot = 0;
  let leftLength = 0;
  let rightLength = 0;
  for (const item of term) {
    const leftValue = leftFrequency.get(item) ?? 0;
    const rightValue = rightFrequency.get(item) ?? 0;
    dot += leftValue * rightValue;
    leftLength += leftValue * leftValue;
    rightLength += rightValue * rightValue;
  }
  return dot / (Math.sqrt(leftLength) * Math.sqrt(rightLength));
}

export function matchReview(query: string, review: Review[], threshold = 0.35): ReviewMatch[] {
  return review
    .map((item) => ({ review: item, similarity: cosineSimilarity(query, item.body) }))
    .filter((item) => item.similarity >= threshold)
    .sort((left, right) => right.similarity - left.similarity || left.review.reviewId.localeCompare(right.review.reviewId));
}
