// Free OSM raster tiles. Swap for a vector style URL later without touching screens.
export const OSM_RASTER_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [{ id: "osm", type: "raster" as const, source: "osm" }],
};

export const MANILA_CENTER: [number, number] = [121.0437, 14.5764];

// Example community route along EDSA split into segments, each carrying a
// walkability score (0-100). This is the pattern the "How walkable?" feature
// will drive with real data: one feature per segment, styled by its score.
export const EXAMPLE_ROUTE: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Ayala to Guadalupe", walkability: 85 },
      geometry: {
        type: "LineString",
        coordinates: [
          [121.0281, 14.5495],
          [121.0355, 14.5583],
          [121.045, 14.5665],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Guadalupe to Boni", walkability: 45 },
      geometry: {
        type: "LineString",
        coordinates: [
          [121.045, 14.5665],
          [121.0475, 14.5738],
          [121.0398, 14.5793],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Boni to Shaw", walkability: 15 },
      geometry: {
        type: "LineString",
        coordinates: [
          [121.0398, 14.5793],
          [121.0361, 14.5831],
          [121.0273, 14.5869],
        ],
      },
    },
  ],
};
