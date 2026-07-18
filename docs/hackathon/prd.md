# PRD — Project Daan v0: platform build (event day, July 18 — revised scope)

Daan is a modular commuter-intelligence platform ([roadmap.md](roadmap.md)). Team decision (late morning, event day): v0 builds the **platform**, not one module — M1 Walkability as the anchor spine, M2 Report + Karma, M3 Bottleneck (a report kind), and M4 Miles, all riding one receipt engine and one `evidence` schema. M5 Traffic Intelligence stays a slide (no lawful data source today).

**Amputation order, decided now:** M4 dies first, then M3, then M2. M1 + the receipt engine are never cut. Anything not merged and working on the deployed URL by 2:00 PM is cut by the integrator without a meeting.

One-day scope. Judged on working build quality, usefulness, visible Codex impact. Submission cutoff 3:00 PM. This PRD encodes the verdicts of three convergent deep-research reports (July 18): no identical product found in bounded search; score must be road-class-first; PAGASA integration and all Google-derived data are killed.

## Problem

Moving through Metro Manila runs on missing information. The commuter deciding walk vs. ride has no tool that answers "how harsh is this route, right now?" — Sakay.ph routes transit and assumes walking legs are viable; Google gives time/distance with a beta warning that sidewalks may be missing; Walk Score rates addresses in the US/CA/AU. The knowledge that fills the gap is real but trapped: it lives in Reddit threads ("are there sidewalks? is it safe at 12mn? does it flood?" — r/HowToGetTherePH, cited in research), in commuters' heads, and nowhere structured. And the institutions that could fix the streets have no evidence trail showing which routes fail people, when, and why.

One problem, three faces: the individual lacks a trustworthy answer, the community lacks a place to bank what it knows, the city lacks receipts. Daan's receipt engine addresses all three with the same primitive: evidence in, deterministic score out, gaps disclosed.

## Who it's for (in selling order)

1. **Now — the Metro Manila commuter and student (free, B2C).** At the moment of deciding walk vs. ride: *"Before I commit to walking this route, tell me how harsh it will actually be — heat, rain, sidewalks, crossings — and show me the evidence, including what you don't know."* No signup, shareable link. This is who today's demo serves and who the judges are.
2. **Next — the community that already answers these questions for free.** r/HowToGetTherePH proves the contribution behavior exists; M2 gives it structure, credit (karma), and permanence. Contributors are users, not customers — they're the moat.
3. **Later — institutions (B2G/B2B, the revenue thesis).** LGUs and DPWH buy the dashboard (worst-scored school routes, before/after receipts for sidewalk projects); mobility and infrastructure partners (toll, transit, San Miguel-class) sponsor the miles/incentive layer. They pay for the evidence trail the free tier generates. Unvalidated until a signed partner — stated as thesis, not traction.

## Positioning (one honest sentence)

> In a bounded search, no existing product scores a specific Metro Manila walking route by combining the current apparent temperature and rain with per-segment infrastructure evidence — and shows its work, including where the data is missing. Closest: Walk Score (address, US-only), Cool Walks (Barcelona, shade-only prototype), AccessMap (US-only, weather-blind), Google (time/distance; shade toggle is an unreleased teardown string).

We are an **honest walkability evaluator**, not a better router. Cite, never claim: Frank walkability index, Krambeck GWI (field-tested in Manila, 2006), PET/UTCI thermal-comfort routing, CoolWalks, Tile2Net, Project Sidewalk.

## Functional requirement

| id | Requirement | Priority |
|---|---|---|
| F1 | Accept origin + destination (preset demo corridor list acceptable) and departure time | Core |
| F2 | Fetch walking route geometry (OSRM/ORS pedestrian profile) | Core |
| F3 | Fetch per-segment OSM evidence via Overpass: highway class, `sidewalk`, `crossing`, `lit`, `surface` | Core |
| F4 | Fetch weather at departure time via Open-Meteo: apparent temperature, precipitation probability | Core |
| F5 | Compute deterministic walkability score per segment and overall (spec below); identical input → identical score | Core |
| F6 | Display coverage disclosure: % of route length with infrastructure evidence; unknowns shown, never imputed | Core |
| F7 | GPT explanation: plain-language verdict + per-segment reason, bound ONLY to provided evidence JSON | Core |
| F8 | Per-segment receipt row: score chip, evidence pill linking to OSM element, explanation | Core |
| F9 | Departure-time toggle recomputes weather + score live (the demo move) | Core |
| F10 | Shareable URL (query-param encoded; recompute on load), no signup | Core |
| F11 | Disclosed cached-fixture fallback if live APIs fail at demo time | Core |
| F12 | Attribution: "© OpenStreetMap contributors" + "Weather by Open-Meteo" | Core (license) |
**M2 Report + Karma:**

