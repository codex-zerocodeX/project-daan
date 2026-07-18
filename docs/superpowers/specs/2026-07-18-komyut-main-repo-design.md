# Komyut — Main Repo Design

**Date:** 2026-07-18
**Status:** Approved (pending final spec review)
**Repo:** https://github.com/codex-zerocodeX/buildathon

## What Komyut is

A community-based commuting platform for the Philippines. Think Waze's community model applied to public-transport routing: users post threads about routes, terminals, bottlenecks, and conditions; an algorithm stitches community knowledge into door-to-door commute routes; voting and karma keep information trustworthy. Differentiator: a **"How walkable?"** feature that scores a route by weather, road infrastructure, sidewalk quality, and distance.

This document specifies the **main repository** — the reference monorepo teammates fork so their AI assistants understand the framework, dependencies, backend, and frontend conventions.

## Goals of this repo (v0)

1. Boots on a teammate's machine with minimal steps (documented in `docs/setup.md`).
2. Contains one working example at every layer (screen, query, endpoint, migration) to pattern-match against.
3. `CLAUDE.md` at the root gives any AI assistant the full stack picture and recipes.
4. Locks in stack decisions so forks don't diverge on fundamentals.

**Non-goals (v0):** the real routing algorithm, karma rules, walkability scoring, image attachments UI, deployment. Seams for all of these exist, but they are later work.

## Stack decisions (with rationale)

| Decision | Choice | Why |
|---|---|---|
| Repo shape | Monorepo, npm workspaces | One fork = whole system visible to teammates' AIs; npm needs no extra tooling and Expo supports workspaces natively |
| Mobile | Expo (latest SDK) + Expo Router | Modern RN default; cloud builds via EAS; file-based routing |
| Maps | MapLibre React Native + OSM tiles | Free; data-driven styling for walkability overlays (per-segment route coloring, heatmaps); requires a one-time EAS dev build per teammate |
| Backend platform | Supabase (Postgres + PostGIS, Auth, Storage) | Relational fit for votes/comments/karma; PostGIS for geo queries; free tier; hosted — no infra work |
| Custom logic | Node API, Hono framework, in `apps/api` | Routing algorithm + karma logic live here; shares TS types with mobile via the monorepo; standard Node patterns are the best AI reference |
| Server state | TanStack Query | Caching/refetching conventions established once |
| Client state | Zustand | Minimal, no boilerplate |
| Validation | Zod, schemas in `packages/shared` | One source of truth for API contracts, used by both app and API |
| Language | TypeScript strict, everywhere | — |
| Tests | Vitest (`apps/api`, `packages/shared`) | Mobile testing deferred, documented as such |
| CI | One GitHub Actions workflow: typecheck + lint + test | Keeps forks honest |

## Repository layout

```
buildathon/
├── README.md                  # what Komyut is + quickstart
├── CLAUDE.md                  # AI reference (see Docs section)
├── package.json               # npm workspaces root; root scripts
├── .nvmrc                     # Node LTS pin
├── .github/workflows/ci.yml   # typecheck + lint + test on PR
├── docs/
│   ├── setup.md               # fork → running app, step by step
│   ├── architecture.md        # system diagram + data flow
│   ├── conventions.md         # branching, PRs, code style, feature recipes
│   └── superpowers/specs/     # design docs (this file)
├── apps/
│   ├── mobile/                # Expo app "Komyut"
│   │   ├── app/               # Expo Router routes
│   │   │   ├── _layout.tsx    # root layout: auth provider, query client
│   │   │   └── (tabs)/
│   │   │       ├── index.tsx  # Map tab
│   │   │       ├── community.tsx
│   │   │       └── profile.tsx
│   │   ├── src/
│   │   │   ├── components/    # MapView wrapper, ThreadCard, etc.
│   │   │   ├── hooks/         # useThreads, useAuth
│   │   │   ├── lib/           # supabase client, api client
│   │   │   └── stores/        # zustand stores
│   │   ├── app.config.ts      # Expo config + MapLibre plugin
│   │   ├── eas.json
│   │   └── .env.example       # EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_API_URL
│   └── api/                   # Hono API
│       ├── src/
│       │   ├── index.ts       # server entry
│       │   ├── routes/        # health.ts, threads.ts, routes.ts
│       │   └── lib/           # supabase service client
│       ├── src/routes/__tests__/
│       └── .env.example       # SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PORT
├── packages/
│   └── shared/                # @komyut/shared
│       └── src/               # types + zod schemas: Thread, Vote, Comment, Profile, RoutePlan
└── supabase/
    └── migrations/            # 0001_initial_schema.sql (+ RLS + PostGIS)
```

