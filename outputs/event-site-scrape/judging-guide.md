# Judging guide

Source: <https://build-week-manila-ateneo-2026.dayvough.chatgpt.site/judging>

## Format

- Five finalist projects demo.
- Four judges score independently.
- Three criteria carry equal weight.
- Each judge awards only `10`, `8`, `7`, or `5` on each criterion.
- Maximum: 30 points per judge.

## Eligibility gate

Eligibility is pass/fail and worth zero points. Functionality is a gate, not a scored bonus.

1. **Clean start.** Ideas and teams may exist beforehand. Code, prototypes, design artifacts, and project work begin on Saturday.
2. **Runs live.** The project itself must run during review. A video, slide deck, or mockup cannot replace the working build.
3. **Claims have evidence.** A feature or Codex contribution that cannot be shown is scored as though the claim was never made.

## Criterion 1: Codex Craft

Question: Did the team use Codex deeply, appropriately, and demonstrably, not merely as one-shot code generation?

Judges look for specific artifact, session, decision, steering, failure recovery, and visible payoff. Breadth matters only when it served the work.

| Score | Anchor |
|---:|---|
| 10 | Codex materially shaped several meaningful parts of the build. The team shows strong evidence, explains its steering, and chose capabilities because they fit the task. |
| 8 | Codex carried substantial work across the build, including purposeful use beyond routine generation. Concrete evidence shows a clear payoff. |
| 7 | Codex contributed meaningfully, but mostly through routine or one-shot use. Evidence is limited or the team's steering is difficult to see. |
| 5 | Codex use is thin, incidental, or only asserted. The team cannot identify a specific contribution and visible result. |

Named examples include planning, research, coding, debugging, testing, review, terminal work, parallel agent, and visual or multimodal input.

## Criterion 2: Product Judgment

Question: Did the team choose the right scope and turn it into one coherent, complete core experience?

Judges look for a clear job, deliberate priority, sensible boundary, and cuts that protect the core experience.

| Score | Anchor |
|---:|---|
| 10 | Exceptionally focused and coherent. The team made excellent cuts and completed the experience that matters most. |
| 8 | A complete, well-chosen core experience with sensible boundaries. Secondary work supports rather than distracts. |
| 7 | A usable core exists, but scope or priority feels somewhat scattered. Several choices compete for attention. |
| 5 | The pieces exist but do not form a coherent product experience. The team built around the core instead of completing it. |

## Criterion 3: Problem & Insight

Question: Is the project grounded in a specific problem and audience, with a thoughtful or non-obvious approach?

Judges look for a named audience, evidence or firsthand knowledge, a solution aimed at the cause of the pain, and choices that are right rather than merely different.

| Score | Anchor |
|---:|---|
| 10 | A specific audience and pain are backed by evidence or firsthand knowledge. The solution addresses the cause, with a non-obvious choice the team can defend. |
| 8 | A real problem, plausible audience, and solution that clearly addresses it. The project's distinct angle survives questioning. |
| 7 | The problem is broad or generic. The solution is reasonable but interchangeable, and answers about the user stay abstract. |
| 5 | The problem is asserted rather than grounded. It feels like technology looking for a use, with no clear answer to who needs it and why. |

## Judge process

1. Watch the demo and ask every team: **“Show us one thing Codex did today that materially improved this project.”**
2. Record a provisional score for all three criteria immediately after the pitch.
3. After all five teams, revise only your own score against the written anchors. Judges do not negotiate a shared score.

A `7` is honorable finalist work. An `8` is clearly above the finalist bar. A `10` is exceptional and should be rare. A `5` means the criterion was weak or not demonstrated.

Judges are told not to reward presentation charisma, polished slide, team size, prior experience, huge scope, feature count, or trendy technology by itself.

## Tie-break

1. Higher combined Codex Craft score.
2. More `10` scores across all judge scores.
3. More `8` scores.
4. If still tied, the head judge's ranking recorded before totals were revealed.

## Direct implication for Project Daan

- **Lead with one coherent route-receipt job.** The platform framing and extra module can help only when each visibly strengthens that job. Competing surfaces create a direct Product Judgment penalty.
- **Show the working build before describing expansion.** Live functionality only clears eligibility; it does not add bonus points.
- **Prepare one concrete Codex before/after proof.** The required question asks for one material improvement made today. A short artifact chain—problem, steering, failed attempt, correction, visible result—is stronger than a list of tools.
- **Name the commuter and the pain.** Ground the route-receipt decision in the specific audience, evidence, and firsthand constraint already documented in the repo; avoid broad “everyone who commutes” language.
- **Keep every claim demoable.** Fixture-backed behavior must be labeled as fixture-backed. Do not imply live routing, live reporting, account state, or rewards unless the running build proves them.

