# CLAUDE.md - AI assistant reference for Komyut

Komyut is a community-based commuting platform (Philippines). Mobile app +
API + Supabase. This file is the map; follow it before exploring.

## Stack (do not substitute)

- npm workspaces monorepo, Node 22, TypeScript strict everywhere
- `apps/mobile`: Expo + Expo Router (file-based), MapLibre React Native + OSM
  raster tiles, TanStack Query (server state), Zustand (UI state),
  Supabase JS (auth + direct table reads/writes under RLS)
- `apps/api`: Hono on @hono/node-server. Owns algorithm-shaped logic only
  (route planning, karma rules). CRUD goes straight from mobile to Supabase.
- `packages/shared` (`@komyut/shared`): zod v4 schemas - the single source of
  truth for API contracts and table row shapes. Use `z.uuid()`, `z.url()`
  (v4 APIs).
- `supabase/migrations`: SQL, applied to the hosted Supabase project manually
  (SQL editor) or via `supabase db push`.

## Commands (run from repo root)

| Command | What |
| --- | --- |
| `npm install` | Install all workspaces |
| `npm run dev:api` | API with watch + .env on :8787 |
| `npm run dev:mobile` | Expo dev server |
| `npm run typecheck` / `lint` / `test` | All workspaces (CI runs these) |
| `npm test -w apps/api` | One workspace |

## Conventions

- API responses: `{data: ...}` or `{error: string, issues?: [...]}`. Server
  errors are generic strings - never leak internals.
- Server state = TanStack Query hooks in `apps/mobile/src/hooks/`.
  UI state = Zustand stores in `apps/mobile/src/stores/`. Never mix.
- Screens live in `apps/mobile/app/` (Expo Router). Keep screens thin;
  logic goes in `src/hooks`, presentational pieces in `src/components`.
- Coordinates: GeoJSON order `[lng, lat]` in geometry; `{lat, lng}` objects in
  API request bodies. `LatLngSchema` validates the latter.
- Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`).

## Recipes

**Add an API endpoint:** create `apps/api/src/routes/<name>.ts` exporting a
factory `(deps: AppDeps) => Hono` (see `threads.ts`), mount it in
`src/app.ts`, add request/response schemas to `packages/shared/src/schemas.ts`,
and write a test in `src/routes/__tests__/` using `fakeSupabase` from
`__tests__/helpers.ts`. TDD: failing test first.

**Add a screen:** add a file under `apps/mobile/app/(tabs)/` (or a new route
group), register it in the nearest `_layout.tsx`. Data via a hook in
`src/hooks/` wrapping TanStack Query.

**Add a table/column:** new numbered file in `supabase/migrations/` (e.g.
`0002_add_x.sql`) - never edit an applied migration. Add RLS policies in the
same file. Mirror the row shape in `packages/shared/src/schemas.ts`.

**Add a shared type:** `packages/shared/src/schemas.ts` + test in
`schemas.test.ts`. Export the inferred type.

**Map overlays:** follow `KomyutMap.tsx` - a `ShapeSource` with GeoJSON whose
feature properties drive layer styling (see the walkability interpolate
expression). Add data to `src/lib/mapStyle.ts` or fetch it via a hook.

## Gotchas

- The mobile app needs a **dev build** (MapLibre is native code) - Expo Go
  will not work. See docs/setup.md.
- `EXPO_PUBLIC_API_URL` must be the machine's LAN IP for a physical phone.
- The Supabase **service role key** lives only in `apps/api/.env`. The mobile
  app uses only the anon key. Never swap them.
- `POST /v1/routes/plan` is a mock straight line - it is the seam where the
  real routing algorithm goes.
- Signup passes `options.data.username`; a DB trigger copies it into
  `profiles.username`.
