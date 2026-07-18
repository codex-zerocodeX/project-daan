# Project Daan — platform roadmap (v1, July 18)

> **Historical naming note.** This July 2026 roadmap uses **Project Daan**, the internal codename at the time. The current product and codebase name is **Alitaptap**.

Team decision, event day: Daan is not a walkability app. It is a **modular commuter-intelligence platform**; "How Walkable?" is Module 1, the first live module. This file defines the platform architecture, the module registry, the tech scope, and the gate each module must pass to go live.

## Platform sentence

> **Project Daan is a modular commuter-intelligence platform for a car-dependent country: every module turns public or community evidence into a scored, auditable receipt about moving through the city — and admits what it doesn't know.**

Positioning: Google/Waze answer *how fast*. Daan answers *how humane* — and shows its work.

## The unifying architecture: the receipt engine IS the platform

What makes Daan modular rather than a feature grab-bag is one shared contract. Every module — present and future — implements the same pipeline:

```text
input (route / place / report)
        ↓
evidence collector (OSM, weather, community report, partner feed)
        ↓
deterministic scorer (code owns the number; weights visible)
        ↓
receipt (per-item evidence link + delta + unknown state)
        ↓
explanation (model narrates ONLY the evidence it is given)
```

The `evidence` object (kind, value, state, delta, source_url) defined in [prd.md](prd.md) is the platform-wide primitive. Karma is not a separate system — it is a **credibility weight on community-contributed evidence**. Traffic intelligence is not a separate app — it is a **new evidence collector** feeding the same receipt. This is the modularity story: one engine, pluggable evidence sources, pluggable surfaces.

## Module registry

| Module | What it is | Evidence source | Status | Gate |
|---|---|---|---|---|
| **M1 How Walkable?** | Route walkability receipt (weather + infrastructure + distance) | Current: local graph and disclosed fixture. Target: OSM/Overpass, Open-Meteo | **Fixture-bounded loop implemented** | Live-adapter benchmark, licensed source, field calibration, and 50 organic route checks |
| **M2 Report + Karma** | Community confirms/disputes evidence; karma is contributor credibility weighting only | Current: seeded fixture and localStorage. Target: shared report service | **Local interaction implemented; no cross-device sync** | Shared backend plus written abuse review covering fake report, location spoof, and brigading |
| **M3 Line & Bottleneck Tracker** | Queue/line/bottleneck state as a report `kind`, not a separate system | Seeded queue evidence | **Fixture only** | Live, recent, attributable report source and M2 production gate |
| **M4 Miles** | Opt-in client-side walk counter; partner reward is a later extension | Planned completed-route event | **Not shipped** | Privacy audit, completed-route truth, and signed partner before any reward claim |
| **M5 Traffic Intelligence** | Route-condition prediction; collaborate with, not fight, Grab/Waze | Partner feed or public MMDA data — NEVER scraped/predicted from Google Maps output (license kill-switch stands, and "predicting Google's algorithm" from its responses violates the same terms) | Slide only today | A lawful data source that isn't a competitor's protected output |

Module numbering preserves event-day priority. M3 remains M2's data worn a different way.

The runnable checkout does not have live geocoding/routing/weather, a shared Supabase backend, GPT explanation, Miles, or partner traffic intelligence. Judge-facing copy must use this boundary; see [README.md](README.md) and [pitch.md](pitch.md).

## Tech scope (decided July 18)

| Layer | Now (web) | Later (mobile) |
|---|---|---|
| Map canvas | **MapLibre GL JS** — open-source, no Google dependency, vector tiles. Style/tiles: OpenFreeMap (keyless) or MapTiler free tier; raster OSM tiles as zero-dependency fallback | **@maplibre/maplibre-react-native** — same style JSON, same source/layer definitions reuse across web and native |
| App shell | React + Vite (today's build) | **React Native (Expo)** — new surface, same platform |
| Shared core | Current `src/lib/` TypeScript functions; `daan-core` extraction is planned | Extracted UI-free package |
| API | No current application API; fixture/localStorage repository behind local contracts | Stateless route and report adapter behind the same receipt shape |
| Naming | Singular everywhere (`segment`, `evidence`, `module`) | same |

Migration note: the UI prompt's map component targets MapLibre GL JS. Leaflet references are superseded. MapLibre gives the RN path for free; Leaflet does not.

Routing decision: the current fixture uses heap-backed Dijkstra with separate `shortest_time` and `comfort_balance` profiles. MapLibre only renders the resulting GeoJSON. The production recommendation is Valhalla behind the stateless route API, gated by a Metro Manila extract benchmark; see [routing architecture](../routing-architecture.md).

## Sequencing

- **Event-day outcome** — Fixture-bounded M1 route/profile/receipt loop and local M2 community interaction implemented. The web receipt restores origin, destination, departure time, selected evidence, and opened community context from its URL; stale draft input is invalidated, render failure has a bounded fallback, and the phone route flow is repeatable through `script/route-flow.mjs`. Supabase-backed API seams and an optional server-side AI explanation endpoint exist in the monorepo but are not integrated into the judging web experience. Live adapters, shared report sync, Miles, and M5 remain outside the judging claim.
- **Weeks 1–4** — Harden M1 (geocoding, any-route, Mapillary evidence, route alternatives). Extract `daan-core`. Write the M2 abuse review (fake report, location spoof, brigading) before promoting reports beyond demo scale. Gate: 50 organic route checks by strangers.
- **Months 2–3** — M2/M3 to real community scale behind the abuse review. Expo RN shell begins, reusing `daan-core` + MapLibre style. The flywheel: receipts attract users, users contribute evidence, evidence improves receipts.
- **Months 6+** — M4 partner rewards / M5 only on signed partner / lawful feed. LGU dashboard (worst school routes, before/after sidewalk receipts) as the institutional surface.

## Out of scope at every phase

Scraping or reverse-engineering Google/Waze/Grab output (both a license kill and hostile to the "we don't want to be enemies" stance — partnership is the M5 path); ride-hailing; driver hardware; storing individual location history without opt-in and audit; cash-equivalent karma.

## Pitch vision sentence

> "Daan helps a commuter decide whether a walk is reasonable, not merely how long it takes. Today the complete decision loop runs on a disclosed Katipunan fixture: compare a route, inspect the score and every segment, see what is known and unknown, and attach local commuter context to that exact path. The next gate is replacing each fixture adapter with licensed live data without changing the receipt contract."

This sentence deliberately claims a working interaction contract, not live citywide evidence, institutional traction, or a production data pipeline.
