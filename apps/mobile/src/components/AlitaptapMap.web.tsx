// Web implementation of AlitaptapMap. The native @maplibre/maplibre-react-native
// module ships no web build, so the browser renders with maplibre-gl directly —
// same OSM raster style and walkability-colored route line as native. Metro
// resolves this file instead of AlitaptapMap.tsx on web builds.
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { EXAMPLE_ROUTE, MANILA_CENTER, OSM_RASTER_STYLE } from "../lib/mapStyle";

export function AlitaptapMap() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const map = new maplibregl.Map({
      container: container.current,
      style: OSM_RASTER_STYLE as unknown as maplibregl.StyleSpecification,
      center: MANILA_CENTER,
      zoom: 11,
    });
    map.on("load", () => {
      map.addSource("example-route", { type: "geojson", data: EXAMPLE_ROUTE });
      map.addLayer({
        id: "example-route-line",
        type: "line",
        source: "example-route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-width": 4,
          "line-color": [
            "interpolate",
            ["linear"],
            ["get", "walkability"],
            0,
            "#d73027",
            50,
            "#fee08b",
            100,
            "#1a9850",
          ],
        },
      });
    });
    return () => map.remove();
  }, []);

  return (
    <div
      ref={container}
      style={{ flex: 1, width: "100%", height: "100%", minHeight: 0 }}
    />
  );
}
