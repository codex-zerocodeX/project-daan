# Prompt

These prompts preserve repeatable thinking outside chat history. Replace bracketed fields before use. Each implementation prompt must contain an explicit stop point.

## Rule normalization

```text
Read the official event page and rule at [source]. Produce a rule packet for [event]. Separate confirmed, inferred, reported, and unknown statements. Capture eligibility, build period, pre-existing-work rule, required technology, category, artifact, rubric weight, tie-break, demo duration, data right, IP term, prize form, and local-versus-global ambiguity. Do not brainstorm ideas. Save only source-backed claims to context.md and unresolved organizer questions to triage.md. Stop after listing the exact changed files and evidence links.
```

## Asset audit

```text
Audit the complete maintained project catalog at [repo/path] for assets relevant to [event]. Read every project description before shortlisting. For each project, separate the existing user loop from the reusable primitive, live dependency, known gap, and possible fresh application seam. Inspect live repository state only for the short list; preserve every dirty worktree and private record. For each usable asset, state freshness, provenance, permission, product role, repaint risk, and forbidden inference. Update asset.md only. Stop after reporting catalog coverage, exact repositories inspected, and remaining rights gaps.
```

## Idea generation

```text
Using context.md, asset.md, research.md, and framework/competition.md, run five bounded divergence waves for [event]: (1) painful failure × official track, (2) reusable mechanism × new user, (3) authoritative change × visible proof, (4) primitive from source project A × different asset from source project B × new complete loop, and (5) resource constraint × bounded decision. Require every eligible track, at least three distinct user jobs, and no more than one third of the field using the same proof primitive. Express each concept as: specific user + observable failure + one transformation + visible proof + source-project boundary + nearest alternative + falsifiable kill question. Merge feature mutations and reject source-repo repaints. Preserve every concept and disposition in inbox.md. Promote nothing until local and global current prior-art screens, data rights, sprint fit, new-work boundary, and live kill test are written. Stop before implementation.
```

## Idea refinement (event-day starting prompt)

```text
You are a skeptical hackathon co-founder helping refine one idea for the OpenAI Community Buildathon Manila (July 18, 2026, Ateneo). Hard constraint: all code starts today; roughly 3 hours 35 minutes of total build time across two sprints; submission hard cutoff 3:00 PM; team of [team size]; judged on working build quality, usefulness, and visible Codex impact — a working state today beats a promised feature.

My raw idea: [describe the idea in 2–5 sentences, however rough].

Refine it in this order, asking me at most three clarifying questions first if the idea is ambiguous:

1. User and failure — name one specific user and the observable, costly failure they hit today. If I gave a solution without a user, propose the three most plausible users and make me pick.
2. One transformation — compress the idea to a single before → after state change a judge can watch live in 90 seconds. Cut every second feature.
3. Smallest complete build — define the thinnest end-to-end version that is fully working (real input, real output, no mocked core) within half the build time, and list what is explicitly out of scope.
4. Codex visibility — state how Codex materially contributes to building it and what evidence of that contribution we capture as we go (task log, generated diff, before/after).
5. Nearest alternative — name the closest existing product or obvious ChatGPT-wrapper version, and the one sentence that distinguishes us. If you cannot distinguish it, say so plainly.
6. Kill question — give the single falsifiable question that, if answered no by noon, means we pivot.

Output: the refined idea as one retellable sentence, the 90-second demo script as a numbered before/after sequence, a two-sprint build plan with a noon go/no-go gate, and the top two risks. Do not start writing code. Stop after the risk list.
```

## Full research synthesis

```text
Determine which concept has the highest expected value for [event]. Start from official rules and organizer sources, then audit local assets, generate a broad bounded longlist, research current alternatives and relevant benchmarks, compare recent winner patterns from primary sources, and score only researched finalists against the published rubric. Treat “not found” as a bounded search result, never proof of universal novelty. Preserve rejected and merged concepts in inbox.md; keep raw facts in source.md; write the durable synthesis, funnel count, selected thesis, red team, reversal evidence, and known gaps to research.md; update idea.md only if the written promotion gate passes. Do not implement. Stop after listing every source checked, the exact changed files, and the evidence that would reverse the selection.
```

## Daan M1 deep research (walkability prior art + platform technology, July 18)

Historical: run and answered on July 18 (three reports; verdicts folded into prd.md and research.md). For platform-strategy questions use the Daan platform deep-research prompt above. Product was named Lakad when this prompt was written; the scope (M1 walkability) is unchanged.

