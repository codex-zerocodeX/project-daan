# Buildathon brief

> **Paused strategy snapshot.** This brief preserves the earlier Tumpak plan. The July 14 expanded portfolio audit reopened the decision; [`idea.md`](idea.md) and [`triage.md`](triage.md) now prevail. Do not execute this brief unless Tumpak wins the live finalist gate.

Last verified: July 14, 2026, Asia/Manila

This is the narrative handoff. [`research.md`](research.md) owns the full evidence and finalist pressure test; [`plan.md`](plan.md) owns execution; [`pitch.md`](pitch.md) owns the spoken demo.

## Earlier executive decision — superseded

The earlier recommendation was to build **Tumpak**, a Philippine change-to-test gate for AI agents.

> When an official fact changes, Tumpak generates the question that should now fail, catches an AI answer using the retired fact, and proves the identical question passes after repair.

The prepared demo uses a real PSA update published July 13, 2026:

- Municipality of San Isidro in Davao del Norte became Municipality of Sawata.
- Barangay Sawata became Barangay Poblacion.

That double rename is unusually strong demo material. “Sawata” changes entity role across source version. A stale answer can be fluent, cited, and historically correct while being operationally wrong now.

## Why this selection survived the earlier sweep

The event's equal rubric rewards technical implementation, design, potential impact, and idea quality; technical implementation breaks a tie. Tumpak gives each criterion observable proof:

| Criterion | Live proof |
|---|---|
| Technical implementation | GPT-5.6 semantic change extraction, strict schema, generated impacted question, deterministic assertion, identical rerun |
| Design | One visual sequence: changed source, affected answer, failure, repair, green receipt |
| Potential impact | Prevent a stale official answer before it reaches a student, customer, worker, or citizen |
| Quality of idea | Change-to-test workflow, not another chatbot or generic eval dashboard |

Earlier internal estimate: 94/100, now retired after the expanded prior-art audit. The current Tumpak comparison is 89/100 provisionally; neither score predicts the judge result.

The idea also matches the team's real advantage. BLEAD does not provide 500 novel products. It provides experience with entity lineage, hierarchical resolution, cross-source validation, dated provenance, deterministic checks, replay, and versioned public releases. Tumpak turns those mechanisms into the product.

## What was rejected

- Generic eval dashboard: crowded by LangSmith, Phoenix, Braintrust, DeepEval, Patronus, and others.
- Synthetic test generation alone: Giskard and Ragas already generate question, context, and expected answer.
- Generic university chatbot: existing higher-education assistant and an Ateneo handbook-agent paper make this directly adjacent.
- Generic data-right/governance tool: important but crowded and legally difficult to calibrate in one sprint.
- IP disclosure assistant: directly adjacent and too shaped around the collaborator rather than the published rubric.
- Startup idea validator: BLEAD's startup list can screen categories, not prove novelty, demand, or success.
- Election/map product: the large corpus is an implementation credential, not a reason to build a map.

The 64-concept history and named kill question remain in [`inbox.md`](inbox.md).

## Exact product boundary

### User

A developer or product team operating a Philippine AI agent over official information that changes.

### Job

> When an authoritative source changes, tell me which answer is now dangerous, give me a reproducible failing case, and prove the same question is correct after I update the agent.

### Core workflow

```text
prior official state + current official change
                    ↓
GPT-5.6 structured entity change
                    ↓
generated impacted question and expected constraint
                    ↓
intentionally stale agent answer
                    ↓
deterministic red receipt
                    ↓
bounded update
                    ↓
identical case identifier, green receipt
```

### Model boundary

GPT-5.6 owns work that requires semantic judgment:

- extract before, after, entity type, change type, authority, and effective date;
- distinguish rename, merger, split, retirement, correction, and conflict;
- generate an affected user question;
- propose a bounded repair note.

Code owns work that must be falsifiable:

- current canonical name or entity identifier;
- retired alias rejected as current state;
- required source/effective date present;
- unchanged case identifier across rerun;
- pass/fail and red-to-green transition.

