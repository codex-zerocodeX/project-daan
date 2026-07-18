# Alitaptap visual QA

## Evidence

- Repeatable web interaction proof: `node script/route-flow.mjs`
- Final web mobile capture: `outputs/web-ui-qa/route-receipt-mobile-390x844.png`
- Final web desktop capture: `outputs/web-ui-qa/route-receipt-desktop-1440x1024.png`
- Expo final home implementation: `outputs/mobile-ui-qa/home-final-390x844.png`
- Expo final result implementation: `outputs/mobile-ui-qa/results-390x844.png`
- Expo final route-detail implementation: `outputs/mobile-ui-qa/detail-ready-390x844.png`
- Expo reference comparison: `outputs/mobile-ui-qa/reference-vs-home.png`
- Iteration evidence: `outputs/mobile-ui-qa/home-390x844.png` and `outputs/mobile-ui-qa/detail-in-progress-390x844.png`
- Automated web viewport: `390 × 844`; desktop browser check: `1440 × 1024`
- State: fixture route from Ateneo Gate 3 to Katipunan LRT-2 Station, 2 PM, shortest route selected, empty place-detail state.

## Full-view comparison

The final desktop render preserves the reference composition: 78px brand header, narrow disclosed-fixture banner, left decision column, dominant right map, score and coverage stacked below route choice, and the navy Alitaptap place-detail panel directly below the map. The map frame, search controls, route cards, score card, and evidence bar align at the same visual scale and density.

The implementation now uses **Alitaptap** as the product wordmark. **Project Daan** was the internal codename used when the original comparison was recorded; the selected firefly art and visual language remain unchanged.

## Focused comparison

The upper-screen comparison was required because the firefly asset, header crop, input spacing, route-card weight, map chrome, and empty-state banner are too small to judge reliably in the full-width comparison. The final focused comparison confirms:

- the mascot is a real raster asset with a navy-backed crop, not CSS or SVG art;
- the header mascot, wordmark, supporting line, and Metro Manila pill retain the source hierarchy;
- form control height, card radius, selected route surface, and score typography closely track the source;
- the empty-state panel uses a separate real raster trail asset and keeps HTML copy readable above it;
- semantic route colors and the explicit unknown label remain independent from the brand palette.

## Required fidelity surface

### Fonts and typography

The implementation bundles Plus Jakarta Sans for compact extrabold headings and readable body copy, with DM Mono for evidence metadata. The same type family is loaded by the Expo client. Weight, line height, letter spacing, and wrapping preserve the reference hierarchy without depending on an operating-system font.

### Spacing and layout rhythm

Desktop column proportion, 16px grid gap, 14px card radius, header height, map height, panel padding, and control rhythm match the reference. Mobile collapses to one column without horizontal overflow at 390px. The primary route action and both alternatives remain visible and usable at the tested phone viewport.

### Colors and visual tokens

Warm paper, raised ivory, deep navy, rain teal, and calamansi gold are defined as shared tokens. The teal-to-gold coverage treatment is a raster spectrum asset rather than a CSS gradient. Pleasant, manageable, harsh, avoid, and unknown retain separate semantic tokens and text labels. Text contrast remains high on both paper and navy surfaces.

### Image quality and asset fidelity

`apps/web/public/asset/alitaptap-mark.webp` supplies the header/favicon artwork and is the source for the Expo app, adaptive, and splash icons under `apps/mobile/assets/images`. `apps/web/public/asset/alitaptap-trail.webp` supplies the web empty-state illustration. The assets retain crisp small-size rendering and no transparency fringe. The firefly remains legible at mobile header and launcher size. No placeholder, handcrafted SVG, CSS art, or emoji substitutes are present.

### Copy and content

All operational copy remains truthful to the existing fixture-backed product. “Unknown is not scored and never hidden,” the fallback disclosure, verdict description, route evidence, and place-detail copy remain intact. No live or unbuilt feature was introduced.

### Icon and interaction

Existing Lucide controls remain aligned and semantically labeled. The calmer alternative uses a leaf rather than an AI-like sparkle. Browser interaction checks confirm route submission, result focus, departure-time URL and reload persistence, stale-receipt invalidation, clipboard-feedback reset, and Escape focus return for the evidence and community disclosures. The repeatable 390px route flow records zero runtime exceptions and zero console errors. The external OpenFreeMap style can still emit missing-sprite warnings; no new warning or error is attributed to this interaction pass.

## Comparison history

### Iteration 1

- Finding [P2 — image quality]: the first header render cropped the generated square mascot too aggressively inside the wide tile.
- Fix: changed the image fit treatment and tightened the raster crop around the firefly.
- Post-fix evidence: the current header render shows the full body, wings, antennae, and glow within the tile; the repeatable browser gate verifies that the surrounding route workspace remains usable.

- Finding [P2 — mobile readability]: dotted trail light passed behind empty-state copy at the earlier phone width.
- Fix: added a same-navy text backing that masks the decorative points without introducing a visible nested card.
- Post-fix evidence: the mobile map-state capture preserves readable white copy while the trail continues outside the text area.

### Final pass

No actionable P0, P1, or P2 fidelity issue remains. The **Alitaptap** wordmark is the canonical product identity. A paper-background firefly beside the coverage bar from the generated mock is omitted as nonessential P3 decoration because the mascot already appears in the persistent header and functional empty state.

## Implementation checklist

- [x] Real Alitaptap raster logo and trail assets installed.
- [x] Expo launcher, adaptive, and splash artwork aligned to the Alitaptap mark.
- [x] Shared brand and semantic tokens applied.
- [x] Desktop source composition matched.
- [x] Mobile stack verified without horizontal overflow.
- [x] Route, alternative, place, score, coverage, receipt, and URL behavior preserved.
- [x] Console error check completed.
- [x] Full and focused source/implementation comparisons completed.

final result: passed
