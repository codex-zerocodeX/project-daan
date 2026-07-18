# Idea

Raw and unresearched concepts live in [`inbox.md`](inbox.md). This file contains promoted candidates only. The July 14 TunnelMind, Easyresume, and AppBuildersPH audit reopened the earlier Tumpak lock; no product is selected until a finalist passes every decision gate.

## SELECTED — July 18 (team decision, revised late morning)

**Project Daan — modular commuter-intelligence platform, v0 platform build.** The morning selection ("How Walkable?" standalone, working name Lakad) was broadened by team decision to a platform build: M1 Walkability as the never-cut spine, plus M2 Report + Karma, M3 Bottleneck (report kind), M4 Miles (client-side), with a hard amputation order (M4 → M3 → M2) at the 2:00 PM checkpoint. Full spec: [prd.md](prd.md); module registry and platform architecture: [roadmap.md](roadmap.md). This is a team-vote selection, not a state-board winner; the probed finalists below remain the documented alternative and Build Receipt remains the fallback.

The sections below describe the M1 spine and remain accurate for it; the platform additions live in prd.md. Where they conflict, prd.md wins.

### Product sentence

> Given a start and a destination, Daan's M1 rates how walkable that route is right now — weather at walk time, sidewalk and crossing evidence per segment, distance — and shows the receipt for every score line, including what the data does not cover.

### Demo atom

> "Google says Gate 3 to Katipunan station is a 22-minute walk. Daan says: apparent temperature 41 at 2 PM, no sidewalk tag on 480 m of the service road, two unlit crossings — low walkability now, and here is the per-segment receipt. The judge changes departure time to 6 AM and watches the score change for an inspectable reason. A community report from the audience lands on the same receipt, karma-weighted."

The live state change is the time/weather edit — the same editable-assumption move that made Saan Tayo? legible.

### Smallest complete build

- Input: origin + destination; two or three pre-verified Metro Manila demo routes (Katipunan area — local to the venue and famously hostile to pedestrians).
- Walking route from an OSM router (OSRM demo server or OpenRouteService free key); segment evidence from Overpass API tags (`sidewalk`, `footway`, `crossing`, `lit`, highway class); weather at walk time from keyless Open-Meteo.
- **Code owns the score**: deterministic per-segment walkability from tags + weather + distance, with explicit unknown state where tags are absent ("no sidewalk data on 38% of this route" is a receipt, not a failure).
- **Model owns the explanation**: GPT converts the structured segment evidence into the plain-language verdict and per-segment reason. The model never grades itself.
- Output: one screen — route line, overall score, per-segment receipt with evidence links, coverage disclosure, shareable link, no signup.

### Chat-substitution gate

Passes: live composition of route + tag + weather data a chat does not fetch; a deterministic, linkable per-segment receipt a chat cannot emit; a no-signup share link in the moment of need.

### Prior-art honesty

Walk Score rates addresses, not live routes, and is US-centric; Google walking directions give time, not quality; Project Sidewalk crowdsources sidewalk assessment. Claim only the composition: Philippine route-level walkability receipt with weather-at-time and admitted data gaps. Bounded search — not proof of novelty.

### Rights and attribution

- OSM/Overpass/OSRM: ODbL — display "© OpenStreetMap contributors"; respect OSRM demo-server light-use policy and keep a cached, disclosed fixture fallback.
- Open-Meteo: free non-commercial use with attribution.
- No personal data anywhere in the flow.

### Forbidden list (revised with the platform decision)

Now IN scope as modules with an amputation order (see prd.md): community report + karma (M2), bottleneck/queue state (M3), client-side miles (M4).

