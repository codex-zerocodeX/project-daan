import { useQuery } from "@tanstack/react-query";
import type { ComposeResponse, LatLng } from "@komyut/shared";
import { ApiError, apiPost } from "../lib/api";

type ComposedRoute = ComposeResponse["route"];

/** The API says "I looked, and no route can be stitched" with a 422. */
const NO_ROUTE_STATUS = 422;

/**
 * Fallback for when thread search returns nothing: a route stitched together
 * from the nodes of other threads' answers.
 *
 * Resolves to `null` - not an error - when the API answers 422, which means no
 * route could be composed. That is an expected product outcome the UI renders
 * as an empty state, so it must not surface as a failure and must not be
 * retried. Every other non-2xx stays a real error.
 *
 * Disabled unless both endpoints are known and `enabled !== false`, since the
 * UI only runs this after thread search has come back empty.
 */
export function useComposeRoute(origin: LatLng | null, destination: LatLng | null, enabled = true) {
  const hasCoords = origin !== null && destination !== null;

  return useQuery<ComposedRoute | null>({
    queryKey: [
      "compose-route",
      origin?.lat ?? null,
      origin?.lng ?? null,
      destination?.lat ?? null,
      destination?.lng ?? null,
    ],
    enabled: hasCoords && enabled !== false,
    queryFn: async () => {
      try {
        const res = await apiPost<ComposeResponse>("/v1/routes/compose", {
          origin,
          destination,
        });
        return res.route;
      } catch (err) {
        if (err instanceof ApiError && err.status === NO_ROUTE_STATUS) {
          return null;
        }
        throw err;
      }
    },
    // A 422 never reaches here (it resolves to null above); this guards the
    // remaining client errors, which retrying cannot fix.
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
