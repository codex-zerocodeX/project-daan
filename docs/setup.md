# Alitaptap team setup

## Prerequisite

- Node 22 (`nvm install 22 && nvm use`)
- Git
- An Expo account and EAS CLI for native development builds
- Android phone/emulator or an Apple development environment

## Install

```bash
git clone git@github.com:codex-zerocodeX/project-daan.git
cd project-daan
nvm use
npm ci
```

Install only from the repository root. Do not create workspace-specific lockfiles.

## Environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

| Variable | Boundary |
| --- | --- |
| `SUPABASE_URL` | API only |
| `SUPABASE_SERVICE_ROLE_KEY` | API only; never expose to mobile or web |
| `PORT` | Optional API port, default `8787` |
| `EXPO_PUBLIC_SUPABASE_URL` | Public mobile configuration |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Public mobile client key |
| `EXPO_PUBLIC_API_URL` | Mobile-reachable API URL; use a LAN address on physical devices |

## Supabase

Apply every file in `supabase/migrations` in numeric order. For a new hosted project, that currently means `0001_initial_schema.sql` followed by `0002_routes_nodes_karma.sql`. Keep the service-role key server-side.

## Run

```bash
npm run dev:web
npm run dev:api
npm run dev:mobile
```

The mobile app uses native MapLibre and does not run in Expo Go.

## Expo development build

The repository is already linked to an EAS project. Verify the authenticated project before building; do not run `eas init` against a different project.

```bash
cd apps/mobile
eas login
eas project:info
eas build --profile development --platform android
```

Development signing uses local credential configuration. `credentials.json`, `credentials/`, native build output, and signing material must remain untracked.

The display name is Alitaptap, while the current slug, scheme, application ID, and EAS UUID remain compatibility identifiers. See the [brand contract](brand.md) before changing native identity.

## Troubleshooting

- **Map is blank:** confirm the device is online and the configured tile source is reachable.
- **Community cannot load:** confirm the API is running and `EXPO_PUBLIC_API_URL` uses a LAN address on physical hardware.
- **Auth fails:** confirm both migrations were applied and the mobile app uses the anonymous key.
- **Workspace binary is missing:** run `npm ci` from the repository root.