The model never grades itself.

### Smallest complete product

- one prepared PSA source change;
- one intentionally stale answer;
- one structured extraction;
- one generated affected question;
- one deterministic failure;
- one bounded update;
- one identical green rerun;
- one shareable dated receipt.

Only after that works may the team add two more change cases from the same release.

### Non-goal

No account, billing, arbitrary connector, custom benchmark builder, general observability platform, legal advice, map, or automatic production deployment.

## Public-data boundary

The PSA page links the current publication and says site content is public domain unless otherwise stated. The demo should still use only a minimal excerpt with:

- exact source link;
- retrieval and release date;
- expected current state;
- public-domain note;
- no personal data;
- explicit statement of what predates the event.

Do not bundle the BLEAD school registry, company lead, professor review, contact data, or a database dump.

## Four-hour event strategy

The public schedule provides about four hours 20 minutes of sprint time, not eight hours. Assume less after setup, lunch, and interruption.

Gelo owns extraction schema, model call, deterministic assertion, state, test, deploy, and fallback. Rafaello owns visual hierarchy, observer comprehension, narration, screenshot/video, and host clarification. They pair only at the shared gate.

| Gate | Required state |
|---|---|
| 10:45 | Stale answer produces an inspectable red receipt |
| 11:35 | Identical case turns green after bounded update |
| 12:00 | Fresh browser completes the core; local fallback works |
| 1:45 | Three clean timed runs; feature freeze |
| 2:15 | README, Codex task ID, right/secret scan, and backup video complete |
| 2:45 | Submission and demo tab frozen |

If the core is not green, reduce to one case and remove repair prose or secondary panel. Do not add a second product.

## Demo script

### Hook

> Yesterday the Philippine map changed. An AI answer can be perfectly cited and still be one version too old.

### Context

> The PSA renamed San Isidro municipality to Sawata—and renamed the old Barangay Sawata to Poblacion. A stale agent can now confuse which entity Sawata is.

### Product

> GPT-5.6 reads the official change and generates the user question it should affect. Our stale agent answers from the retired state. Deterministic code catches the wrong current name, missing effective date, and stale source. We update the agent and rerun the identical case. It turns green.

### Close

> Tumpak makes “we updated the knowledge base” testable at the answer level. When the official fact changes, prove your AI changed with it.

## Likely challenge

### “Isn't this Giskard plus a diff?”

Synthetic test generation and freshness monitoring already exist. We do not claim those base primitives. The demonstrated workflow connects an authoritative change to entity lineage, an affected user question, a deterministic stale-answer failure, and the identical dated green rerun.

### “You staged the failure.”

Yes, the stale state is intentionally injected and disclosed. That makes the regression reproducible. The source, old/new entity state, case identifier, assertion, and rerun are inspectable.

### “What does one case prove?”

Only that the mechanism works on the prepared public case. It does not prove universal safety, market demand, or statistical accuracy.

### “Why GPT-5.6?”

A token diff sees changed word. The model must understand the double entity-role change and generate the question that becomes dangerous. Deterministic code still owns the verdict.

### “Why Philippine?”

The PSGC release is fresh, public, operational, and entity-ambiguous. It is the first product pack, not a claim that local branding alone creates novelty.

## Open item before build

- Get written host clarification on the local new-work and public-source boundary.
- Get one developer reality check on how source update currently reaches answer regression.
- Verify quota and request the optional build credit before the deadline if needed.
- Freeze the exact PSA excerpt and expected schema.
- Prove the stale assertion red and current assertion green before polishing.

## Pivot

Switch once to **Build Receipt** only if:

- the host disallows the planned source/reuse boundary;
- the exact change-to-test wedge is directly invalidated;
- the deterministic stale-answer case cannot rerun green by Friday night;
- GPT-5.6 remains ornamental;
- the demo atom no longer fits one sentence.

Excitement about a new idea is not a pivot trigger.
