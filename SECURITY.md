# Security policy

## Report a vulnerability

Do not open a public issue for a vulnerability or include credentials, personal location history, or exploit detail in an ordinary pull request.

Use the repository's private [security advisory form](https://github.com/codex-zerocodeX/project-daan/security/advisories/new). Include the affected workspace, impact, smallest safe reproduction, and a proposed mitigation if available.

## Supported code

Security fixes target the current `main` line. The web fixture and browser-local community repository are demo surfaces; the API, mobile client, Supabase policy, authentication boundary, and dependency chain still require the same responsible-disclosure process.

## Sensitive data

- Never commit Supabase service-role keys or local `.env` files.
- Do not attach precise personal route history to an issue.
- Treat anonymous device identifiers and community reports as user data.
- Keep location collection opt-in, minimized, and bounded to the documented feature.
