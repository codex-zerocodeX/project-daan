# Triage

## Host question

| Priority | Question | Owner | State | Decision affected |
|---:|---|---|---|---|
| 1 | Is the local prize based only on work completed on site, or any eligible work from July 13–21? | Rafaello | Open | Code start and reused work boundary |
| 2 | May a team consume an existing team-owned public API or a small rights-cleared public fixture if the application and judged user loop are new and the reuse boundary is documented? | Rafaello | Open | All repo-derived finalist eligibility |
| 3 | Must the product call GPT-5.6, or is substantial Codex use during development sufficient? | Rafaello | Open | Core architecture |
| 4 | What is the live-demo duration, and is a backup recording permitted? | Rafaello | Open | Pitch and fallback |
| 5 | Who judges the Manila prize, and does the local entry also require Devpost? | Rafaello | Open | Submission and Q&A |

## Immediate operation

| Priority | Item | Owner | State | Acceptance evidence |
|---:|---|---|---|---|
| 1 | Verify remaining credit and request the optional USD 100 build credit if needed | Gelo | Open | [`receipt/quota-check.json`](receipt/quota-check.json) records the account state and acknowledgement if required |
| 2 | Run one target-user reality check | Rafaello | Open | [`receipt/target-user-reality.json`](receipt/target-user-reality.json) records the permission-safe workflow, failure, workaround, and cost |

## Idea triage

The structured expansion added 50 entries but promoted none automatically. The July 14 paper cut reduced them to ten, researched the survivor, and kept Flashcard Expiry as the only expansion challenger.

| Idea | State | Decision reason | Re-open condition |
|---|---|---|---|
| Flashcard Expiry | Technical pass; expansion challenger | Synthetic fixture expired only the affected card, preserved the other card, repaired, and repeated identically three times | One student or teacher recognizes the failure; real-source right and narrower comparable gate pass |
| Saan Tayo? | Technical and comparable pass; finalist | Five PSA indicators joined across 1,583 municipalities; the weight change moved the top-ten order; direct alternatives and bounded wedge are recorded | Observer, user, model-necessity, host/reuse, and Maphy event-authorization gates pass |
| Tumpak | Technical and comparable pass; finalist | Public PSA case failed stale state and passed the identical repaired case; direct prior art lowers the idea-quality score | User, model-native extraction/stability, comprehension, and host/reuse gates pass |
| CleanRoute | Technical and comparable pass; finalist | Harmless local fixture detected mutation, quarantined the proxy, rerouted cleanly, and current alternatives narrowed the claim | User, model necessity/stability, production relevance, comprehension, and host/reuse gates pass |
| Xedoc Lens | Hold | Dogfoods the strategy and repo inventory, but risks generic idea-validator/meta-tool framing | It changes a decision for a non-hackathon user and beats a plain prompt visibly |
| Bukas Pa? | Hold | Clear student pain and existing verifier substrate, but verified opportunity matching is crowded | One official-source user case exposes a gap the current matcher products do not cover |
| Packet Ready | Hold | Strong visual and practical Philippine form asset, but the primitive is well established | Completeness receipt is objectively testable and distinct from AI form fill |
| Mind Mirror | Hold | Emotionally legible and TunnelMind-native, but direct current products are abundant | Twin's real-export coherence test passes |
| Build Receipt | Fallback | Lowest completion risk and can dogfood its proof | All finalist gates fail or reuse rule invalidates them |
| Agent Fence | Rejected for Saturday | Direct competitors plus security integration breadth | A later event provides more time or a uniquely local failure case |
| Budget Basket | Rejected for Saturday | Existing Presyo work plus dense local prior art | A non-comparison user job and fresh data right are validated |
| VANTAGE patent directions | Quarantined | Active patent and ownership boundaries are not cleared; AIPO adjacency increases conflict risk | Written permission and clean ownership/disclosure boundary |

## Active risk

