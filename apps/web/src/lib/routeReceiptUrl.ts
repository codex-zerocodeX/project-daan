import type { DepartureTime } from "./type";

const defaultDepartureTime: DepartureTime = "14:00";
const departureTimeValue = new Set<DepartureTime>(["06:00", "14:00"]);

export interface RouteReceiptUrlState {
  originNodeId: string | null;
  destinationNodeId: string | null;
  departureTime: DepartureTime;
}

export function readDepartureTime(input: URL | URLSearchParams): DepartureTime {
  const searchParameter = input instanceof URL ? input.searchParams : input;
  const value = searchParameter.get("departureTime");
  return value && departureTimeValue.has(value as DepartureTime)
    ? (value as DepartureTime)
    : defaultDepartureTime;
}

export function writeDepartureTime(url: URL, departureTime: DepartureTime): URL {
  const nextUrl = new URL(url.toString());
  nextUrl.searchParams.set("departureTime", departureTime);
  return nextUrl;
}

export function readRouteReceiptUrl(url: URL): RouteReceiptUrlState {
  return {
    originNodeId: url.searchParams.get("originNodeId"),
    destinationNodeId: url.searchParams.get("destinationNodeId"),
    departureTime: readDepartureTime(url),
  };
}

export function writeRouteReceiptUrl(url: URL, state: RouteReceiptUrlState): URL {
  const nextUrl = writeDepartureTime(url, state.departureTime);
  if (state.originNodeId) nextUrl.searchParams.set("originNodeId", state.originNodeId);
  else nextUrl.searchParams.delete("originNodeId");
  if (state.destinationNodeId) nextUrl.searchParams.set("destinationNodeId", state.destinationNodeId);
  else nextUrl.searchParams.delete("destinationNodeId");
  return nextUrl;
}
