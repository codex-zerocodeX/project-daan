# Codex contribution receipt

This document records the material OpenAI Codex-assisted work in **Alitaptap** during OpenAI Build Week Manila on July 18, 2026. It is an evidence trail, not a claim that Codex independently owns, authors, or validates the product.

## Repository provenance

| Record | Reference |
| --- | --- |
| Source repository supplied by the team | [`codex-zerocodeX/alitaptap-v2`](https://github.com/codex-zerocodeX/alitaptap-v2) |
| Source baseline integrated into this repository | [`eed7dd9`](https://github.com/codex-zerocodeX/alitaptap-v2/commit/eed7dd9b0f84b6a22513581ed872bdae0f5ff9fe) |
| Codex integration branch | `codex/daan-integration` |
| Reviewed integration | [`project-daan` pull request #2](https://github.com/codex-zerocodeX/project-daan/pull/2) |
| Conflict-resolution integration tree | [`057b8dd`](https://github.com/codex-zerocodeX/project-daan/commit/057b8ddf1825639bb3eb42fe001f867387c3e18d) |
| Reviewed merge to `main` | [`0557aaf`](https://github.com/codex-zerocodeX/project-daan/commit/0557aafbae774753ae520b0dc0ed43b939242798) |

The linked `alitaptap-v2` repository is the team-supplied mobile/API lineage. This receipt covers the Codex-assisted work integrated and reviewed in `project-daan`; it does not relabel every commit in either repository as Codex work. The source repository later added work outside this receipt, including its `cabe8f1` thread-route-map merge.

## Material improvement

Codex's strongest contribution was turning the supplied application lineage and a standalone web lane into one fixture-honest, testable commuter decision loop.

**Before:** the team had mobile/API foundations and a separately developed web lane, but no single validated repository tree that a judge could run to select a route, compare genuinely different route profiles, inspect score coverage, restore the receipt from a URL, and open route-bound community context.

**Steering and constraint:** the team required a bounded Katipunan fixture instead of invented live coverage; MapLibre could render geometry but could not be described as the routing engine; missing evidence had to remain unknown; community writes had to be labeled browser-local; and every completion claim needed a repeatable build, test, or browser artifact.

**After:** the integrated `apps/web` workspace computes deterministic `shortest_time` and `comfort_balance` paths, exposes the score and evidence gap per segment, preserves the route receipt in the URL, invalidates stale output when an endpoint changes, keeps route-bound community interaction in versioned local storage, and survives a render failure without deleting the receipt. A repeatable 390 × 844 browser flow verifies the prepared path and fails if it encounters a runtime exception or console error.

## Contribution map

| Commit | Codex-assisted outcome | Reviewable evidence |
| --- | --- | --- |
| [`ca320b8`](https://github.com/codex-zerocodeX/project-daan/commit/ca320b84cd4200e9bead4fa88692cb524fe0d1fb) | Integrated the standalone React/MapLibre route workspace into the npm monorepo, including route search, profile logic, evidence receipt, community domain, and tests | `apps/web`, its colocated Vitest suite, and workspace scripts |
| [`32c1abe`](https://github.com/codex-zerocodeX/project-daan/commit/32c1abe1112c9a411a46435fd278d613fd1080f4) | Reconciled product, research, architecture, routing, transport-cost, and event records with the actually runnable boundary | `docs/hackathon`, `docs/routing-architecture.md`, and `docs/brand-qa.md` |
| [`421ebc8`](https://github.com/codex-zerocodeX/project-daan/commit/421ebc8719936da7514f56e91fa01c80c48d9cbd) | Established the shared product identity across web and mobile surfaces and hardened web route-receipt URL recovery | brand contract, web receipt URL tests, API identity test, and mobile configuration |
| [`8a01ea4`](https://github.com/codex-zerocodeX/project-daan/commit/8a01ea44227b747fc11d9be9517ce2546107f731) | Added dependency-free Chrome proof for the phone route flow | `script/route-flow.mjs` |
| [`dd91cde`](https://github.com/codex-zerocodeX/project-daan/commit/dd91cde48c7c6df1c1065a162e5807c833f52723) | Added contribution, security, ownership, issue, pull-request, and dependency guardrails | `.github`, `CONTRIBUTING.md`, and `SECURITY.md` |
| [`549fe9f`](https://github.com/codex-zerocodeX/project-daan/commit/549fe9f0fd7b5be7fea30a4849d6595e31415d78) | Added a schema-bounded, server-only optional route-explanation seam plus a recoverable web error boundary | API route tests, shared Zod contract, error-boundary test, and configuration documentation |
| [`1717c51`](https://github.com/codex-zerocodeX/project-daan/commit/1717c519551cb5565f9c04c691795aa9ca657cdb) | Corrected Escape-key behavior and focus return for the route evidence disclosure | `apps/web/src/App.tsx` and the repeatable route flow |
| [`c1c2935`](https://github.com/codex-zerocodeX/project-daan/commit/c1c29357b45f3c12b63a3955a1e0058b93004f85) | Completed the Project Daan to Alitaptap product rename while preserving explicit compatibility identifiers | 68-file rename diff, API identity tests, storage migration tests, and `docs/alitaptap-migration.md` |
| [`3fbae61`](https://github.com/codex-zerocodeX/project-daan/commit/3fbae616b58b6f2e5d1c77f64522c02e1982fe75) and [`44e8124`](https://github.com/codex-zerocodeX/project-daan/commit/44e8124d124fce95d2982eb84613c6c80f376687) | Preserved the walkthrough and the path-by-path standalone-lane integration disposition | `artifact` and `docs/web-lane-integration.md` |

## Verification contract

Run from the repository root with Node 22 and the locked dependency tree:

```bash
npm ci
npm run build
npm run typecheck
npm run lint
npm run test
node script/route-flow.mjs
```

The command gate proves the checked code path only. For an interface review, also run the real route flow at phone and desktop viewports, check keyboard and reduced-motion behavior, inspect the console, and confirm that changing either endpoint invalidates the old receipt.

## Human direction and accountability

The human team selected the problem, supplied the source repository and local evidence, set the product and licensing boundaries, chose which proposal to accept, reviewed the rendered experience and diff, operated credentials and external services, and approved the merge. Codex assisted with repository inspection, implementation, test creation, integration, documentation, and verification under that direction.

Git commit authorship remains attached to the human operator who reviewed and accepted each change. This receipt discloses material AI assistance; it does not replace human accountability, create legal authorship for the model, or imply that an AI system performed an independent production or safety certification.

## Known boundary

- Web search, route, weather, score, and seeded community evidence remain disclosed fixtures.
- New web community interaction is browser-local and is not shared across a device or account.
- The optional API explanation route is not called by the judging web receipt.
- Mobile, API, web, and the standalone `routing-engine` still represent separate maturity levels; their presence in one monorepo does not make every seam production-integrated.
- Live citywide routing, live conditions, scientific score calibration, abuse resistance, institutional adoption, and production readiness are not claimed.

That boundary is part of the contribution: Codex was used to make a smaller claim inspectable and repeatable, not to inflate a prototype into a live-system story.
