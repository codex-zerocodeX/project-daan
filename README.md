# OpenAI Build Week Manila — Project Daan

Date: Saturday, July 18, 2026 · Leong Hall, Ateneo de Manila University · submission cutoff 3:00 PM

Team: five (Gelo, Rafaello Sibayan, +3 — updated event morning from the earlier two-person plan)

Workspace state: **SELECTED AND BUILDING** — Project Daan platform v0. Selection made by team vote on event morning (broadened late morning from the walkability-only slice); it supersedes the July 14 three-finalist board (Saan Tayo?, Tumpak, CleanRoute), which remains documented in [idea.md](idea.md) as the researched alternative. Build Receipt remains the emergency fallback.

## What we are building

> **Project Daan is a modular commuter-intelligence platform for a car-dependent country: every module turns public or community evidence into a scored, auditable receipt about moving through the city — and admits what it doesn't know.**

v0 today, one receipt engine with four modules and a hard amputation order (M4 → M3 → M2; M1 never):

| Module | Today | Cut order |
|---|---|---|
| M1 How Walkable? — route receipt from OSM + live weather | The spine | Never |
| M2 Report + Karma — community evidence, credibility-weighted | Live report → receipt merge | 3rd |
| M3 Bottleneck — queue state as a report kind | Chip on the route | 2nd |
| M4 Miles — opt-in client-side walk counter | Header counter | 1st |
| M5 Traffic Intelligence | Slide only (no lawful data source) | — |

Problem, market, requirements, scoring spec, schema: [prd.md](prd.md). Platform architecture, module gates, tech scope (MapLibre GL JS now, React Native later), post-event phases: [roadmap.md](roadmap.md).

## Judging alignment (confirmed local criteria)

Working build quality · usefulness · visible Codex impact. Consequences: the deployed URL must work at any minute (integrator owns trunk), Codex contribution is captured per phase as we build, and nothing unfinished is shown as if it worked.

## Today's clock

| Time | Gate |
|---|---|
| +30 min | Overpass coverage numbers known; corridor chosen; `report` table seeded |
| 11:00 | Spine returns a real `route_result`; M2 form works in isolation |
| 1:40 | End-to-end live on deployed URL, or fixture mode permanently |
| 2:00 | Amputation checkpoint (integrator's call, no meeting) |
| 2:15 | Freeze; rehearse both demo scripts 3/3 |
| 2:45 | Submitted |

## Workspace

| File | Use now |
|---|---|
| [PRD](prd.md) | **Build spec of record: problem, market, requirements, scoring, schema, clock** |
| [Roadmap](roadmap.md) | Platform architecture, module registry, tech scope, post-event phases |
| [Idea](idea.md) | Selection record, M1 spine detail, lane plan, superseded finalist board |
| [Prompt](prompt.md) | Codex UI phases (MapLibre), deep-research and reusable prompts |
| [Context](context.md) | Confirmed event rule, schedule, judging criteria, constraint |
| [Research](research.md) | July 14 synthesis + July 18 deep-research verdicts (no identical prior art; road-class-first scoring; PAGASA and Google-derived data killed) |
| [Inbox](inbox.md) | Idea funnel including the G-series event-day intake and dispositions |
| [Pitch](pitch.md) | Active pitch sheet: platform 2-min script, M1 90-s fallback, judge Q&A, failure recovery, freeze rule |
| [Source](source.md) | Evidence ledger and claim boundary |
| [Retrospective](retrospective.md) | Post-event outcome and reusable learning |
| [Decision receipt](receipt/) | July 14 gate receipts — historical; the July 18 team vote superseded that process |

## Non-negotiable boundary

No strategy guarantees a win. License hard lines: nothing cached, derived, or ML'd from Google Maps/Street View; OSM under ODbL with attribution; Open-Meteo attributed; PAGASA cited as authority, not integrated. Honesty hard lines: unknown data is disclosed, never imputed; community evidence is labeled as reported, not official; the pitch claims composition ("first found in a bounded search"), never universal novelty; miles stay client-side — no location history leaves the device.
