import { useMutation } from "@tanstack/react-query";
import type { AiSearchResponse } from "@komyut/shared";
import { apiPost } from "../lib/api";

/**
 * Ask the AI a question about existing threads. A mutation, not a query: it
 * fires on submit rather than on render, and nothing caches or refetches.
 */
export function useAiSearch() {
  return useMutation({
    mutationFn: (query: string) =>
      apiPost<AiSearchResponse>("/v1/ai/search", { query }),
  });
}
