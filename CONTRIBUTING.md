# Contributing to Alitaptap

Keep each change narrow, fixture-honest, and verifiable. Alitaptap must show what it knows, what it does not know, and which surface owns each contract.

## Set up

```bash
nvm use
npm ci
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Use `npm run dev:web`, `npm run dev:api`, or `npm run dev:mobile` for the surface you are changing. The mobile workspace requires an Expo development build.

## Make a change

- Open or reference an issue for behavior that needs product judgment.
- Keep one coherent concern per pull request. Do not combine API, mobile configuration, and interface work without a shared acceptance test.
- Follow the repository's singular naming convention, including collection identifiers.
- Preserve the fixture/live boundary and never present unknown evidence as known.
- Do not commit credentials, generated local environment files, or precise personal travel history.

## Verify

```bash
npm run build
npm run typecheck
npm run lint
npm run test
node script/route-flow.mjs # interface changes, after npm run build
```

For an interface change, also check the real flow at a phone viewport and desktop viewport, keyboard operation, reduced motion, console errors, and any URL or persistence contract affected by the change.

## Request review

Complete the pull request template with the exact proof, risks, fixture boundary, and material AI assistance. A passing command is evidence for the command it ran; it is not a substitute for the changed user flow.