| id | Requirement | Priority |
|---|---|---|
| F13 | Submit a report with no login: device id (generated, localStorage) + segment + kind (`blocked` \| `flooded` \| `unlit` \| `queue`) + optional note | M2 core |
| F14 | Community report appears in the route receipt as an `evidence` entry with `source: "community"`, visually distinct from official evidence (dashed pill, reporter karma shown) | M2 core |
| F15 | Karma v0: per-device accepted-report count; report weight = `min(1, 0.5 + 0.1 × karma)`; community delta = base delta × weight | M2 core |
| F16 | Accept/dispute (thumbs) on a community pill; disputes ≥ accepts hides the report from scoring (still listed, struck through) | M2 core |
| F17 | Seed the report table with 3–4 realistic entries before the form exists — M2 never demos empty | M2 core |

**M3 Bottleneck** — F18: `kind: "queue"` report at a station/crossing rendered as a chip on the route summary. Not a new system; a report kind plus one display rule.

**M4 Miles** — F19: opt-in, client-side only: completing a scored route accrues `daan_mile` (1 per 100 m) in localStorage, shown in the header. No server, no partner, no location history.

**Stretch (only after all surviving modules are green):**

| id | Requirement | Priority |
|---|---|---|
| S1 | Route alternative comparison (two candidate routes side by side) | Stretch |
| S2 | Mapillary photo pinned to receipt row (CC-BY-SA, logo + attribution) | Stretch |
| S3 | Park/plaza panel along route from Overpass amenity tags | Stretch |
| S4 | Whisper voice input for destination | Stretch |

## Non-goal (today)

Account/auth (device id is not an account), transit legs, bike mode, multi-city, imagery ML, mobile app (RN is post-event), server-side miles or any location-history storage, cash-equivalent karma, M5 traffic prediction, PAGASA integration (cite as authority only), anything derived from Google Maps or Street View (license kill-switch — never).

## Scoring spec v0 (deterministic; weights visible in UI; code owns this, never the model)

Per segment, start at 50, apply in order. `unknown` never adds or subtracts — it flags the segment and lowers route coverage_pct.

| Factor | Value | Delta |
|---|---|---|
| Road class (always known) | footway/path/pedestrian | +30 |
| | living_street/residential | +15 |
| | secondary/tertiary | −5 |
| | primary/trunk (walking beside) | −20 |
| Sidewalk tag | yes/both/separate | +15 |
| | no/none | −20 |
| | absent | unknown |
| Crossing on segment | marked/signals | +5 |
| | unmarked | −10 |
| | absent | unknown |
| Lit (only when departure 18:00–06:00) | yes | +10 |
| | no | −15 |
| | absent | unknown |

Segment score clamps 0–100. Route base = length-weighted mean of segment scores.

Weather multiplier (route-level, from Open-Meteo at departure hour):

| Apparent temperature | Multiplier |
|---|---|
| < 32 °C | × 1.00 |
| 32–38 °C | × 0.85 |
| 39–45 °C | × 0.65 |
| > 45 °C | × 0.45 |

Rain probability ≥ 60%: additional × 0.85; ≥ 85%: × 0.70.
Distance penalty: −5 per full km beyond 1.5 km.

Verdict band: ≥ 70 pleasant · 50–69 manageable · 30–49 harsh · < 30 avoid.

These weights are v0 judgment calls informed by cited literature (DLSU MRT-3 study: sidewalk condition and safety dominate locally). They are displayed, editable in code, and honest about being heuristic — do not present them as calibrated science.

## Data source and license

| Source | Use | License/limit | Attribution |
|---|---|---|---|
| OSRM demo / ORS free key | Route geometry | ORS free = non-commercial, 10k/day — fine for demo, flag before commercializing | OSM |
| Overpass API (public) | Segment evidence | Rate-limited; bbox + `[timeout:25]`; cache demo corridors locally | © OpenStreetMap contributors (ODbL) |
| Open-Meteo | apparent_temperature, precipitation | Keyless, non-commercial, 10k/day, CC-BY 4.0 | "Weather by Open-Meteo" |
| Mapillary (S2 only) | Street photo evidence | CC-BY-SA, free tier | Logo + link |
| PAGASA | Cited as local authority in pitch only | Token needs manual approval — killed for today | n/a |
| Google Maps / Street View | NONE | Prohibits caching, derivation, ML — permanent kill | n/a |

## Schema (singular naming everywhere, snake_case JSON)

### API contract (one endpoint; stateless; share link re-derives)

`GET /api/route?origin_lat&origin_lng&destination_lat&destination_lng&departure_time`
→ `200 route_result` | `422 unroutable` | `503 upstream_unavailable` (client then loads cached fixture + FallbackBanner)

### `route_result`

