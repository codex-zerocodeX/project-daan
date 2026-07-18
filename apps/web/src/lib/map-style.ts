export const mapStyleUrl = "https://tiles.openfreemap.org/styles/liberty";

export const routeSourceId = "daan-route";
export const nodeSourceId = "daan-node";
export const routeLayerId = "daan-route-line";
export const nodeHaloLayerId = "daan-node-halo";
export const nodeLayerId = "daan-node-point";

export const emptyFeatureCollection = {
  type: "FeatureCollection" as const,
  features: [],
};

export const routeLineLayer = {
  id: routeLayerId,
  type: "line" as const,
  source: routeSourceId,
  layout: {
    "line-cap": "round" as const,
    "line-join": "round" as const,
  },
  paint: {
    "line-color": [
      "step",
      ["get", "score"],
      "#cf3f28",
      30,
      "#df6434",
      50,
      "#b78008",
      70,
      "#197a68",
    ],
    "line-width": ["interpolate", ["linear"], ["zoom"], 12, 5, 16, 9],
    "line-opacity": 0.94,
  },
};

export const nodeHaloLayer = {
  id: nodeHaloLayerId,
  type: "circle" as const,
  source: nodeSourceId,
  filter: ["==", ["get", "isSelected"], true],
  paint: {
    "circle-radius": 14,
    "circle-color": "#fffdf8",
    "circle-stroke-color": "#082237",
    "circle-stroke-width": 3,
  },
};

export const nodePointLayer = {
  id: nodeLayerId,
  type: "circle" as const,
  source: nodeSourceId,
  paint: {
    "circle-radius": ["case", ["get", "isOnRoute"], 7, 5],
    "circle-color": ["case", ["get", "isOnRoute"], "#082237", "#fffdf8"],
    "circle-stroke-color": "#082237",
    "circle-stroke-width": 2,
  },
};
