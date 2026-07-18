import { useQuery } from "@tanstack/react-query";
import type { LatLng, ThreadSearchResponse, ThreadSearchResult } from "@komyut/shared";
import { apiPost } from "../lib/api";

/**
 * Community threads relevant to an origin -> destination trip. This is the
 * primary step of the search flow; an empty array is a normal result and means
 * the caller should fall back to `useComposeRoute`.
 *
 * Disabled until both endpoints are known.
 */
export function useThreadSearch(origin: LatLng | null, destination: LatLng | null) {
  const enabled = origin !== null && destination !== null;

  return useQuery<ThreadSearchResult[]>({
    queryKey: [
      "thread-search",
      origin?.lat ?? null,
      origin?.lng ?? null,
      destination?.lat ?? null,
      destination?.lng ?? null,
    ],
    enabled,
    queryFn: async () => {
      const res = await apiPost<ThreadSearchResponse>("/v1/threads/search", {
        origin,
        destination,
      });
      return res.results;
    },
  });
}