Still forbidden today: partner-dependent incentive mechanics (toll discounts, San Miguel collab — M4's *reward* half stays gated on a signed partner), Grab/Waze integration or algorithm prediction (M5 — no lawful data source), sidewalk-imagery ML, bike routing, cafe/pub/lively-area discovery, multi-city coverage, accounts/auth, server-side location history. Problem 5 contributes the morale/impact framing in the pitch only. One mode: walking.

Added by July 18 deep-research verdict (three convergent reports; full spec in [prd.md](prd.md)): **no PAGASA integration** (token requires manual approval — cite as authority only) and **nothing derived from Google Maps or Street View** (terms prohibit caching, derivation, and ML — permanent license kill-switch). Score is road-class-first; sidewalk/crossing/lit tags are bonus evidence; unknowns are displayed, never imputed.

### Kill test (go/no-go at 11:00)

1. Overpass returns usable sidewalk/crossing tags for at least one candidate demo route from the venue network.
2. Route and weather calls complete end to end in under 10 seconds.
3. The deterministic scorer produces the same score for the same input three times.
4. A first-time observer states why the route scored low without seeing a prompt.

If 1 or 2 fails on all candidate routes, run the same product on a cached, disclosed fixture — a smaller honest demo, not a pivot. If the core is not green by 1:40 PM, activate Build Receipt.

### Five-person lane plan (platform build)

| Lane | People | Owns | Green means |
|---|---|---|---|
| Receipt engine + M1 spine | 2 | Route fetch, Overpass segment join, deterministic scorer, community-evidence merge point, cached fallback | Score + receipt JSON for one real route, accepting `source: "community"` entries |
| M2/M3 | 1 | Supabase `report` table (seeded first), report form, community collector, karma weight, queue chip | Live report lands on the deployed receipt |
| Screen | 1 | MapLibre + receipt UI, time selector, community pill, miles counter, error and unknown states, share link | Fresh browser completes the flow |
| Integration + pitch | 1 | Deployed main branch demoable at any minute; 2:00 amputation call; both demo scripts rehearsed; submission + Codex evidence | Timed run succeeds 3/3 before freeze; submitted by 2:45 |

## State board

Each score is an internal estimate against the four official criteria, each out of 25. It is a comparison aid, not a predicted result. A direct comparable reduces idea quality even when the implementation can still be excellent.

| Rank | State | Idea | Tech | Design | Impact | Quality | Total | Primary concern |
|---:|---|---|---:|---:|---:|---:|---:|---|
| 1 | Finalist | **Saan Tayo? — evidence-bound Philippine program site selector** | 23 | 24 | 23 | 19 | **89** | ArcGIS Business Analyst, Data Commons, OECD, Felt, and UrbanFootprint prove the scoring/exploration surface is mature |
| 1 | Finalist | **Tumpak — authoritative change-to-test gate** | 24 | 23 | 21 | 21 | **89** | Giskard/Ragas generation, HoH/FRESCO temporal research, and provenance/freshness tooling materially narrow novelty |
| 3 | Finalist | **CleanRoute — AI request route and endpoint attestation** | 24 | 22 | 18 | 19 | **83** | Portkey and Envoy already cover output/body-triggered fallback or ejection; LiteLLM and Cloudflare make AI failover routine |
| 4 | Hold | **Xedoc Lens — event-to-asset-to-prior-art decision ledger** | 22 | 22 | 19 | 19 | **82** | Risks looking like another startup-idea validator or hackathon-only meta tool |
| 5 | Hold | **Bukas Pa? — official-source opportunity verifier** | 21 | 23 | 23 | 15 | **82** | Verified scholarship and grant matching is already crowded |
| 6 | Hold | **Packet Ready — Philippine filing completeness receipt** | 21 | 24 | 22 | 15 | **82** | Adobe AI Form Fill and document-AI workflows cover much of the primitive |
| 7 | Hold | **Mind Mirror — source-backed personal belief-change view** | 21 | 24 | 20 | 15 | **80** | MemryLab, Fidelius, TEMPRA, Aion, and Aye-Aye directly cover personal temporal memory |
| 8 | Hold | **ClaimGate — proof-before-publish for institutional communication** | 22 | 21 | 21 | 15 | **79** | Publish Weaver is a direct semantic-governance comparable; Atono already covers safe institutional publishing |
| 9 | Reject for Saturday | **Agent Fence — generated cross-tenant leakage proof** | 23 | 19 | 21 | 14 | **77** | Sectum and Talantir directly sell this; security scope is integration-heavy |
| 10 | Reject for Saturday | **Budget Basket — constrained Philippine grocery plan** | 20 | 23 | 22 | 11 | **76** | Presyo is existing work and AppBuildersPH already contains several grocery and price products |
| — | Low-risk fallback | **Build Receipt — Codex provenance and rubric packager** | 23 | 22 | 18 | 20 | **83** | Highly feasible, but narrow external impact and event-specific framing |

## Finalist 1 — Saan Tayo?

### Product sentence

> For a Philippine program team deciding where to pilot, Saan Tayo? turns a plain-language goal into a reviewable indicator model, ranks candidate places, and shows exactly which public evidence moved each place up or down.

### Demo atom

> “Where should a mobile digital-literacy lab pilot first?” GPT-5.6 selects a bounded set of relevant Maphy indicators, explains and exposes each weight, ranks three municipalities, then the judge changes one constraint and sees the map and ranking change with source and vintage still visible.

### Unfair start and new-work boundary

- Reuse only Maphy's documented public API, indicator catalog, and permitted public-display source subset.
- Treat PSA's upstream public-domain right and Maphy's aggregate-use terms as separate layers: attribution is required, non-commercial derivative use is allowed, and event/commercial reuse remains open until the maintainer and host boundary are recorded.
- Build the program brief, indicator-selection contract, transparent scoring, comparison screen, and explanation as new application work in a fresh repository.
- Do not edit or copy from Maphy's currently dirty worktree.
- Do not call the rank an allocation recommendation; it is a comparison aid whose assumptions remain editable.
- Do not claim weighted place ranking, suitability analysis, or natural-language civic-data exploration as novel; the wedge must be the inspectable Philippine rights/coverage/assumption receipt.

### Kill test

Advance only if all pass:

1. Five rights-cleared indicators can be fetched and joined for at least 100 comparable municipalities without private data.
2. The same brief produces a stable structured indicator selection on three runs, or the model proposes and the human explicitly locks the weights.
3. Changing one visible constraint changes the ranking for an intelligible, inspectable reason.
4. A first-time observer can state why rank 1 beats rank 2 without being shown a hidden prompt.
5. One program, NGO, research, or university operator recognizes site comparison as a real task.

Failing rights, join, or explanation by Friday removes this candidate. Do not patch the claim with a precomputed theatrical ranking.

## Finalist 2 — Tumpak

### Product sentence

> For teams deploying AI over changing official information, Tumpak turns an authoritative source change into an executable answer test and a dated repair receipt.

### Demo atom

> A Philippine entity changes. Tumpak reads the official change, creates the affected question, catches an intentionally stale answer, and proves the identical question passes after repair.

### Why it remains

Tumpak still has the cleanest red-to-green causal proof and the lowest ambiguity about whether the model did meaningful work. Its earlier 94/100 estimate is retired: the wider prior-art audit found Giskard/Ragas question generation, HoH/FRESCO temporal evaluation, LangSmith dataset versioning, and provenance/freshness products. The defensible wedge is the complete entity-lifecycle receipt, not invention of freshness testing.

### Kill test

Advance only if the prior source-right, reuse-boundary, user, structured-change, deterministic-failure, identical-rerun, and 90-second-comprehension gates all pass. A prepared failure that a judge cannot inspect is a fail.

## Finalist 3 — CleanRoute

### Product sentence

> For an indie developer using an AI gateway or proxy, CleanRoute proves whether a request traveled through a clean route to a compatible endpoint and quarantines a route that changes or misrepresents the response.

### Demo atom

> The same harmless probe travels through a clean local route and a deliberately tampering local proxy. CleanRoute detects the changed response, displays route and endpoint evidence, quarantines the bad path, and reroutes the next request cleanly.

### Unfair start and new-work boundary

- Worldpool already detects proxy hijacking and site reachability.
- Brainpool already normalizes endpoint shape, liveness, claimed/detected family, and failover.
- TunnelMind can preserve confidence and evidence, but should be optional for the sprint.
- The new work is a per-request attestation and quarantine experience, not a relabeling of either pool.
- Do not claim output-triggered fallback, circuit breaking, hashing, or provider failover as new. The bounded wedge is independently anchored verification of an HTTP-200 response, persistent compatible-endpoint quarantine, controlled re-entry, and an incident receipt.

### Technical kill test

Advance only if a fully local, non-abusive fixture can demonstrate response tampering, quarantine, and clean reroute in under 60 seconds. If model identity becomes the headline, reject: ModelVerify already owns that story. If any demo requires gray-market traffic, real secrets, or uncontrolled third-party endpoints, reject.

The local probe passed this technical kill only. Selection still requires host/reuse eligibility, one user who recognizes the incident, model necessity and three-run stability, production relevance, first-time comprehension, and the already completed comparable screen.

## Fallback

Build Receipt reads repository history and Codex task evidence, then produces a verifiable new-work receipt, rubric map, README block, and demo outline. It activates only if the three finalist gates fail or the host's reuse rule makes them ineligible.

## Decision rule

Do not average taste. Pick the first candidate that:

1. passes every hard rule and data-right gate;
2. produces its complete live state change three times;
3. has one user who recognizes the task;
4. stays legible in 90 seconds;
5. has an honest sentence against the closest current alternative.

If more than one passes, prefer the lower integration risk. If none passes, use Build Receipt. Record the losing gate in [`triage.md`](triage.md); do not silently delete the idea.
