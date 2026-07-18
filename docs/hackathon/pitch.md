# Pitch — Project Daan

Active event narrative (July 18). Two scripts: the platform script if M2 survives the 2:00 amputation checkpoint, the M1 fallback if not. The pitch lane rehearses both, 3/3, before freeze. The Tumpak pitch this file previously held is superseded; recover it from git history if ever needed.

## One sentence

> Daan turns public and community evidence into a scored, auditable receipt for moving through Metro Manila — starting with the question every commuter asks and no app answers: how walkable is this route, right now?

## Demo atom

One route → per-segment evidence receipt (OSM + live weather) → a report from this room lands on the same receipt, karma-weighted → departure-time flip changes the score for an inspectable reason → gaps disclosed, never invented.

## Platform script (~2 minutes)

### 0–12 seconds — hook

> Google tells you this walk takes 22 minutes. It doesn't tell you there's no sidewalk on 480 meters of it, or that at 2 PM today the apparent temperature out there is 41 degrees. This is the walk from [corridor A] — and this is what it actually costs to walk it.

### 12–40 seconds — Module 1 live

> This is Daan. It scores the route segment by segment: road class, sidewalk, crossings from OpenStreetMap; heat and rain from live weather at your departure time. Every score line is a receipt — click this red segment, that's the actual OSM way, that's the tag. And where the data doesn't exist, we say unknown. We score only what we can prove: [coverage]% of this route is covered, and the bar shows exactly where we're blind.

### 40–70 seconds — the platform move (M2/M3, live report)

> But official data is only half of what this city knows. [Teammate] is in the audience with a phone. — [Report submitted: "sidewalk blocked".] — There it is on the receipt: community evidence, dashed pill, weighted by the reporter's karma, clearly labeled as reported, not official. Same engine, second evidence source. Queue states at stations work the same way — a report kind, not a new app.

### 70–90 seconds — time flip + miles (M1/M4)

> Flip departure to 6 AM: apparent temperature drops, the multiplier updates on screen, the verdict changes — for a reason you can inspect, not a vibe. And completing a scored walk earns miles, on your device only. Nothing leaves your phone.

### 90–110 seconds — implementation honesty

> Deterministic code owns every number — the model never grades itself; GPT explains the receipt and is bound to the evidence JSON, nothing else. Codex built this with us today — the task history is in the repo. Prior art exists and we cite it: Walk Score rates addresses in America; Barcelona's Cool Walks does shade in Barcelona; nothing we found scores a Manila route with live weather and an evidence receipt that admits its gaps.

### 110–120 seconds — close

> Daan is one receipt engine with pluggable evidence — official, community, and next: partners and institutions who need this evidence trail. Built today, working end to end. How walkable? Now the city can answer.

## M1 fallback script (90 seconds, if M2 was amputated)

Beats 0–12, 12–40, 70–90 (drop miles line if M4 also cut), then:

> Deterministic code owns the score; GPT explains it and is bound to the evidence JSON. Codex built this with us today. This is Daan's first module — the same receipt engine takes community reports weighted by contributor karma, station queue states, and partner feeds next, without touching the engine. Today: one module, fully working, end to end.

## Likely judge answer

### "Google already does this."

Google gives walking time and distance — its own docs warn walking routes "might sometimes be missing clear sidewalks," and its shade feature exists only as unreleased strings in an APK teardown. It does not expose route quality, live heat, or any evidence receipt. Honest concession: users approximate this today by combining Google Maps with weather and asking Reddit — that manual workflow is precisely the gap.

### "Walk Score?"

Rates an address by amenity proximity, US/Canada/Australia, updates every six months, and by its own documentation ignores sidewalks and weather. It cannot answer "is this route walkable right now" anywhere, let alone in Manila.

### "OSM Manila data is too sparse for this to be real."

Partly true, and the product is built on that truth. Road-class coverage in dense cities is strong (~83% globally, dense cities best-mapped) and carries the base score; sidewalk/crossing/lit tags are bonus evidence when present; when absent, the receipt says unknown and the coverage bar shows it. We measured our demo corridor this morning: [N]% tag coverage — real number, not a hand-wave. The gap is also the flywheel: it's exactly what community reports fill.

### "Why GPT-5.6 — isn't this just data plumbing?"

The model does one job code does badly: turning a segment's evidence bundle into a plain-language explanation a commuter trusts, bound to the evidence JSON with a validation pass that rejects any claim not in the data. The score itself is deterministic — the model never grades itself. Codex is the second model story: it built the product today, and the task history proves it.

### "Karma is trivially gamed."

Today's karma is v0 credibility weighting on a seeded demo — we claim the mechanic, not abuse resistance. The written gate before real scale is an abuse review (fake reports, location spoofing, brigading) and 20 recurring unpaid contributors. Community evidence is capped by weight and always labeled — it can color a receipt, never silently own it.

### "Cold start — who reports?"

The behavior already exists unpaid: r/HowToGetTherePH answers "are there sidewalks, is it safe at midnight" every day in comment threads that evaporate. Daan gives those same people structure, credit, and permanence. That's a bet, stated as one — the receipts are useful with zero community input, which is why M1 stands alone.

### "How is this not sakay.ph?"

Sakay routes transit and assumes the walking legs are fine. We score the walking leg it assumes. Complementary, not competitive — transit legs via GTFS are on the roadmap as a partner path, not a clone path.

### "Business model?"

Free for commuters, always. The thesis — unvalidated, stated as thesis — is institutional: LGU/DPWH dashboards of worst-scored school routes and before/after receipts for sidewalk projects, and partner-sponsored incentives. They'd pay for the evidence trail the free tier generates. No signed partner yet; that's the roadmap gate, not a claim.

### "What does today's demo prove?"

That the receipt engine works end to end on real public data with two evidence sources, on the corridors we prepared. It does not prove citywide coverage, calibrated weights, abuse resistance, or demand. Every weight is visible and version-zero.

## Failure recovery

1. Retry the live request once.
2. If it fails again, state the network failure plainly.
3. Switch to the shipped fixture corridor — the FallbackBanner discloses it on screen; never present cached as live.
4. If live report submission flakes: the seeded reports are already on the receipt — point at one, say "submitted earlier today," continue.
5. Continue with the deterministic receipt and the architecture explanation; the receipt is the product even when the network isn't.

## Freeze rule

After 2:15 PM, change only a defect that blocks the prepared path, submission, or fallback. No new feature enters the pitch. The amputation decision at 2:00 belongs to the integrator; whichever script survives is the one rehearsed 3/3 — with beat 3's fallback (seeded report) rehearsed explicitly.