```text
Research the prior art and enabling technology for a product we are building today at a hackathon: given a start point and destination in Metro Manila, it rates how WALKABLE that specific route is right now — using weather at walk time (heat index, rain), road/sidewalk infrastructure evidence (sidewalk presence, crossings, lighting, road class), and distance — and shows a per-segment evidence receipt, including honest gaps where data is missing. Web app, no signup, shareable link. Search by user job and mechanism ("rate walking route quality", "pedestrian routing with sidewalk data", "heat-aware walking directions"), never by our product name.

Part 1 — Direct product prior art. For each product: what it rates (address vs. route), data source, whether it is live/route-level/weather-aware, geographic coverage (especially Philippines), and business status. Cover at minimum: Walk Score and its methodology; Google Maps and Apple Maps walking directions (do either expose route QUALITY, shade, heat, or sidewalk presence, or only time/distance?); Project Sidewalk; AccessMap Seattle and other accessible-pedestrian routers; Wheelmap; shade/heat routing products (Shademap, Barcelona "cool walks" or climate-shelter routing, any heat-aware navigation pilots); Strava/AllTrails route quality signals; and any walkability index products used by cities or real estate. Then screen the Philippines specifically: sakay.ph's feature set today, any PH commuter/pedestrian app on Google Play or the App Store, AppBuildersPH and StartupHub PH catalog entries, and what r/HowToGetTherePH or r/PHCommuters communities use for walking decisions. State clearly for each: confirmed exists, versus not found in this search.

Part 2 — Research and methods prior art. Summarize: academic walkability indices and their standard variables; pedestrian network completeness research (how incomplete is OSM sidewalk tagging in Southeast Asian cities, any Manila-specific assessment); heat-exposure and thermal-comfort routing papers; sidewalk extraction from imagery (Tile2Net, Mapillary sidewalk/crossing detection, Google Street View–based audits like Project Sidewalk's model). We need to know which methods are established science we should cite rather than claim as ours.

Part 3 — Platform and device technology. What do iOS and Android already give a pedestrian product natively, and what could a future mobile version use: iOS MapKit/Apple Maps walking + AR walking directions, Core Location, Weather framework; Android Google Maps Platform Routes API pedestrian options, ARCore Geospatial, Fused Location; cross-platform: OSRM/OpenRouteService/Valhalla pedestrian profiles and their sidewalk/surface options, Overpass API, Mapillary API, Open-Meteo and PAGASA data access. Flag anything with a free tier usable in a same-day web build and anything (like Street View imagery analysis) with license restrictions we must avoid.

Part 4 — Verdict. (a) A comparison table of the five nearest alternatives versus our composition: route-level + Philippine + weather-at-time + per-segment receipt + admitted data gaps. (b) The single honest sentence that distinguishes us, written so a skeptical judge accepts it. (c) The three strongest attacks a judge could make ("Google already does this", "Walk Score already does this", "OSM Manila data is too sparse for this to be real") with the factual counter or the honest concession for each. (d) Anything you found that should make us KILL or reframe the idea before 3:00 PM today.

Rules: cite primary sources (product pages, docs, papers), prefer current pages over blog summaries, and always distinguish "not found in this bounded search" from "does not exist". Do not flatter the idea; we need the truth fast.
```

## Daan platform deep research — moats, strategy, bottlenecks (July 18)

