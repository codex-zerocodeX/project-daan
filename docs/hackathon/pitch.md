# Pitch — Project Daan

> **Historical naming note.** This July 2026 record uses **Project Daan**, the internal codename at the time. The current product and codebase name is **Alitaptap**.

Active judge-facing narrative, July 18, 2026. This script follows the runnable checkout: a disclosed Katipunan fixture, deterministic route/profile logic, inspectable scoring, visible unknowns, and local community interaction. Live citywide routing, live weather, a shared backend, GPT explanation, Miles, and partner feeds are roadmap items—not demo claims.

## One sentence

> Google tells a commuter how long a walk takes. Daan helps them decide whether that walk is reasonable—and shows the evidence and the gaps behind the answer.

## Demo atom

Choose A → B → compare the available route choices → open the score and coverage receipt → inspect the harshest or least-known segment → switch 2 PM to 6 AM → open one route-bound community answer.

## Before the demo

- Say **“disclosed Katipunan fixture”** before showing the score. Do not wait for a judge to infer it from the fallback banner.
- Open the prepared A → B path and verify that the score, map, route choice, segment receipt, and community panel render.
- Have one concrete Codex artifact ready: a task/diff showing a material improvement, the team's steering, and the resulting behavior.
- Never say live OSM, live weather, real-time report, production backend, GPT explanation, citywide coverage, calibrated science, or institutional traction.

## Primary script (~90 seconds)

### 0–12 seconds — problem

> A Metro Manila commuter can know that a walk takes 22 minutes and still not know whether the walk is reasonable. Is the route exposed, hard to cross, or simply undocumented? Daan answers that decision—not just the ETA.

### 12–25 seconds — boundary and working state

> This build runs on a disclosed Katipunan fixture so you can inspect the complete product loop today. I choose an origin and destination, and Daan computes the available path choices on a local graph instead of showing a painted mockup.

### 25–50 seconds — receipt

> Here is the route score, but the number is not the product by itself. The coverage bar shows how much evidence is known. Each segment exposes the factor, source label, score effect, and unknown state. Missing evidence contributes zero; Daan does not quietly turn absence into safety.

Open the harshest segment, then one unknown-heavy segment. Let the visual receipt carry the explanation.

### 50–65 seconds — product judgment

> We built two route profiles only when they produce meaningfully different paths. That was a deliberate cut: prove one trustworthy decision loop before pretending to cover the whole city. The receipt contract stays the same when licensed live adapters replace the fixtures.

### 65–78 seconds — time and community context

> Switching from 2 PM to 6 AM changes the disclosed weather fixture and recomputes the result. Below it, commuter questions, answers, replies, votes, and place reviews stay attached to this exact path. Community evidence is visibly reported, never disguised as official.

### 78–90 seconds — Codex proof and close

> Codex materially improved [name one concrete behavior] today: we gave it [constraint or failing case], reviewed [artifact], and the shipped result is [visible outcome]. Daan's proof today is bounded but complete: a commuter can make a route decision, inspect why, and see what the product still does not know.

## Panel-aware question preparation

These are communication lenses from the team's onsite panel report, not private scoring criteria.

### App builder / Bryl Lim

**“What is technically real?”**

The A → B search, heap-backed Dijkstra profiles, route identity, alternative selection, score/coverage rendering, segment interaction, URL state, community domain logic, voting, nested reply, review matching, and local persistence run in the current app. The graph and evidence are fixtures. The architecture seam is the stable route/receipt contract; live adapters remain unbuilt.

**“Why not just Google Maps?”**

Google solves navigation and ETA. Daan's narrow job is route-quality judgment with an inspectable receipt and explicit unknowns. Today we prove that interaction on a bounded fixture; we do not claim a production competitor to Google Maps.

**“What did you cut?”**

We cut live geocoding/routing/weather, shared backend sync, GPT narration, Miles, and partner intelligence from the judged claim. Shipping a coherent fixture-backed loop scores Product Judgment more honestly than presenting disconnected integrations as complete.

### Journalist / fact-checking lens

**“Why should anyone trust the score?”**

They should not trust a naked score. Every segment shows the evidence state and effect; unknown stays unknown, and reported community context is visually distinct from official or fixture evidence. The weights are version-zero heuristics, not calibrated science.

**“Could a community report be wrong?”**

Yes. The current build demonstrates labeling, route binding, voting, and credibility weighting—not abuse resistance. A production release requires identity/Sybil controls, moderation, recency rules, and field validation. We do not let a report silently become official fact.

**“Is the weather or OSM data live?”**

No. The running build uses disclosed fixtures shaped like the intended adapters. That boundary is visible in the interface and stated in the pitch.

### TBI/TTO / commercialization lens

**“Who adopts this first?”**

The first user is a commuter or student choosing whether to walk a familiar corridor. The first institutional hypothesis is a campus or LGU using aggregated route receipts to prioritize field validation. That is a hypothesis, not traction; the next gate is live licensed data plus 50 organic route checks.

**“What is defensible?”**

Not the score formula alone. The potential asset is a disciplined evidence contract plus route-bound local observations that remain attributable and uncertainty-aware. It becomes defensible only if contributors return and an institution validates the data's decision value.

**“What must happen before commercialization?”**

Benchmark live routing coverage, clear every data right, calibrate weights with field observation, complete privacy and abuse review, validate recurring commuter use, and secure one design partner. Do not quote a revenue forecast without those gates.

### David Marquez / Codex lens

**“Show one thing Codex materially improved today.”**

Use this structure and replace every bracket before presenting:

> We asked Codex to [specific task] under [specific constraint]. Its first result exposed [failure or trade-off]. We steered it with [test, evidence, or product decision], and this [diff/test/interaction] is the material improvement: [observable before → after].

Strong candidates are route-profile correctness, deterministic community-state behavior, URL-state recovery, or the fixture-honesty correction—whichever has the clearest artifact. Do not answer with tool volume, token count, or “it wrote the app.”

## Official-rubric self-check

| Gate or criterion | Evidence to show | Claim to avoid |
|---|---|---|
| Clean Start | Event-day task/commit/diff boundary | Reusing pre-event application work |
| Runs Live | Prepared path completes without narration covering a failure | “Production-ready” |
| Claims Have Evidence | Fixture banner, receipt, tests, source ledger, Codex artifact | Upgrading a fixture or plan to live behavior |
| Codex Craft | One material improvement plus visible steering/evaluation | “Codex built everything” |
| Product Judgment | One complete loop; explicit cuts and next gate | Feature-count pitch |
| Problem & Insight | The walk-or-ride decision and why ETA is insufficient | Unverified market size or universal novelty |

## What today's demo proves

It proves that a commuter can select a bounded route, compare computed choices, inspect a deterministic score and its evidence coverage, see unknowns, change a departure-time fixture, and use route-bound community discussion. It does not prove citywide data coverage, live conditions, scientific calibration, abuse resistance, institutional demand, or a production business.

## Failure recovery

1. If place selection fails, reset to the prepared Katipunan origin and destination.
2. If the selected route state is stale, use the visible route choice rather than debugging the URL on stage.
3. If the map tile fails, continue with the score, coverage bar, and segment receipt; state that the base-map canvas failed while route logic remains local.
4. If local community state is polluted, open a private browser or clear only the app's versioned local state before the judging session—not during the pitch.
5. Never switch the narration to an unbuilt live-data story to cover a visual failure.

## Freeze rule

After rehearsal begins, change only a defect that blocks the prepared path, official submission, or Codex proof artifact. The same fixture-honest wording must appear in the spoken pitch, README, submission description, and any demo video.
