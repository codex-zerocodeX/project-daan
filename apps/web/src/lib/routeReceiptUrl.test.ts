import { describe, expect, it } from "vitest";
import {
  readDepartureTime,
  readRouteReceiptUrl,
  writeDepartureTime,
  writeRouteReceiptUrl,
} from "./routeReceiptUrl";

describe("route receipt URL", () => {
  it("defaults a missing departure time to 14:00", () => {
    expect(readDepartureTime(new URL("https://daan.test/route"))).toBe("14:00");
  });

  it.each(["06:00", "14:00"] as const)("reads the valid %s departure time", (departureTime) => {
    expect(readDepartureTime(new URL(`https://daan.test/route?departureTime=${departureTime}`))).toBe(departureTime);
  });

  it("defaults an invalid departure time to 14:00", () => {
    expect(readDepartureTime(new URL("https://daan.test/route?departureTime=midnight"))).toBe("14:00");
  });

  it("writes departure time without mutating the source URL or dropping receipt state", () => {
    const sourceUrl = new URL("https://daan.test/route?routeId=comfort&segmentId=covered#evidence");
    const nextUrl = writeDepartureTime(sourceUrl, "06:00");

    expect(nextUrl.toString()).toBe(
      "https://daan.test/route?routeId=comfort&segmentId=covered&departureTime=06%3A00#evidence",
    );
    expect(sourceUrl.toString()).toBe("https://daan.test/route?routeId=comfort&segmentId=covered#evidence");
  });

  it("rehydrates the original receipt after browser history returns to its URL", () => {
    const firstUrl = new URL(
      "https://daan.test/route?originNodeId=gate&destinationNodeId=station&departureTime=06%3A00&routeId=comfort",
    );
    const secondUrl = writeRouteReceiptUrl(firstUrl, {
      originNodeId: "campus",
      destinationNodeId: "mall",
      departureTime: "14:00",
    });

    expect(readRouteReceiptUrl(secondUrl)).toEqual({
      originNodeId: "campus",
      destinationNodeId: "mall",
      departureTime: "14:00",
    });
    expect(readRouteReceiptUrl(firstUrl)).toEqual({
      originNodeId: "gate",
      destinationNodeId: "station",
      departureTime: "06:00",
    });
    expect(firstUrl.searchParams.get("routeId")).toBe("comfort");
  });
});
