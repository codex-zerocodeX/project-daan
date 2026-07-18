# AGENTS.md — Alitaptap repository reference

Alitaptap is an evidence-first commuter-intelligence platform for the Philippines. Read the [brand contract](docs/brand.md), [architecture](docs/architecture.md), and [convention](docs/conventions.md) before changing a current-facing surface.

## Stack

- npm workspace monorepo, Node 22, strict TypeScript
- `apps/web`: React, Vite, MapLibre GL JS, deterministic fixture receipt, browser-local community state
- `apps/mobile`: Expo Router, MapLibre React Native, TanStack Query, Zustand, Supabase auth/data
- `apps/api`: Hono service for algorithm-shaped and server-authorized work
- `packages/shared` (`@alitaptap/shared`): Zod v4 mobile/API contract
- `supabase/migrations`: append-only PostgreSQL/PostGIS and RLS history
- `routing-engine`: pure prototype, not yet integrated into workspace CI

## Command

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the locked workspace |
| `npm run dev:web` | Start the web receipt |
| `npm run dev:api` | Start API watch mode on port 8787 by default |
| `npm run dev:mobile` | Start Expo development server |
| `npm run build` | Build every workspace with a build script |
| `npm run typecheck` | Type-check all workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Test all workspaces |

## Boundary

- Web score and evidence currently come from disclosed fixtures.
- Mobile route card currently uses mock route/review data.
- MapLibre renders geometry; it is not the routing or evidence engine.
- API/mobile payload must cross `@alitaptap/shared`.
- Supabase service-role key stays only in `apps/api/.env`.
- Expo display name is Alitaptap, but the linked `komyut` slug, scheme, application ID, and EAS UUID remain compatibility identifiers until a separately authorized native migration.
- New identifier, collection, file, and schema name is singular.

## Recipe

- **API endpoint:** route factory under `apps/api/src/routes`, mount in `app.ts`, add shared request/response contract, and write a route test.
- **Mobile screen:** route under `apps/mobile/app`, data hook under `src/hooks`, presentational component under `src/components`.
- **Web domain behavior:** pure function under `apps/web/src/lib` or `module`, with a colocated Vitest test.
- **Database change:** add the next numbered migration with explicit RLS and deletion policy; never edit an applied migration.

## Gotcha

- Mobile needs a development build; Expo Go does not load native MapLibre.
- Physical devices need a LAN-reachable `EXPO_PUBLIC_API_URL`.
- The web MapLibre chunk is currently large; build warning is known and should be handled as a performance task, not hidden.
- `routing-engine` is not yet exercised by the root workspace gate.