```jsonc
{
  "route_id": "string",              // hash of input param
  "origin_label": "string",
  "destination_label": "string",
  "departure_time": "ISO8601+08:00",
  "distance_m": 1420,
  "duration_min": 21,
  "score": 34,                        // post-multiplier, 0–100
  "verdict": "harsh",                 // pleasant | manageable | harsh | avoid
  "coverage_pct": 62,                 // % of route length with ≥1 known infra factor
  "weather": {
    "apparent_temperature_c": 41.2,   // Open-Meteo apparent_temperature
    "rain_probability_pct": 20,
    "multiplier": 0.65,               // shown in UI: score math is inspectable
    "source": "open-meteo",
    "fetched_at": "ISO8601"
  },
  "is_fixture": false,                // true → FallbackBanner shown
  "segment": [                        // collection named SINGULAR
    {
      "segment_id": "s1",
      "name": "Katipunan Ave service road",
      "length_m": 480,
      "score": 18,                    // pre-multiplier segment score
      "polyline": [[14.639, 121.074], [14.637, 121.073]],
      "road_class": "primary",
      "evidence": [
        {
          "kind": "sidewalk",         // sidewalk | crossing | lit | road_class | surface | blocked | flooded | queue
          "value": "none",            // raw OSM value, report kind, or "unknown"
          "state": "negative",        // positive | negative | unknown
          "delta": -20,               // 0 when unknown; community: base delta × weight
          "source": "osm",            // osm | open-meteo | community
          "weight": 1.0,              // 1.0 for official; karma-derived for community
          "source_url": "https://www.openstreetmap.org/way/123456",  // osm_url, or null for community
          "report_id": null,          // uuid when source = community
          "reporter_karma": null,     // int when source = community
          "reported_at": null         // ISO8601 when source = community
        }
      ],
      "explanation": "string"         // GPT, generated from evidence JSON only
    }
  ]
}
```

### `report` table (Supabase, anon access, M2/M3)

```sql
create table report (
  report_id     uuid primary key default gen_random_uuid(),
  device_id     text not null,          -- generated client-side, not an account
  segment_ref   text not null,          -- osm way id or segment hash from route_result
  kind          text not null check (kind in ('blocked','flooded','unlit','queue')),
  note          text,
  lat           double precision,
  lng           double precision,
  accept_count  int not null default 0,
  dispute_count int not null default 0,
  created_at    timestamptz not null default now()
);
```

Karma is derived, not stored: `karma(device_id) = count of that device's reports where accept_count > dispute_count`. The community collector queries reports by the route's segment refs, computes weight from karma, and emits standard `evidence` entries — downstream (scorer, receipt, GPT explanation) cannot tell modules apart except by `source`. That property is the platform.

### `daan_mile` (M4, client-only)

`localStorage.daan_mile = { total: int, entry: [{ route_id, distance_m, earned, at }] }` — 1 mile per 100 m of a completed scored route. Never sent to any server.

### Model contract (F7)

Input: the full `route_result` minus `explanation` fields. Instruction: explain each segment and the overall verdict citing only `evidence` entries by kind and value; state unknowns as unknowns; ≤ 25 words per segment. Output validated: any claim naming a factor not present in evidence → regenerate once, else fall back to template text. The model never sees or emits numbers other than those provided.

### Persistence

Route results: none — share link encodes the five query params; `route_result` is recomputed on open. Demo corridors additionally shipped as static fixture JSON (also the F11 fallback). Community reports: the single Supabase `report` table above (seeded per F17; if Supabase is unreachable at demo time, the seeded rows ship as a fixture too and the FallbackBanner discloses it). Miles: localStorage only.

## Pre-demo evidence task (from research, non-negotiable)

Run the Overpass coverage query on the chosen demo corridors before presenting and put the real number in the pitch ("infrastructure tags cover N% of this route") — never hand-wave Manila OSM coverage. If sidewalk tags are near-zero on all corridors: score stands on road class + weather (design already survives this), and the pitch labels sidewalks a "community-mappable gap".

## Milestone vs. clock (platform build)

| Time | Gate |
|---|---|
| +30 min | Overpass coverage numbers for 3 corridors known; corridor chosen; Supabase `report` table created and seeded (F17) |
| 11:00 | Spine: F2–F5 return a real `route_result` in terminal (go/no-go from idea.md); M2 form works against seeded table in isolation |
| 12:00 | F6–F8 render from fixture; community pill renders from seeded reports |
| 1:40 | End-to-end live route with merged community evidence on the deployed URL; else fixture mode permanently |
| **2:00** | **Amputation checkpoint (integrator's call, no meeting): M4 → M3 → M2, in that order, for anything not working on the deployed URL** |
| 2:15 | Freeze. Rehearse 3/3 including the live-report beat (with the fixture fallback rehearsed too) |
| 2:45 | Submitted: link, repo, problem statement, Codex evidence |

## Demo script (2 min, platform)

1. "This is the walk from [corridor A] at 2 PM today." → score 34, harsh, receipt scrolls. *(M1)*
2. Click a red segment → evidence pills → open the actual OSM way. "Not our opinion — here's the tag, here's the gap." *(M1)*
3. Teammate in the audience submits "sidewalk blocked" from their phone → receipt updates live with a dashed community pill, karma weight visible. "Official data plus the crowd, one receipt — same engine." *(M2/M3)*
4. Flip departure to 6 AM → score climbs, weather multiplier visibly updates. Miles counter ticks on route completion. *(M1/M4)*
5. Coverage bar + vision sentence from roadmap.md: "one engine, four evidence sources today, module registry for the rest." Done.

If M2 was amputated, the script collapses back to the 90-second M1 version (beat 3 removed) — rehearse both.
