# Project Daan — platform roadmap (v1, July 18)

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
| **M1 How Walkable?** | Route walkability receipt (weather + infrastructure + distance) | OSM/Overpass, Open-Meteo | **Building today — the spine, never cut** ([prd.md](prd.md)) | Submitted + 3/3 rehearsal |
| **M2 Report + Karma** | Community confirms/disputes evidence ("sidewalk blocked here"); karma = contributor credibility weighting only — no tokens, no cash | Community report (Supabase `report` table, seeded; F13–F17 in prd.md), displayed as *reported* distinct from *official* | **Building today — third to amputate** | Working on deployed URL by 2:00 PM. Post-event scale gate: 20 recurring unpaid contributors + written abuse review (fake report, location spoof) |
| **M3 Line & Bottleneck Tracker** | Queue/line/bottleneck state — implemented as a report `kind`, not a separate system | M2 report stream (`kind: "queue"`) | **Building today — second to amputate** | Working on deployed URL by 2:00 PM; requires M2 alive |
| **M4 Miles** | v0: opt-in client-side walk counter (localStorage, no server, no location history). Partner rewards (toll/San Miguel "flight miles") remain the post-event extension | Completed scored route, client-only | **Building today — first to amputate** | Working by 2:00 PM. Partner-reward extension still gated on a signed partner + privacy audit |
| **M5 Traffic Intelligence** | Route-condition prediction; collaborate with, not fight, Grab/Waze | Partner feed or public MMDA data — NEVER scraped/predicted from Google Maps output (license kill-switch stands, and "predicting Google's algorithm" from its responses violates the same terms) | Slide only today | A lawful data source that isn't a competitor's protected output |

Module numbering is priority order and the reverse of the amputation order. M3 is M2's data worn a different way. The 2:00 PM amputation checkpoint belongs to the integrator alone — no meeting.

## Tech scope (decided July 18)

| Layer | Now (web) | Later (mobile) |
|---|---|---|
| Map canvas | **MapLibre GL JS** — open-source, no Google dependency, vector tiles. Style/tiles: OpenFreeMap (keyless) or MapTiler free tier; raster OSM tiles as zero-dependency fallback | **@maplibre/maplibre-react-native** — same style JSON, same source/layer definitions reuse across web and native |
| App shell | React + Vite (today's build) | **React Native (Expo)** — new surface, same platform |
| Shared core | `daan-core`: scoring, receipt type, evidence contract as a plain TypeScript package — UI-free so web and RN both import it | same package |
| API | Stateless route endpoint ([prd.md](prd.md)); modules add collectors behind the same receipt shape | same API |
| Naming | Singular everywhere (`segment`, `evidence`, `module`) | same |

Migration note: the UI prompt's map component targets MapLibre GL JS. Leaflet references are superseded. MapLibre gives the RN path for free; Leaflet does not.

## Sequencing

- **Today, 3:00 PM** — Platform v0: M1 spine live end to end; M2 live report → receipt merge with karma weighting; M3 as queue-report kind; M4 client-side miles — each surviving the 2:00 amputation checkpoint. M5 as one honest slide. Vision sentence below.
- **Weeks 1–4** — Harden M1 (geocoding, any-route, Mapillary evidence, route alternatives). Extract `daan-core`. Write the M2 abuse review (fake report, location spoof, brigading) before promoting reports beyond demo scale. Gate: 50 organic route checks by strangers.
- **Months 2–3** — M2/M3 to real community scale behind the abuse review. Expo RN shell begins, reusing `daan-core` + MapLibre style. The flywheel: receipts attract users, users contribute evidence, evidence improves receipts.
- **Months 6+** — M4 partner rewards / M5 only on signed partner / lawful feed. LGU dashboard (worst school routes, before/after sidewalk receipts) as the institutional surface.

## Out of scope at every phase

Scraping or reverse-engineering Google/Waze/Grab output (both a license kill and hostile to the "we don't want to be enemies" stance — partnership is the M5 path); ride-hailing; driver hardware; storing individual location history without opt-in and audit; cash-equivalent karma.

## Pitch vision sentence

> "Daan is one receipt engine with pluggable evidence. Today it's running with both official and community evidence: OpenStreetMap and live weather score the route, a report from this room — weighted by contributor karma — lands on the same receipt, and walking the route earns miles. The registry takes the next module without touching the engine. Working, end to end, built today."

If amputation collapses the build back to M1, fall back to the module-1 sentence: "How Walkable? is Daan's first module — the receipt engine behind it takes community reports, bottleneck state, and partner feeds next. Today: one module, fully working, end to end."
