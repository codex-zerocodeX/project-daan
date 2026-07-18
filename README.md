# Daan

Daan is an evidence-first commuter-intelligence platform for the Philippines. It helps a commuter decide whether a route is reasonable, then shows the evidence and gaps behind that answer.

## Quick start

```bash
nvm use
npm ci

cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env

npm run dev:web
```

The web workspace opens the complete fixture-bounded Katipunan route-receipt loop. Run the API and mobile workspace separately when working on the shared-backend path:

```bash
npm run dev:api
npm run dev:mobile
```

The mobile app uses native MapLibre and requires an Expo development build; Expo Go is not supported. See [team setup](docs/setup.md).

## Current product surface

| Surface | Current state | Boundary |
| --- | --- | --- |
| `apps/web` | Route search, two deterministic route profiles, MapLibre canvas, score and evidence receipt, route-bound community interaction | Local Katipunan graph, disclosed fixtures, and browser-local writes |
| `apps/mobile` | Expo route discovery, route detail, community, profile, Supabase auth, and native/web map surface | Route and review cards still use mock data; shared service behavior remains under development |
| `apps/api` | Hono health, thread, route-plan, and compose seams | Requires Supabase for stored community data; route planning is not yet the web receipt engine |
| `packages/shared` | Zod request, response, and row contracts | Covers the API/mobile path, not the web fixture domain |
| `supabase/migrations` | PostGIS, auth/profile, thread/comment/vote, route/node, and karma schema | Apply in numeric order to the team Supabase project |
| `routing-engine` | Pure in-memory transport-routing prototype | Not wired into an application workspace or CI yet |

The current web build does **not** claim live citywide routing, live weather, scientific calibration, server-synced community evidence, rewards, or institutional adoption. The fixture boundary is visible in the interface and documented in the [event product record](docs/hackathon/README.md).

## Configuration

| Variable | Workspace | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | API | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | API | Server-only service credential; never expose it to a client |
| `PORT` | API | Optional API port; defaults to `8787` |
| `EXPO_PUBLIC_SUPABASE_URL` | Mobile | Public Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Mobile | Public anonymous client key |
| `EXPO_PUBLIC_API_URL` | Mobile | Reachable API URL; use the development machine's LAN IP on a physical device |

The web workspace reads no environment variable.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev:web` | Start the Vite web app |
| `npm run dev:mobile` | Start the Expo development server |
| `npm run dev:api` | Start the Hono API with `.env` |
| `npm run build` | Build every workspace that provides a build script |
| `npm run typecheck` | Type-check every workspace |
| `npm run lint` | Lint every workspace |
| `npm run test` | Run every workspace test suite |

## Repository map

| Path | Responsibility |
| --- | --- |
| `apps/web` | Daan's fixture-bounded web receipt and community experience |
| `apps/mobile` | Expo client and native map experience |
| `apps/api` | Hono service for algorithm and stored-community seams |
| `packages/shared` | `@daan/shared` API and row contract |
| `supabase/migrations` | Append-only PostgreSQL/PostGIS schema history |
| `routing-engine` | Unwired pure routing prototype |
| `docs` | Setup, architecture, brand, convention, and historical event record |

## Reference

- [Brand contract](docs/brand.md)
- [Architecture](docs/architecture.md)
- [Setup](docs/setup.md)
- [Convention](docs/conventions.md)
- [Routing decision](docs/routing-architecture.md)
- [Visual QA record](docs/brand-qa.md)
- [Hackathon product record](docs/hackathon/README.md)
