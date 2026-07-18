# Komyut - Team Setup

## Prerequisites

- Node 22 (`nvm install 22 && nvm use`), git
- An [Expo account](https://expo.dev) (free) + `npm i -g eas-cli`
- Android phone/emulator or iPhone (physical iPhone needs a paid Apple
  Developer account for dev builds; Android is free - start there)

## 1. Fork and clone

Fork `codex-zerocodeX/buildathon` on GitHub, then:

```bash
git clone git@github.com:<you>/buildathon.git komyut
cd komyut && nvm use && npm install
```

## 2. Env files

```bash
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Get `SUPABASE_URL` / keys from the team's shared Supabase project (ask the
repo owner - Project Settings > API). Anon key goes in the mobile .env,
**service role key only in the API .env**. Set `EXPO_PUBLIC_API_URL` to your
machine's LAN IP (macOS: `ipconfig getifaddr en0`), port 8787.

## 3. Supabase (repo owner does this once)

1. Create a project at supabase.com (free tier), region Southeast Asia.
2. Open SQL Editor, paste all of `supabase/migrations/0001_initial_schema.sql`, run it.
3. Share the project URL + anon key with the team; keep the service key private.

## 4. Run the API

```bash
npm run dev:api
# check: curl http://localhost:8787/health -> {"data":{"status":"ok"}}
```

## 5. Mobile dev build (one-time)

The app uses MapLibre (native code), so Expo Go won't work. Build a dev
client once; after that it's JS-only iteration:

```bash
cd apps/mobile
eas login
eas init            # links the project to your Expo account (repo owner once)
eas build --profile development --platform android
```

Install the built APK on your device/emulator (EAS gives you a QR/link).
Then, day to day:

```bash
npm run dev:mobile   # from repo root; scan the QR with the dev build
```

## Troubleshooting

- **Map is blank:** OSM tiles need network; check the device is online.
- **Community tab shows an error:** is the API running, and is
  `EXPO_PUBLIC_API_URL` your LAN IP (not localhost) for a physical phone?
- **Auth errors:** confirm the migration ran (profiles table + trigger exist)
  and the anon key matches the project.
- **`npm install` weirdness:** delete `node_modules` everywhere and reinstall
  from the root. Never run `npm install` inside a workspace with a lockfile.
