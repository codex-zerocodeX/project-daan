## Summary

Describe the user or maintainer outcome and why this change is needed.

## Scope

- [ ] The pull request has one coherent purpose.
- [ ] Unrelated configuration or generated-file changes were removed.
- [ ] Existing user work and fixture boundaries are preserved.

## Proof

List the exact commands and user flow checked. Include a screenshot or receipt when the interface changes.

```text
npm run build
npm run typecheck
npm run lint
npm run test
node script/route-flow.mjs # interface changes, after npm run build
```

## Risk

State rollback concerns, data or permission impact, and anything intentionally left open.

## AI use

Disclose material AI assistance and name the human verification performed.