```text
Stress-test the strategy of Project Daan, a modular commuter-intelligence platform for Metro Manila. Do not flatter it; your job is to find where it dies. Context: one shared "receipt engine" — evidence in (public data, community reports, later partner feeds), deterministic score out, per-item evidence links, unknowns explicitly disclosed. Modules: M1 route walkability receipts (OpenStreetMap + live weather — built, working); M2 community reports weighted by contributor karma; M3 station/terminal queue states as a report kind; M4 opt-in walk-miles with future partner rewards; M5 route-condition intelligence via partnerships. Free for commuters, no signup to consume; revenue thesis is institutional (LGU/DPWH dashboards of worst-scored pedestrian routes, before/after evidence for sidewalk projects) and partner-sponsored incentives. Claimed moats: (a) the auditable evidence receipt with admitted data gaps, vs. black-box scores; (b) Philippine route-level coverage no global player prioritizes; (c) community evidence with credibility weighting, seeded by behavior that already exists unpaid on r/HowToGetTherePH; (d) modular engine so new evidence sources plug in without new apps.

Part 1 — Platform prior art and post-mortems. Who has built crowdsourced urban/mobility evidence platforms, and what actually happened to them? Cover at minimum: Safetipin (safety audit scores in Indian and other cities — the closest structural analog; did it reach consumers, or become a B2G audit tool? any Philippine deployment?); FixMyStreet / SeeClickFix / civic-reporting platforms (what sustains them, what kills clones); Waze's crowdsourcing and its Connected Citizens / Waze for Cities data program; Ushahidi; Premise Data (paid micro-observation, active in the Philippines — what does it pay, does it work?); OpenStreetMap community programs (Kaart, HOT/Maproulette campaigns, especially any Philippine sidewalk/mapping drives); community mapping in Manila specifically (MapPH, OSM Philippines, Project NOAH's crowdsourcing history). For each: consumer traction vs. institutional pivot, what the contribution incentive really was, and why the failures failed. Then the incentive-programs screen for M4: Strava Metro (who pays, how much, for what data), StreetLight Data, BetterPoints, the late Carrot Rewards (why it died), Miles app (its privacy backlash), toll/transit loyalty pilots in Southeast Asia. State clearly per item: confirmed vs. not found in this bounded search.

Part 2 — Moat stress-test. For each claimed moat, find the strongest disconfirming evidence: (a) Do consumers actually reward transparency/receipts over a simple score? Any evidence from product research or comparable products (e.g., Ground News, AllSides transparency positioning; nutrition-label-style UX studies)? (b) How defensible is "PH coverage" really — what stops Grab (already PH-dominant, already crowdsources), Google, or sakay.ph from adding a walking-quality layer in a quarter? What happened historically when a local vertical player held data a global player wanted? (c) Reputation/karma systems: established findings on what makes them work or collapse (Stack Overflow, Wikipedia, Waze points, Google Local Guides) — minimum viable community size, moderation load, Sybil/brigading resistance for location reports specifically. (d) Is "modular platform" a moat or a distraction — evidence on single-use-case wedges vs. platform-first launches for two-sided products.

Part 3 — Bottleneck research (ranked by what kills first). (i) Cold start: documented playbooks that worked for geo-crowdsourcing at city scale (Waze's early days, OSM mapping parties, Safetipin's trained-auditor model vs. open crowd) — what's the minimum density of reports for usefulness, and the cheapest path there? (ii) Legal/licensing at scale: ODbL share-alike obligations if we mix community reports into an OSM-derived database — must our report layer be open too, and is that fatal or fine? Open-Meteo and OpenRouteService free tiers are non-commercial — what does a commercial-grade swap cost? (iii) Philippine Data Privacy Act (RA 10173, NPC guidance): what do location reports and opt-in trip logs require — consent standard, registration thresholds, anonymization expectations; any NPC enforcement precedent on location data? (iv) Selling to LGUs: procurement reality (RA 9184), typical sales cycle length, which PH cities have actually bought mobility/pedestrian data or dashboards (Pasig, Quezon City, Baguio smart-city pilots?), and whether donor/DILG/ADB programs are the realistic first buyer instead. (v) OSM data improvement: can a startup lawfully and practically push community-verified sidewalk data back to OSM (StreetComplete-style), and does that strengthen or erode the data moat?

Part 4 — Verdict. (a) Rank the four claimed moats from most to least real, each with the single strongest supporting and strongest opposing evidence found. (b) Rank the five bottlenecks by kill-probability with the cheapest evidence-backed mitigation for each. (c) The three strongest attacks a skeptical investor or judge would make on the PLATFORM story (not the walkability feature), with the honest counter or concession. (d) Name the single sequencing decision the evidence most supports: consumer-first, community-first, or institution-first — and what the first 90 days should be. (e) Kill/reframe triggers: what finding, if true, should make the team abandon or restructure a module.

Rules: cite primary sources (product pages, terms, papers, NPC/official issuances, credible post-mortems); prefer current pages; search by mechanism and user job, not our product name; always distinguish "not found in this bounded search" from "does not exist"; flag every claim you could not verify. Blunt over polite.
```

## Daan UI + modular design system (Codex build, July 18 — platform revision)

