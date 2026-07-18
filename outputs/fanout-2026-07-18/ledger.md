# Daan UX, UI, and GitHub fanout ledger

Date: 2026-07-18

## Control record

- Canonical plan: version 6, approved after five independent advisor reviews.
- Finding ledger: F1–F16 incorporated before execution release.
- Root branch at integration audit: `codex/daan-integration`.
- Root base: `421ebc8 feat: establish canonical Daan identity`, already pushed by a concurrent task. Earlier integration record: `ca320b8` and `32c1abe`.
- This fanout did not commit, push, merge, change repository settings, alter collaborator permission, or modify branch protection.
- A separate OpenAI integration task added uncommitted API, shared-schema, manifest, and lockfile work while this fanout was active. That work was preserved and included in the final repository-wide gate; it is not represented as authored by this fanout.
- A separate walkthrough-recording task created untracked files under `artifact/`. They were preserved and are outside this fanout's scope.

## Handoff

| Lane | Status | Owned file | Lite check | Documentation delta | Behavior evidence | Remaining risk |
| --- | --- | --- | --- | --- | --- | --- |
| URL receipt and route freshness | Complete | `apps/web/src/App.tsx`, `apps/web/src/lib/routeReceiptUrl.ts`, `apps/web/src/lib/routeReceiptUrl.test.ts` | Web typecheck, lint, and unit suite | README and hackathon product record | Origin, destination, departure, route, selected evidence, and community context survive URL restore; draft input clears the old receipt; same-receipt Back restores visible query text | The receipt remains fixture-bounded and is not a live routing claim |
| Interaction and focus | Complete | `apps/web/src/component/RouteSearch.tsx`, `apps/web/src/component/ShareBar.tsx`, `apps/web/src/style/global.css`, `apps/web/src/component/MapCanvas.tsx` | Web lint and production build | `docs/brand-qa.md` | Escape closes suggestion/evidence/community surfaces; outside blur closes suggestions; copy feedback resets; result focus is visible; stale map hint is absent | MapLibre style-image warnings remain upstream/non-blocking |
| Recovery and browser proof | Complete | `apps/web/src/component/ErrorBoundary.tsx`, `apps/web/src/component/ErrorBoundary.test.tsx`, `apps/web/src/main.tsx`, `script/route-flow.mjs` | ErrorBoundary unit suite and Node 22-compatible CDP flow | README command and contribution proof | Production preview at 390 × 844 verifies reload, Back, stale clearing, copy reset, trusted Escape input, focus return, no overflow, and zero runtime/console errors | Error boundaries cannot catch event-handler or async-callback failures |
| GitHub hygiene | Local implementation complete; remote action pending | `.github/CODEOWNERS`, `.github/dependabot.yml`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/*`, `.github/workflows/ci.yml`, `CONTRIBUTING.md`, `SECURITY.md` | YAML parse, diff check, and local CI command parity | README contributor/security links | CI now includes the production route flow locally | Files do not govern GitHub until committed and pushed; repository settings still require admin action |
| Documentation and visual QA | Complete | `README.md`, `docs/brand-qa.md`, `docs/hackathon/*`, `outputs/web-ui-qa/*` | Cross-document command/env/path audit | Current fixture, URL, API, and AI boundaries reconciled | 390 × 844 and 1440 × 1024 captures have no horizontal overflow; automated phone flow has zero console errors | This is tested-matrix evidence, not a WCAG conformance claim |

## GitHub truth snapshot

- Repository: `codex-zerocodeX/project-daan`, private, default branch `main`.
- PR #2 (`codex/daan-integration` → `main`) is open, mergeable, and green at `421ebc8`. Its passing run predates the local workflow/browser-proof additions in this ledger.
- `main` is unprotected. The latest direct-push run on `bdbddd1` failed during `npm ci` because the manifest and lockfile were out of sync; PR #2 contains the reconciled dependency state and passed its existing CI.
- PR #1 is dirty against `main` and mixes three concerns: compose-node correction, Expo EAS linkage, and Cloudflare Worker deployment. Split or rebase it before review instead of merging the mixed stack as one unit.
- All seven remote branches inspected are unprotected.
- All five direct collaborators (`ghost-ily`, `jimsteven`, `CelestialBrain`, `marwie0904`, `joemzkie`) currently have admin permission. Review least-privilege roles with the team; no permission was changed here.
- Merge commit, rebase, and squash are all enabled; merged branches are not auto-deleted.

## Recommended admin handoff

1. Commit the bounded web recovery/proof and governance work, then let the updated CI run on PR #2.
2. Require PR review plus the `checks` job on `main`; block force pushes and branch deletion. Keep an emergency-admin bypass only if the team explicitly wants it.
3. Prefer squash merge for the hackathon branch flow and enable automatic branch deletion after merge.
4. Split PR #1 by concern, then rebase each retained change onto the reconciled `main` line.
5. Review each collaborator role with the team before lowering access; do not guess at ownership from activity alone.
6. After governance files land, confirm CODEOWNERS resolves to `@marwie0904`, Dependabot opens correctly, and both issue forms render.

## Known warning

- The lazy MapLibre bundle is about 1.03 MB minified (about 275 kB gzip), above Vite's 500 kB chunk warning threshold. It remains non-blocking because the map is already lazy-loaded, but it is the clearest performance follow-up.
