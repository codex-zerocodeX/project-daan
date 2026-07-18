# Alitaptap rename compatibility record

Alitaptap is the current product and codebase name. **Project Daan** was the internal codename used during the July 2026 build event and remains in dated records where removing it would erase useful history.

## Canonical identity

- Product and display name: `Alitaptap`
- Root package: `alitaptap`
- Workspace scope: `@alitaptap/*`
- API response header: `X-Alitaptap-Service: api`
- Browser state keys: `alitaptap.community.v1` and `alitaptap.contributor.v1`

## Retained compatibility identifier

| Identifier | Reason |
| --- | --- |
| Local directory `/Users/angelonrevelo/Antigravity/project-daan` | Active worktree and tooling path; renaming requires coordination outside source control |
| GitHub repository `codex-zerocodeX/project-daan` and its remote URL | External repository setting; local text changes cannot complete the migration |
| Branch names containing `daan` | Existing collaboration references; Git history and refs are not rewritten in this batch |
| Expo slug and URL scheme `komyut` | Existing native/deep-link identity |
| iOS and Android identifier `ph.komyut.app` | Store, signing, and installed-client continuity |
| EAS project `d3b180aa-d3e2-4737-9b74-e3f3a12e7dfc` | Existing OTA/build project |
| Cloudflare `komyut-*` identifiers on the deployment branch | External deployment continuity; not present in this branch snapshot |
| `daan.community.v1` and `daan.contributor.v1` | Legacy browser state is copied forward only when the canonical key is absent; legacy values are never changed or deleted |
| `X-Daan-Service: api` | Deprecated response alias emitted beside the canonical header during the compatibility period |
| `DAAN_CHROME_PATH` | Deprecated route-flow environment fallback; new configuration uses `ALITAPTAP_CHROME_PATH` |
| `apps/web/public/asset/daan-spectrum.webp` | Legacy binary asset filename retained until the canonical design archive is re-exported |

Canonical browser state always wins when both key generations exist. New writes target only `alitaptap.*`. The legacy API header and route-flow environment name may be removed only in a separately announced breaking cleanup.

The GitHub repository, worktree directory, native identifiers, EAS project, and deployment names require coordinated external migrations and are intentionally unchanged here.