Run in Codex one phase at a time; each phase has an explicit stop point. The mock fixture in Phase 0 is the contract between the screen lane and the data lane — the screen is finished against the fixture, and the real pipeline lands by replacing the functions in `src/lib` with identical shapes. Fixture shape mirrors [prd.md](prd.md) exactly; prd.md wins on conflict.

```text
You are building the complete front end for Project Daan, a modular commuter-intelligence platform built in one hackathon day. v0 ships one screen with four modules riding one receipt engine: M1 "How Walkable?" — score a Metro Manila route right now with a per-segment evidence receipt (the spine); M2 community reports weighted by contributor karma, merged into the same receipt; M3 queue state as a report kind; M4 client-side walk miles. Modules M4→M3→M2 may be amputated late in the day, so build each as an isolated component cluster that deletes cleanly. It is judged on a projector: every key element must be readable from 3 meters. No signup, no auth (device id in localStorage is not auth), one page, shareable by URL.

STACK (do not deviate): React + Vite + Tailwind. Map: MapLibre GL JS with the OpenFreeMap "liberty" style (keyless, https://tiles.openfreemap.org/styles/liberty); if that style fails to load at the venue, fall back to a raster OSM tile source added to the same MapLibre map — do not switch libraries. Visible "© OpenStreetMap contributors" attribution either way. MapLibre is a platform decision (the style and layer definitions reuse in React Native later) — do not substitute Leaflet. No component library, no CSS framework beyond Tailwind, no state library — useState/useReducer only. Everything must run with `npm install && npm run dev` and deploy statically.

NAMING CONVENTION (hard rule, entire codebase): every identifier is SINGULAR — variables, props, object keys, file names, and COLLECTIONS TOO: `segment: Segment[]` not `segments`, `chip` not `chips`, `route.segment.map(...)`. Booleans are `is_x`. JSON keys snake_case, TypeScript/JS variables camelCase but still singular.

== PHASE 0 — Data contract (do this first, alone) ==
Create `src/fixture/route.json`, the frozen mock the whole UI is built against. It mirrors the prd.md route_result schema exactly:

{
  "route_id": "katipunan-demo-1",
  "origin_label": "Ateneo Gate 3",
  "destination_label": "Katipunan LRT-2 Station",
  "departure_time": "2026-07-18T14:00:00+08:00",
  "distance_m": 1420,
  "duration_min": 21,
  "score": 34,                     // post-multiplier, 0–100
  "verdict": "harsh",              // pleasant | manageable | harsh | avoid
  "coverage_pct": 62,              // % of route length with ≥1 known infra factor
  "is_fixture": true,              // real pipeline sets false; true → FallbackBanner
  "weather": {
    "apparent_temperature_c": 41.2,
    "rain_probability_pct": 20,
    "multiplier": 0.65,            // displayed — score math is inspectable
    "source": "open-meteo",
    "fetched_at": "2026-07-18T13:55:00+08:00"
  },
  "segment": [
    {
      "segment_id": "s1",
      "name": "Katipunan Ave service road",
      "length_m": 480,
      "score": 18,                 // pre-multiplier segment score
      "polyline": [[14.639,121.074],[14.637,121.073]],
      "road_class": "primary",
      "evidence": [
        { "kind": "sidewalk", "value": "none", "state": "negative", "delta": -20,
          "source": "osm", "weight": 1.0,
          "source_url": "https://www.openstreetmap.org/way/123456",
          "report_id": null, "reporter_karma": null, "reported_at": null },
        { "kind": "lit", "value": "unknown", "state": "unknown", "delta": 0,
          "source": "osm", "weight": 1.0, "source_url": null,
          "report_id": null, "reporter_karma": null, "reported_at": null },
        { "kind": "blocked", "value": "blocked", "state": "negative", "delta": -8,
          "source": "community", "weight": 0.8, "source_url": null,
          "report_id": "r-seed-1", "reporter_karma": 3,
          "reported_at": "2026-07-18T09:40:00+08:00" }
      ],
      "explanation": "No sidewalk tag for 480 m along a primary road; a community report says the walkway is blocked."
    }
    // 4 more segments: one high-scoring (sidewalk yes + marked crossing), one fully
    // unknown (all evidence state=unknown), one with a queue-kind community entry, one mixed.
  ]
}

Also create:
- `src/fixture/route-morning.json` — SAME route at 06:00: apparent_temperature_c 28, multiplier 1.0, score 61, verdict "manageable", identical evidence, recomputed scores. Powers the time-flip demo move.
- `src/fixture/report.json` — 4 seeded community reports matching prd.md's report table shape (report_id, device_id, segment_ref, kind blocked|flooded|unlit|queue, note, accept_count, dispute_count, created_at). The M2 fallback when Supabase is unreachable.
STOP after all three fixtures validate as JSON and `src/lib/type.ts` defines Route, Segment, Evidence, Weather, Report types matching them exactly (all identifiers singular).

== PHASE 1 — Design tokens ==
Create the design system as Tailwind theme extension + a `token.md` reference. 
- Verdict color scale (the core semantic): pleasant #15803d, manageable #ca8a04, harsh #ea580c, avoid #dc2626, unknown #64748b. Every verdict color is ALWAYS paired with its label text and an icon — never color alone (color-blind judge safe).
- Neutrals: near-black ink on off-white; dark text contrast ≥ 7:1 for score numerals.
- Type: Inter via system fallback stack. Scale: score numeral 64px/800, section title 20px/700, body 15px/450, receipt mono detail 13px tabular.
- Spacing: 4px base grid. Radius: 12px card, 999px chip. Shadow: one soft elevation only.
- Motion: one signature transition — score numeral counts and verdict color cross-fades over 600ms when departure time changes. Everything else instant. prefers-reduced-motion: disable count animation.
STOP after tokens render on a demo page showing all four verdict states side by side.

== PHASE 2 — Component kit (build against fixture only) ==
Each component in its own file, props typed from type.ts, no data fetching inside components:
1. RouteForm — origin/destination inputs (static text is fine for demo) + DepartureTimePicker (segmented control: 6 AM / 2 PM / custom). This is the judge's interaction point; make it large and obvious.
2. ScoreCard — giant score numeral, verdict label + icon, distance/duration chip row, WeatherChip (heat index + rain with icon). The single most projector-visible element.
3. CoverageBar — horizontal bar: "Infrastructure data covers 62% of this route", with the uncovered share hatched and labeled "unknown — not scored, not hidden". This is the honesty receipt; style it as a feature, not a footnote.
4. SegmentReceipt — one row per segment: mini score chip (verdict color), name, length, evidence pill list, one-line explanation. Rows expand on click for full evidence. Pill styling encodes the platform's evidence semantics: official pill (source osm/open-meteo) solid, linking to source_url when present; unknown pill gray with dashed border; COMMUNITY pill (source community) dashed colored border + small karma badge ("reported · karma 3 · ×0.8 weight") — visually distinct from official at a glance, never disguised as official. A community pill with disputes ≥ accepts renders struck-through with delta 0.
5. MapPanel — MapLibre GL JS map, route drawn as one GeoJSON source with a line layer colored per segment by verdict (data-driven styling on a `verdict` feature property), 4px width; clicking a segment feature scrolls to and flashes its receipt row; fitBounds to the route. Keep source/layer definitions in a separate `src/lib/map-style.ts` — they are reused verbatim in the future React Native app.
6. ShareBar — copy-link button + "© OpenStreetMap contributors · Weather by Open-Meteo" attribution line.
7. FallbackBanner — amber banner: "Live data unavailable — showing cached route from [timestamp]" (for the disclosed-fixture fallback path).
8. LoadingState — skeleton for ScoreCard + receipt list; ErrorState — plain retry card.
9. ReportForm (M2, isolated cluster) — bottom-sheet/modal: segment picker (defaults to tapped segment), kind selector (blocked / flooded / unlit / queue) as four large icon buttons, optional note, submit. No login; device id from localStorage. Accept/dispute thumbs render on expanded community pills.
10. QueueChip (M3, isolated cluster) — chip on the route summary when any segment has an active queue-kind report ("Queue reported at Katipunan LRT · 25 min ago").
11. MilesCounter (M4, isolated cluster) — small header pill: total daan_mile from localStorage + a "+14" toast when a route completes ("I walked this" button on ScoreCard). Reads/writes localStorage only.
Modules 9–11 import from their own directories (src/module/report, src/module/queue, src/module/mile) so amputation = delete directory + remove one mount line.
STOP after a Storybook-less demo page renders every component in every state (all four verdicts, unknown-heavy segment, community pill incl. disputed/struck state, report form open, queue chip, miles toast, fallback banner on) from the fixtures alone.

== PHASE 3 — Screen assembly ==
One screen, desktop-first for the projector, stacking cleanly to mobile:
- Desktop grid: left column 40% = RouteForm, ScoreCard, CoverageBar, ShareBar stacked; right column 60% = MapPanel on top (55vh), SegmentReceipt list scrolling under it. Page never scrolls horizontally.
- Mobile: RouteForm → ScoreCard → MapPanel (40vh) → CoverageBar → SegmentReceipt → ShareBar.
- Wire the DepartureTimePicker: 2 PM loads route.json, 6 AM loads route-morning.json, with the Phase 1 signature transition on score/verdict/segment colors. This swap is one of the two demo climaxes — rehearse-quality smoothness matters more than any other polish.
- The other climax: a submitted report appearing on the receipt. Wire ReportForm → submitReport → a lightweight poll (every 5 s) or manual refresh that re-merges community evidence, so a report sent from a phone in the audience lands on the projector screen within seconds.
- ALL data goes through `src/lib/route.ts` (`loadRoute(departure_time)`) and `src/lib/report.ts` (`listReport(route_id)`, `submitReport(input)`, `voteReport(report_id, vote)`), currently returning/writing fixtures. The pipeline and M2 lanes replace these function bodies (real API, Supabase); nothing else may touch data. Header shows "Daan" + module context ("How Walkable? · module 1 of the receipt engine") — platform-named, not feature-named.
STOP after the full flow (load → score → time toggle → segment click → map flash → report submit → pill appears → miles toast → copy link) works in a fresh browser at 1280×720 and at 390×844.

== PHASE 4 — Polish (only if Phases 0–3 are green) ==
Priority order, stop wherever time runs out: (1) score numeral count-up animation; (2) map segment hover tooltip; (3) OG/meta tags so the share link unfurls with route name + score; (4) print-friendly receipt (judges may screenshot); (5) subtle Filipino sun/street illustration in the header — flat SVG, no stock images.
Never add: dark mode, settings, more routes, login, i18n, a module-registry screen or tiles for unbuilt modules (M5 and future modules live in the pitch deck, never as dead UI).

QUALITY GATE for every phase: no console errors, keyboard focus visible on every interactive element, all text real (no lorem), and singular naming audited before stop.
```

