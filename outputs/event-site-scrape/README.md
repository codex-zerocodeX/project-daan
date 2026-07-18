# OpenAI Build Week Manila event-site scrape

Source: <https://build-week-manila-ateneo-2026.dayvough.chatgpt.site/>

Captured: July 18, 2026 (Asia/Manila)

This is a bounded, same-origin archive of the public event website. It includes every page linked by the site's own navigation, the embedded 3D wayfinder, all first-party static files referenced by those surfaces, and the React Server Component payload for each main route.

## Human-readable extraction

| File | Surface |
|---|---|
| [home.txt](home.txt) | Home page, agenda, speaker, Buildathon rule, credit/submission instruction, and all six FAQ answers |
| [getting-there.txt](getting-there.txt) | Venue, external direction link, arrival plan, and packing list |
| [judging.txt](judging.txt) | Full judging copy, including every score anchor and tie-break rule |
| [wayfinder.txt](wayfinder.txt) | Static wayfinder interface copy |
| [judging-guide.md](judging-guide.md) | Clean structured transcription plus Project Daan implications |

## Raw archive

The `raw/` folder contains 30 first-party files totaling 3,023,049 bytes:

- Three server-rendered HTML pages: `/`, `/getting-there`, and `/judging`.
- Three corresponding RSC payloads: `/.rsc`, `/getting-there.rsc`, and `/judging.rsc`.
- One shared stylesheet and six shared JavaScript chunks.
- One header image and eleven local Geist/Geist Mono font files.
- The complete `/wayfinder/` application: HTML, app code, campus data, MapLibre code, and MapLibre CSS.

[receipt.sha256](receipt.sha256) records a SHA-256 digest for every raw file.

## Route map

| Public route | Status | Content |
|---|---:|---|
| `/` | 200 | Home, agenda, speaker, event rule, credit/submission detail, networking prompt, FAQ |
| `/getting-there` | 200 | Venue and arrival guidance; embeds `/wayfinder/index.html` |
| `/judging` | 200 | Eligibility gate, three equally weighted criteria, score anchor, calibration, tie-break |
| `/wayfinder` | 307 | Redirect to `/wayfinder/` |
| `/wayfinder/` | 200 | Standalone interactive 3D campus wayfinder |

The Facebook tracking query on the supplied URL is not needed; `/judging` returns the same page directly.

## Technical finding

- The main site is a vinext/Vite React Server Component build served through Cloudflare.
- The judging surface has no form, authentication requirement, analytics integration, or custom application API.
- No browser warning or error was logged while rendering any inspected route.
- The wayfinder is intentionally self-contained: its campus polygon, road, parking, walking, driving, and food-route data live in `raw/wayfinder/campus-data.js`; `raw/wayfinder/app.js` uses local in-memory GeoJSON. It does not call an application backend.
- The public origin has no `robots.txt`, `sitemap.xml`, web manifest, or favicon; each returned 404 during the capture.
- The inspected HTML contains no canonical URL, Open Graph metadata, or Twitter Card metadata.
- External links to Google Maps and the Ateneo campus map are recorded but were not mirrored because they are outside the requested website's origin.

## Reproduction

The raw HTML and asset URL are preserved exactly as served. To verify the archive without trusting filenames:

```bash
cd /Users/angelonrevelo/Antigravity/project-daan
shasum -a 256 -c outputs/event-site-scrape/receipt.sha256
```

