# OpenAI Build Week Manila — Project Daan

> **Historical naming note.** This July 2026 record uses **Project Daan**, the internal codename at the time. The current product and codebase name is **Alitaptap**.

Date: Saturday, July 18, 2026 · Leong Hall, Ateneo de Manila University · submission cutoff 3:00 PM

Team: five (Gelo, Rafaello Sibayan, +3 — updated event morning from the earlier two-person plan)

Workspace state: **DEMO BUILD IMPLEMENTED; FIXTURE-BOUNDED** — Project Daan platform v0. Selection was made by team vote on event morning and supersedes the July 14 three-finalist board, which remains documented in [idea.md](idea.md) as historical research.

## What we are building

> **Project Daan is a modular commuter-intelligence platform for a car-dependent country: every module turns public or community evidence into a scored, auditable receipt about moving through the city — and admits what it doesn't know.**

The current build proves one bounded Katipunan decision loop. The original module plan is retained in [roadmap.md](roadmap.md), but judge-facing claims must follow the implementation state below:

| Surface | Current state | Boundary |
|---|---|---|
| M1 How Walkable? | Working route search, two route profiles, score, coverage bar, map, and per-segment receipt | Local Katipunan graph plus disclosed route/weather/evidence fixtures; not live citywide routing or weather |
| M2 Community | Working route-bound question, answer, reply, vote, review match, and karma flow | Seeded fixture plus versioned localStorage; no shared backend or cross-device sync |
| M3 Bottleneck | Seeded queue evidence can appear in the receipt | Not a live station feed |
| M4 Miles | Not shipped | Roadmap only; do not demo or claim it |
| M5 Traffic Intelligence | Not shipped | Future lawful-partner concept only |

Problem, market, requirements, scoring spec, schema: [prd.md](prd.md). Platform architecture, module gates, tech scope (MapLibre GL JS now, React Native later), post-event phases: [roadmap.md](roadmap.md).

## Judging alignment (official local rubric)

Four judges independently score **Codex Craft**, **Product Judgment**, and **Problem & Insight**, each out of 10 using only 10, 8, 7, or 5. Before scoring, the project must pass three eligibility gates: it started clean at the event, runs live, and has evidence for its claims. Judges also ask for one thing Codex materially improved today. See [context.md](context.md) for the exact rubric and tie-break.

Consequences: run the real prepared path, disclose the fixture boundary before the judge has to discover it, show the strongest product decision and what was cut, ground the user problem in commuter behavior, and keep a concrete Codex artifact ready. Nothing in the pitch may upgrade fixture evidence into a live source or a roadmap item into shipped behavior.

## Judge-readiness checklist

| Gate | Current state |
|---|---|
| Prepared fixture path runs from route selection through receipt and community context | Implemented; rehearse on the submitted URL |
| Fixture boundary is stated in the first 25 seconds | Written in [pitch.md](pitch.md); rehearsal still required |
| One material Codex improvement has a task/diff/test artifact | Open—select the strongest real artifact and replace the bracketed pitch text |
| Clean Start evidence and main task identifier are captured | Open—add the actual identifier/evidence; do not invent it |
| Spoken pitch, README, submission copy, and video make the same shipped-versus-planned claims | Documentation aligned; submission/video still require verification |

## Workspace

| File | Use now |
|---|---|
| [PRD](prd.md) | Product target and scoring contract, with an explicit current implementation boundary |
| [Roadmap](roadmap.md) | Platform architecture, module registry, tech scope, post-event phases |
| [Idea](idea.md) | Selection record, M1 spine detail, lane plan, superseded finalist board |
| [Prompt](prompt.md) | Codex UI phases (MapLibre), deep-research and reusable prompts |
| [Context](context.md) | Confirmed event rule, schedule, judging criteria, constraint |
| [Research](research.md) | July 14 synthesis + July 18 deep-research verdicts (no identical prior art; road-class-first scoring; PAGASA and Google-derived data killed) |
| [Transport cost](transport-cost.md) | July 18 fare, toll, transport-inflation, discount, and speed baseline with effective-date boundaries |
| [Inbox](inbox.md) | Idea funnel including the G-series event-day intake and dispositions |
| [Pitch](pitch.md) | Active fixture-honest 90-second script, panel-aware Q&A, Codex proof beat, and failure recovery |
| [Source](source.md) | Evidence ledger and claim boundary |
| [Retrospective](retrospective.md) | Post-event outcome and reusable learning |
| [Decision receipt](receipt/) | July 14 gate receipts — historical; the July 18 team vote superseded that process |

## Non-negotiable boundary

No strategy guarantees a win. License hard lines: nothing cached, derived, or ML'd from Google Maps/Street View; OSM under ODbL with attribution; Open-Meteo attributed; PAGASA cited as authority, not integrated. Honesty hard lines: unknown data is disclosed, never imputed; community evidence is labeled as reported, not official; the pitch claims composition ("first found in a bounded search"), never universal novelty; miles stay client-side — no location history leaves the device.

## Runnable map foundation

The current interface combines the fixture-backed Alitaptap route receipt with a mobile-first MapLibre route workspace. Local place search plans A → B paths over a deterministic Katipunan graph, and heap-backed Dijkstra independently optimizes the `shortest_time` and `comfort_balance` profiles; each computed path has a stable route identity. Community questions are bound to that exact route; commuters can post answers, reply up to three levels, vote useful or stale context, and build local karma. Place-node reviews remain separate and are similarity-matched into questions as supporting context.

The foundation is deliberately honest about its boundary: search, routing, seeded questions, and place reviews currently use local fixtures; new answers, nested replies, accept/dispute votes, and anonymous contributor karma persist only in versioned localStorage. Origin, destination, departure time, route, segment, question, answer, and reply selections are deep-linkable and restore from the URL. Editing an endpoint invalidates the visible receipt until the route is checked again, so an old score is never presented as current input. OpenFreeMap/OpenMapTiles/OpenStreetMap provide only the rendered map. The monorepo now contains Supabase-backed API seams and an optional server-side AI explanation endpoint, but the judging web receipt does not call them; live geocoding, account state, server-synced report submission, and rewards are not included in this experience.

At the event, this workspace used **Project Daan** as its internal codename. The current product and codebase name is **Alitaptap**. The initial UI request used “smartset”; no separate Smartset brand is introduced here.

```bash
npm ci
npm run dev:web
```

Quality checks:

```bash
npm run lint
npm run test
npm run typecheck
npm run build
node script/route-flow.mjs
```

The graph, route-question, and review fixture live in `apps/web/src/fixture/`. Pure search, route-profile Dijkstra, review compilation, and cosine-similarity functions live in `apps/web/src/lib/`; `apps/web/src/module/community/` owns the local repository, deterministic seed merge, route projection, threaded UI, and URL state. `apps/web/src/lib/map-style.ts` keeps the MapLibre source/layer contract separate from the web canvas so the mapping contract can be reused later.
