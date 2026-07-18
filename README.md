# Komyut

Community-based commuting for the Philippines. Waze's community model applied
to public transport: users post threads about routes, terminals, hazards, and
walkability; an algorithm stitches community knowledge into door-to-door
commute routes; votes and karma keep information trustworthy.

**Core differentiator:** the "How walkable?" feature - routes scored by
weather, road infrastructure, sidewalk quality, and distance.

## Stack

- **Mobile:** Expo (React Native) + Expo Router, MapLibre + OpenStreetMap
- **Backend:** Supabase (Postgres + PostGIS, Auth, Storage) + Hono API (Node)
- **Shared contracts:** zod schemas in `packages/shared`

## Quickstart

```bash
nvm use             # Node 22
npm install
cp apps/api/.env.example apps/api/.env        # fill in Supabase keys
cp apps/mobile/.env.example apps/mobile/.env  # fill in Supabase keys + LAN IP
npm run dev:api     # API on http://localhost:8787
npm run dev:mobile  # Expo dev server (needs the dev build - see docs/setup.md)
```

Full onboarding (Supabase project, EAS dev build, troubleshooting):
**[docs/setup.md](docs/setup.md)**

## Repo map

| Path | What |
| --- | --- |
| `apps/mobile` | Expo app (Map, Community, Profile tabs) |
| `apps/api` | Hono API - routing algorithm + karma logic live here |
| `packages/shared` | `@komyut/shared` zod schemas = API contracts |
| `supabase/migrations` | Database schema (PostGIS, RLS) |
| `docs/` | Setup, architecture, conventions |

## Docs

- [Setup / onboarding](docs/setup.md)
- [Architecture](docs/architecture.md)
- [Conventions](docs/conventions.md)
- [AGENTS.md](AGENTS.md) - reference for AI coding assistants
