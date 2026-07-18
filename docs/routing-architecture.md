# Routing architecture — Alitaptap

Status: accepted v0 decision, July 18, 2026.

## Decision

Alitaptap uses two separate layers:

1. A routing engine chooses a valid path through a pedestrian graph.
2. MapLibre renders the returned geometry and evidence as GeoJSON.

MapLibre is not the routing engine. Its `GeoJSONSource.setData` API updates route geometry and rerenders the map, which is exactly the boundary Alitaptap already uses. The renderer does not need to know whether a path came from the local fixture, Valhalla, GraphHopper, or OSRM. [MapLibre GeoJSON source](https://maplibre.org/maplibre-gl-js/docs/API/classes/GeoJSONSource/)

For the current nine-node fixture, Alitaptap uses deterministic Dijkstra with a binary min-heap. For production OSM routing, the preferred backend is **Valhalla behind a stateless Alitaptap API**. GraphHopper is the runner-up. OSRM remains a strong option when fastest-path throughput and stable preprocessed profiles matter more than request-time walkability customization.

## What v0 computes

The route chooser runs two independent profiles:

| Profile | Generalized edge weight | User-facing meaning |
|---|---|---|
| `shortest_time` | `cost_minute` | Lowest estimated walking time |
| `comfort_balance` | `cost_minute / max(score / 100, 0.25)` | A transparent balance that can trade extra time for higher-scoring walking conditions |

The comfort floor caps an edge penalty at four times its actual minutes. A score of 100 leaves its time unchanged. This is an Alitaptap v0 heuristic, not a calibrated safety model and not a Google, Waze, or GraphHopper algorithm. Actual `costMinute` and `distanceM` stay separate from the generalized search weight, so the UI never reports the optimization penalty as travel time.

On the current Ateneo Gate 3 → Katipunan LRT fixture, the profiles intentionally diverge:

| Choice | Actual time | Generalized comfort weight |
|---|---:|---:|
| Direct route | 14.9 min | 34.28 min |
| Side-street route | 18.9 min | 31.35 min |

The second choice is therefore labeled **Comfort balance**, never “calmest.” It still includes some lower-scoring edges and does not claim global comfort.

## Algorithm choice

### Now: heap-backed Dijkstra

Dijkstra is the right local baseline because all profile weights are nonnegative, the fixture graph is tiny, and the full edge cost is known only after applying the selected profile. A binary heap removes the old full-array sort at every pop while preserving the existing deterministic tie-break: generalized weight, then the complete path key, then node ID.

### Later, when the graph becomes real

- **A\*** becomes useful when Alitaptap owns a much larger spatial graph and can define an admissible geographic lower bound for each profile. It adds complexity without meaningful benefit on nine nodes.
- **Bidirectional search** helps on large point-to-point queries, but only after turn state and the cost model are defined consistently in both directions.
- **Turn-aware state** is required when crossing delay, turn restriction, stairs, curb transitions, or maneuver cost depends on the previous edge rather than the current edge alone.
- **Time-dependent cost** belongs in the backend when weather, closures, queue state, or lawful traffic feeds change edge cost by departure time. FIFO assumptions and fallback behavior must be explicit before shipping it.
- **Contraction hierarchy or multi-level partitioning** belongs to the production router. OSRM provides both CH and MLD and recommends MLD by default, while Valhalla uses a tiled hierarchy with dynamic runtime costing. [OSRM backend](https://github.com/Project-OSRM/osrm-backend) · [Valhalla dynamic costing](https://valhalla.github.io/valhalla/sif/dynamic-costing/)

The existing `alternativePath` helper remains a bounded fixture utility that removes one primary edge at a time. It is not presented as general k-shortest routing. When Alitaptap needs true loopless alternatives, implement bounded Yen search or use the production router's supported alternative-route response.

## Backend fit with MapLibre

| Engine | Verified capability | Fit for Alitaptap |
|---|---|---|
| **Valhalla** | Runtime dynamic costing, pedestrian options, alternate routes, OSRM-compatible response with `geojson` shape output; MIT engine license. [API reference](https://valhalla.github.io/valhalla/api/turn-by-turn/api-reference/) · [repository](https://github.com/valhalla/valhalla) | **Recommended production path.** Its runtime pedestrian costing aligns most closely with Alitaptap's evidence-driven profiles. |
| **GraphHopper** | Custom models can change speed, priority, and distance influence; supports route detail and alternatives; Apache-2.0 engine license. [Custom model](https://docs.graphhopper.com/openapi/custom-model/customizing-priority) · [repository](https://github.com/graphhopper/graphhopper) | Strong runner-up, especially if JSON custom models and a Java service are operationally preferable. |
| **OSRM** | Fast HTTP routing, foot profiles, alternatives, CH and MLD; profile behavior is prepared with the routing graph. [Profile documentation](https://project-osrm.org/docs/v26.4.0/profiles) · [API documentation](https://project-osrm.org/docs/) | Excellent for stable fastest-path service, but not the first choice for per-request Alitaptap comfort weighting. |

All three can return a polyline or coordinates that Alitaptap converts to one GeoJSON `FeatureCollection`. MapLibre's plugin catalog also lists directions controls, including clients for OSRM-compatible providers, but Alitaptap should keep its current source/layer contract because the receipt needs per-segment score and evidence properties. [MapLibre plugin catalog](https://maplibre.org/maplibre-gl-js/docs/plugins/)

## Google Maps and Waze lessons — behavior, not integration

Verified public behavior:

- Google Routes separates the default route, alternative routes, preference modifiers, and a differently optimized reference route. Avoidance modifiers are preferences, not guarantees. [Google Routes modifiers](https://developers.google.com/maps/documentation/routes/route-modifiers) · [Compute Routes](https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes)
- Google Maps can present a fastest route beside a fuel-efficient route and states the extra-time tradeoff. [Google eco-friendly routing](https://blog.google/company-news/inside-google/around-the-globe/google-europe/eco-friendly-routing-in-europe/)
- Waze ranks routes using restrictions, user preference, road type, ETA, length, and segment count, and labels alternatives so the user can understand why they were presented. [Waze route ranking](https://support.google.com/waze/answer/11942300?hl=en-GB)
- Waze explicitly explains that a longer route can be faster and lets the user compare alternatives. [Waze route comparison](https://support.google.com/waze/answer/10049876?hl=en)

Alitaptap inference:

- Treat hard pedestrian access and invalid evidence as constraints; treat comfort as a disclosed preference profile.
- Show the actual time tradeoff beside the comfort-balanced choice.
- Label the objective, not a marketing superlative: “Comfort balance” is honest; “best” or “calmest” is not.
- Recompute the route source, then let MapLibre rerender; do not put routing logic into map-layer code.

Project boundary: Alitaptap does not scrape, cache, derive from, reverse-engineer, or train on Google Maps, Street View, Waze, or Grab output. Their public product behavior informs interaction design only. The route graph and evidence remain based on sources Alitaptap is licensed to use.

## Source ledger

Verified:

- MapLibre accepts and updates GeoJSON independently of the routing provider.
- Valhalla supports dynamic runtime costing, pedestrian routing, alternatives, and GeoJSON-compatible response output.
- GraphHopper exposes transparent custom priority/speed/distance rules.
- OSRM exposes foot profiles and CH/MLD preparation pipelines.
- Google and Waze publicly expose multiple objectives, preferences, alternatives, and explanatory labels.

Inference:

- Valhalla is the best production fit for Alitaptap; this remains an engineering recommendation until a Metro Manila extract is benchmarked.
- The v0 comfort formula and 0.25 floor are product heuristics and require calibration with real pedestrian feedback.
- A\*, turn-aware state, time-dependent cost, and Yen alternatives are deferred until the graph/data justify them.

## Production gate

Do not replace the fixture router merely because Valhalla is recommended. Promote a backend only after one Metro Manila extract proves:

- pedestrian access and crossing behavior on the target corridor;
- request-time profile control or a documented recosting strategy;
- stable GeoJSON-to-receipt segment identity;
- latency and memory under the expected deployment budget;
- OSM attribution and ODbL obligations; and
- deterministic fixture fallback when the service is unavailable.