## Comparable research

```text
Research the three nearest alternatives to [idea]. First screen the team's own project catalog, AppBuildersPH or the relevant local builder directory, national startup catalog, and prior hackathon projects; then search current primary product pages, official documentation, and research papers globally. Search by user job and mechanism, not proposed name. Compare user, workflow, mechanism, data, proof, and commercialization. Distinguish no result found from proof that nothing exists. Update source.md first, then the differentiation, source-product boundary, and uncertainty sections in idea.md. Stop without changing the selected idea unless a written reversal trigger is met.
```

## Vertical-slice build

```text
Implement [one outcome]. Scope: [file/surface]. Non-goal: [explicit exclusion]. Preserve the singular naming convention for every identifier and collection. Acceptance command: [command]. Pass condition: [observable result]. Stop after the targeted command is freshly green and report its exit code; do not add another feature, create a commit, or open a pull request.
```

## Reliability review

```text
Try to falsify the current demo path for [idea]. Test fresh start, deterministic scoring, malformed structured output, missing key, timeout, slow network, stale cache, wrong fixture, and disclosed fallback behavior. Record each reproducible failure in triage.md with severity, owner, and acceptance test. Fix nothing unless explicitly requested. Stop after ranking the smallest set that can invalidate judging readiness.
```

## Judge simulation

```text
Act as a skeptical judge using only the official rubric in context.md. Watch or read the current 90-second demo once. Score technical implementation, design, impact, and idea quality separately. For every score, cite observed evidence and the strongest counterpoint. Identify the one question most likely to expose overclaim. Do not reward planned features. Save actionable changes to triage.md and stop.
```

## Pitch compression

```text
Rewrite the current pitch to [60/90/180] seconds. Preserve: user, costly failure, live transformation, why GPT-5.6 is central, deterministic proof, limitation, and closing line. Remove architecture detail that is not visible and every unsupported market or novelty claim. Update pitch.md only. Stop after providing the estimated spoken duration.
```

## Retrospective

```text
Using the submitted artifact, commit history, plan.md, judge feedback, and result, complete retrospective.md. Distinguish planned versus shipped, evidence versus interpretation, and reusable lesson versus event-specific luck. Preserve rejected ideas and record whether each pivot trigger fired. Do not rewrite the result as either total failure or guaranteed validation.
```
