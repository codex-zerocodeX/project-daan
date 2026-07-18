# Convention

## Git and pull request

- Branch from current `main`; use `codex/<short-name>` for Codex-owned work and a short feature/fix branch for human-owned work.
- Pull requests target `codex-zerocodeX/project-daan` `main`.
- Do not push feature work directly to `main`.
- Require the repository CI check and one independent approval before merge.
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `test:`.

## Naming

- Singular everywhere, including collection variable, object key, return value, file name, database table, and SQL alias.
- Component export uses PascalCase; one main component per file.
- TypeScript identifier uses the surrounding code's camelCase; database column uses snake_case.
- Boolean database column uses `is_`; count uses `_count`; measurement unit remains singular.
- Primary key is `{table}_id`; foreign key matches the referenced key exactly.
- Package scope is `@alitaptap/*`.
- Historical migration, event, and design-source names are append-only provenance. Expo `komyut` technical identifiers are compatibility values, not naming precedent.

## Code

- TypeScript stays strict. Contain untyped library boundaries and parse external payload with Zod.
- API response is `{ data }` or `{ error, issues? }`; never leak server internals.
- Server state uses TanStack Query. Mobile UI state uses Zustand. Supabase auth owns its AsyncStorage boundary.
- Screen stays thin; hook owns data; component stays presentational.
- New database shape requires a new migration, explicit RLS policy, shared contract update, and test in the same PR.
- Never rewrite an applied migration.
- Add a failing test before changing API or shared-domain behavior.
