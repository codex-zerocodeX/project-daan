# Design — Threads → Nodes, Karma, Route Composition (prototype)

Bare-minimum backend for the community-route features. Reuses everything the
initial schema already ships (`profiles.karma`, `threads`, `votes`, `comments`,
`thread-images` bucket, RLS, signup trigger). CRUD stays mobile → Supabase under
RLS; the Hono API owns only algorithm-shaped logic.

## Data model (additions)

An **answer** to a thread is a **route**: an ordered set of **nodes** (map points
= the step-by-step directions). A thread can have several competing answer-routes.
Routes are votable; votes drive karma.

Migration `0002_routes_nodes_karma.sql`:

- `routes` — `(id uuid pk, thread_id → threads, author_id → profiles, summary text,
  created_at)`. One answer-route.
- `nodes` — `(id uuid pk, route_id → routes, seq int, lat double, lng double,
  label text, image_url text, geom geometry(Point,4326) generated from lng/lat,
  created_at)`, `unique(route_id, seq)`, GiST index on `geom`. Node images reuse
  the existing public `thread-images` bucket.
- `route_votes` — `(route_id → routes, user_id → profiles, value smallint ∈ {-1,1},
  created_at, pk(route_id,user_id))`.
- **Karma**: `recompute_karma(target uuid)` sets `profiles.karma` = net votes on the
  user's threads + net votes on the user's routes. `AFTER` triggers on `votes` and
  `route_votes` call it for the affected author. Karma is derived, never hand-set.
- RLS: public read on `routes`/`nodes`/`route_votes`; authenticated users write only
  their own rows (nodes gate on owning the parent route).

## Shared contracts (`@komyut/shared`)

`RouteSchema`, `NodeSchema`, `RouteVoteSchema`, `ComposeRequestSchema`
(`{origin, destination}` via `LatLngSchema`), `ComposeResponseSchema`
(a GeoJSON `Feature<LineString>` whose properties carry `existing`, `distance_m`,
`thread_ids`, `route_ids`, `steps[]`, `summary`).

## Route-composition algorithm

`POST /v1/routes/compose` (new; existing `/plan` mock untouched):

1. Load all nodes across all routes (with each node's `route_id` + parent
   `thread_id`/`author_id`).
2. **Existing-route shortcut** — if one route already has a node near the origin and
   a later node near the destination, return that route's node chain (`existing:true`).
3. Otherwise build a graph: edges between consecutive nodes within a route, plus
   cross-route edges between any two nodes within ~150 m (the stitch points). Add
   virtual origin/destination vertices snapped to nearby nodes (~300 m). Edge weight =
   haversine metres.
4. Dijkstra origin → destination. Return the stitched node sequence as a new
   `Feature<LineString>` with the contributing thread/route ids (`existing:false`).
5. No path → `422 {error:"No route could be composed"}`.

The graph/Dijkstra live in a **pure function** (`src/lib/composeAlgorithm.ts` +
`src/lib/geo.ts`) so they unit-test without Supabase. The handler
(`routes/compose.ts`) only fetches nodes, calls the function, and validates output.

## Testing (TDD, vitest)

- `composeAlgorithm.test.ts` — pure: existing-route hit, cross-route stitch, unroutable.
- `compose.test.ts` — endpoint: 200 stitched route, 400 bad body, 422 unroutable,
  500 on Supabase error, using a `fakeSupabase` that resolves `.select()`.

## Out of scope (prototype)

Real OSM/weather evidence, coverage scoring, the receipt/GPT layer, transit legs,
pagination, and any mobile UI. CRUD endpoints (create thread/route/node/vote) are
not added — mobile writes them directly under RLS.
