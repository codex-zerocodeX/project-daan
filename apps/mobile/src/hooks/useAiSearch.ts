import { useMutation } from "@tanstack/react-query";
import type { AiSearchResponse, AiSearchTurn } from "@komyut/shared";
import { apiPost } from "../lib/api";

export type AiSearchInput = { query: string; history: AiSearchTurn[] };

/**
 * Ask the AI a question about existing threads. A mutation, not a query: it
 * fires on submit rather than on render, and nothing caches or refetches.
 */
export function useAiSearch() {
  return useMutation({
    mutationFn: ({ query, history }: AiSearchInput) =>
      apiPost<AiSearchResponse>("/v1/ai/search", { query, history }),
  });
}