## Mobile app (v0 screens)

- **Map tab** — MapLibre map centered on Metro Manila, free OSM raster tiles, one example GeoJSON route rendered as a colored line (demonstrates the overlay pattern that walkability scoring will later drive), user location via `expo-location`.
- **Community tab** — thread list from `GET /v1/threads` via TanStack Query; pull-to-refresh; empty/loading/error states as the reference pattern.
- **Profile tab** — Supabase email/password auth (sign up, sign in, sign out); shows username and karma from `profiles`.

Runs as an **EAS dev build** (MapLibre requires native code; Expo Go won't work). `docs/setup.md` walks through installing the shared dev build — no Xcode/Android Studio needed.

## API (v0 endpoints)

- `GET /health` — liveness.
- `GET /v1/threads` — reads threads from Supabase; response validated against the shared Zod schema.
- `POST /v1/routes/plan` — accepts `{origin, destination}` (lat/lng), returns a **mock** GeoJSON route with a stub walkability score. This is the seam for the real routing algorithm.

Pattern each endpoint demonstrates: Hono route → Zod parse → Supabase query → typed response from `@komyut/shared`. One Vitest example test per pattern.

## Database schema (migration `0001`)

PostGIS extension enabled. All tables have RLS: public read, authenticated users write/update only their own rows.

- `profiles` — `id uuid PK → auth.users`, `username text unique`, `karma int default 0`, `created_at`. Auto-created on signup via trigger.
- `threads` — `id`, `author_id → profiles`, `title`, `body`, `category` (enum: `route`, `terminal`, `hazard`, `walkability`, `general`), `geom geometry(Geometry, 4326) null`, `image_url text null`, `created_at`.
- `votes` — `thread_id`, `user_id`, `value smallint` (+1/−1), `created_at`, unique `(thread_id, user_id)`.
- `comments` — `id`, `thread_id`, `author_id`, `body`, `image_url null`, `created_at`.

Storage: one public bucket `thread-images` (upload policy: authenticated users only).

Team setup: one member creates the hosted Supabase project, runs the migration (SQL editor paste or `supabase db push`), and shares the URL + anon key with the team. Service-role key goes only in `apps/api/.env`.

## Docs

- **`CLAUDE.md`** (root) — stack summary, monorepo map, all commands, conventions, and recipes: *add a screen*, *add an endpoint*, *add a migration*, *add a shared type*. Written for AI consumption: explicit paths, no ambiguity.
- **`README.md`** — product pitch + 5-minute quickstart, links to docs.
- **`docs/setup.md`** — teammate onboarding: fork, clone, install, env keys, dev build install, run.
- **`docs/architecture.md`** — diagram: mobile ⇄ API ⇄ Supabase; where future features plug in.
- **`docs/conventions.md`** — branch naming, PR flow (fork → PR to main), code style, state-management rules (server state = TanStack Query, UI state = Zustand).

## Error handling & testing conventions

- API: Zod parse failures → 400 with issue list; unexpected errors → 500 with generic message (never leak internals); all responses JSON `{data}` or `{error}`.
- Mobile: TanStack Query error states rendered in-component (the Community tab is the reference); Supabase auth errors surfaced inline.
- Tests: Vitest in `apps/api` (route tests with mocked Supabase client) and `packages/shared` (schema tests). CI runs `typecheck`, `lint`, `test` across workspaces.

## Deliverables this session

1. Full scaffold as specified, verified: API boots and tests pass; mobile typechecks and Metro starts.
2. Git init, initial commit, push `main` to `codex-zerocodeX/buildathon`.
3. This design doc committed in-repo and copied to the owner's Obsidian vault.

**Left for the team (documented in setup.md):** create the Supabase project + run migration; run first `eas build` under the team's Expo account; invite collaborators on GitHub.