| Priority | Risk | Early signal | Owner | Response |
|---:|---|---|---|---|
| 1 | Local rule invalidates pre-event application work | Host says on-site-only | Both | Keep research; start eligible code at kickoff |
| 1 | Candidate source lacks event/publication right | Exact upstream right, aggregator term, attribution, or needed maintainer/host authorization is absent | Gelo | Obtain written authorization or replace with a self-authored synthetic source and disclose it |
| 1 | Deterministic assertion is not green | One-change slice cannot fail stale state and pass current state by Friday night | Gelo | Fire Build Receipt pivot |
| 2 | Product resembles a generic eval tool | Demo discusses score/dashboard more than authoritative change and affected answer | Rafaello | Return to change → question → failure → proof story |
| 2 | GPT-5.6 is ornamental | Removing the model preserves user value | Gelo | Redesign the structured answer or repair job |
| 2 | Demo path depends on network | First call exceeds 12 seconds | Both | One retry, then disclosed local/recorded fallback |
| 2 | Impact story is invented | No target user recognizes the failure | Rafaello | Narrow the user or remove the demand claim |
| 2 | Prepared failure looks staged | Judge cannot inspect why the stale answer fails | Both | Expose exact public source, case identifier, deterministic assertion, and unchanged rerun |
| 3 | New feature enters after freeze | Work is not tied to a failed acceptance test | Both | Reject or revert it |

## Pivot trigger

Activate Build Receipt only if every finalist is removed by its written gate or a host rule. For each finalist, remove it when any condition is true:

- the host disallows its public source, API, fixture, or reuse boundary;
- the complete state change cannot run three times by Friday night;
- GPT-5.6 is ornamental to the user value;
- the demo atom cannot be explained in one sentence;
- a current direct product owns the exact loop and the team cannot state a truthful user-visible difference;
- the data-right or safety boundary cannot be demonstrated.

Do not relock because an idea sounds exciting. Relock because it passes first.

## Decision log

Newest decision is first. The stable identifier preserves order when several decisions share a date.

| Decision ID | Date | Decision | Evidence | Owner |
|---|---|---|---|---|
| D-012 | July 16, 2026 | Require eight typed decision receipts and refuse product instantiation until the complete dependency set and decision lock pass | `npm run receipt`; event `receipt/`; guarded `script/instantiate.mjs`; all current external evidence remains pending | Gelo |
| D-011 | July 14, 2026 | Record Saan Tayo?, Tumpak, CleanRoute, and Flashcard Expiry as technical passes without selecting a product; record the three-finalist comparable screen as passed | `npm run gate`; live `npm run probe:saan-tayo` joined 1,583 municipalities; `research.md` and `source.md` name current alternatives and bounded distinctions; each receipt states its unproven boundary | Gelo |
| D-010 | July 14, 2026 | Keep Flashcard Expiry as the sole expansion challenger; do not promote it yet | Ten-entry paper cut, screen of current comparables, and synthetic three-run fixture; human and real-source gates remain | Gelo |
| D-009 | July 14, 2026 | Expand the inbox from 84 to 134 captured entries without changing the finalist set | Five ten-idea lenses, each with a named user loop and falsifiable first kill test | Gelo |
| D-008 | July 14, 2026 | Quarantine VANTAGE bricolage, cross-domain matching, and confidential prior-art directions | VANTAGE Slack export records active patent work; ownership and event-disclosure permission are not established | Gelo |
| D-007 | July 14, 2026 | Retire Tumpak's 94/100 estimate and record 89/100 provisionally | Giskard/Ragas generation, LangSmith versioning, HoH/FRESCO temporal research, and provenance/freshness products narrow the idea-quality claim | Gelo |
| D-006 | July 14, 2026 | Reopen the Tumpak lock; promote Saan Tayo?, Tumpak, and CleanRoute to live-gated finalists | Full Easyresume 49-project-description audit, TunnelMind/Twin live-state audit, 686-card AppBuildersPH screen, and direct-comparable search | Gelo |
| D-005 | July 14, 2026 | Sharpen Tumpak from generic operational eval to authoritative change-to-test | Fresh July 13 PSA double rename, 64-concept sweep, adjacent-product and temporal-RAG research | Both |
| D-004 | July 14, 2026 | Use BLEAD as an internal screen, not a novelty oracle or public dump | Startup file has only six descriptive fields; right differs by source | Gelo |
| D-003 | July 14, 2026 | Treat Apple, 200 entrants, and local judge identity as unverified | No reviewed official source confirmed them | Gelo |
| D-002 | July 14, 2026 | Superseded: select Tumpak and designate Build Receipt as the only pivot | Earlier internal rubric comparison; superseded by D-006 after the expanded portfolio audit | Both |
