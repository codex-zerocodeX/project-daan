# Conventions

## Git / PR flow

- Fork the main repo; branch from `main`: `feat/<short-name>`, `fix/<short-name>`.
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `test:`.
- PRs target `codex-zerocodeX/buildathon` `main`. CI (typecheck + lint +
  test) must pass. Keep PRs to one feature.

## Code

- TypeScript strict. No `any` unless interfacing with an untyped lib -
  contain it at the boundary and parse with zod.
- API responses: `{data}` or `{error, issues?}`. Generic error strings only.
- Server state = TanStack Query. UI state = Zustand. AsyncStorage only via
  the Supabase auth client.
- Screens thin; hooks own data; components presentational.
- New tables/columns = new migration file + RLS policies + shared schema
  update + test, in the same PR.
- TDD for API and shared code: failing test -> implement -> pass -> commit.
  Mobile has no test harness yet (deliberate) - keep logic in hooks so it
  can move under test later.

## Naming

- Files: kebab-case for multi-word (`map-style.ts` exempted where already
  created as `mapStyle.ts` - follow existing names in place).
- Components: PascalCase exports, one main component per file.
- DB: snake_case tables/columns, singular enum type names.
