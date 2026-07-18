# Daan brand contract

This is the single current-state source of truth for product identity, voice, visual token, and compatibility naming.

## Identity architecture

| Name | Role | Usage |
| --- | --- | --- |
| **Project Daan** | Repository and program label | Use in event, team, and project-history context |
| **Daan** | Product name and wordmark | Use in every current-facing interface, package description, and repository front door |
| **How Walkable?** | Module 1 | Use for the route-quality and evidence-receipt experience |
| **Alitaptap** | Firefly mascot and visual motif | Never present it as a second product name |
| **Lakbay** | Historical source-design reference | May appear only in provenance comments or historical design records |
| **Komyut** | Retired product label | May appear only in history or as a documented technical compatibility identifier |

Canonical promise: **Evidence for the way ahead.**

Functional promise: **Daan helps a commuter decide whether a route is reasonable, then shows the evidence and gaps behind the answer.**

## Voice

Daan is calm, civic, direct, and evidence-first. State the boundary before the claim. Prefer “reported,” “fixture,” “unknown,” and “not yet available” when those are the true states. Avoid superlatives, unexplained scores, generic AI language, or claims that turn a prototype adapter into live evidence.

## Visual token

| Token | Value | Role |
| --- | --- | --- |
| `paper` | `#f8f5ee` | Page and app background |
| `surface` | `#fffdf8` | Raised surface |
| `ink` | `#082c49` | Primary text |
| `ink-soft` | `#586a78` | Secondary text |
| `line` | `#d8ddd9` | Border and divider |
| `brand-navy` | `#082237` | Primary action and mark background |
| `brand-teal` | `#167b76` | Navigation, focus, and evidence accent |
| `brand-gold` | `#e8c547` | Alitaptap glow and coverage accent |

Semantic route state remains separate from the brand palette and must always be paired with text or an icon. The web source is `apps/web/src/style/global.css`; the mobile parity source is `apps/mobile/src/lib/theme.ts`. Both must retain the exact values above.

Typography is **Plus Jakarta Sans** for product copy and **DM Mono** for evidence metadata. Mobile loads both through Expo font packages. Web bundles both through Fontsource; do not depend on an operating-system-only font for brand fidelity.

Geometry uses a 4 px spacing basis, 14 px web card radius, pill chips, and one soft elevation family. Motion must respect reduced-motion preferences.

## Surface contract

| Surface | Canonical value | Implementation source | Parity check |
| --- | --- | --- | --- |
| Web header | Daan · Evidence for the way ahead · How Walkable? | `apps/web/src/component/Header.tsx` | Render and text grep |
| Mobile home header | Daan · Metro Manila | `apps/mobile/app/(tabs)/index.tsx` | Expo render and text grep |
| Mobile native header | Daan · Updates / Daan · You | `apps/mobile/app/(tabs)/_layout.tsx` | Expo config/render inspection |
| Web metadata | Daan — How Walkable? | `apps/web/index.html`, `apps/web/public/manifest.webmanifest` | Production build inspection |
| Expo display name | Daan | `apps/mobile/app.config.ts` | `npx expo config --type public` |
| Expo icon and splash | Alitaptap mark | `apps/mobile/assets/images` | Expo config plus image inspection |
| API identity | Daan API / `X-Daan-Service: api` | `apps/api/src/index.ts`, `apps/api/src/app.ts` | API unit test |
| Package identity | `daan`, `@daan/api`, `@daan/mobile`, `@daan/shared`, `@daan/web` | Each `package.json` | Lockfile and workspace query |
| Repository front door | Daan | `README.md` | README truth check |
| Repository description | Evidence-first commuter intelligence for the Philippines | GitHub repository setting | GitHub API read-back |

No canonical public URL or deployment exists yet, so canonical-link and absolute social-image metadata remain intentionally unset.

## Technical compatibility identifier

The linked Expo/EAS project predates this brand contract. Until a separately authorized native-identity migration verifies store ownership, signing credential, installed development client, and external deep link, preserve these values exactly:

- Expo slug: `komyut`
- URL scheme: `komyut`
- iOS bundle identifier: `ph.komyut.app`
- Android package: `ph.komyut.app`
- EAS project ID: `d3b180aa-d3e2-4737-9b74-e3f3a12e7dfc`

These are compatibility identifiers, not customer-facing brand copy. A future rename must migrate all five surfaces atomically and rebuild the native client.

Applied migration comments, `docs/hackathon`, and `docs/superpowers` are historical records and may retain earlier names. New package, variable, collection, and file names follow the repository's singular naming convention.

## Asset boundary

`apps/web/public/asset/alitaptap-mark.webp` is the current mark, `alitaptap-trail.webp` is the decorative trail, and `daan-spectrum.webp` is the evidence spectrum. The raster source and implementation QA are recorded in [brand QA](brand-qa.md). A transparent vector master, trademark clearance, formal clear-space rule, and social-share image remain open production-brand work.
