# Web lane integration disposition

The branch `origin/codex/daan-web-lane` began as a standalone root Vite application. Its active implementation was copied into `apps/web` and then evolved there. A normal tree merge would recreate duplicate root manifests, source, assets, and project documents.

This ledger covers all 141 paths changed by the lane's six unique commits relative to its merge base. The integration imports 57 unique evidence paths, retains the current monorepo version for 16 repository/document paths, and rejects 68 obsolete duplicate-root application paths. After the imported evidence is committed, an `ours` strategy merge records the lane ancestry without changing the resolved tree.

| Path | Disposition | Reason |
| --- | --- | --- |
| `.gitignore` | Keep current | Current monorepo ignore rules include later workspace and generated-state coverage. |
| `README.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `context.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `design-qa.md` | Map, do not import | Current QA record lives in docs/brand-qa.md with preserved output evidence. |
| `docs/routing-architecture.md` | Keep current | Current monorepo routing decision has evolved beyond the lane copy. |
| `eslint.config.js` | Do not import | Obsolete standalone-root build/config would resurrect a duplicate application. |
| `idea.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `index.html` | Do not import | Obsolete standalone-root build/config would resurrect a duplicate application. |
| `outputs/event-site-scrape/README.md` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/getting-there.txt` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/home.txt` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/judging-guide.md` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/judging.txt` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/build-week-header.jpg` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist-mono/geist-mono-013b2f2f.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist-mono/geist-mono-0638449e.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist-mono/geist-mono-44745446.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist-mono/geist-mono-44e03052.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist-mono/geist-mono-971fb274.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist-mono/geist-mono-f6b33328.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist/geist-001175b1.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist/geist-52306abf.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist/geist-875ccdd4.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist/geist-98bbbccb.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/font/geist/geist-ff2310f5.woff2` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/framework-XU8gKkFC.js` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/index-C9hf5eDF.js` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/index-I-DWoNZz.css` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/layout-segment-context-BROfSA6N.js` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/link-Dw84-XOe.js` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/query-BbOc3VB2.js` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/asset/rolldown-runtime-S-ySWqyJ.js` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/page/getting-there.html` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/page/index.html` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/page/judging.html` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/route/getting-there.rsc` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/route/index.rsc` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/route/judging.rsc` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/wayfinder/app.js` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/wayfinder/campus-data.js` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/wayfinder/index.html` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/wayfinder/maplibre-gl.css` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/raw/wayfinder/maplibre-gl.js` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/receipt.sha256` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/event-site-scrape/wayfinder.txt` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/motion-qa/daan-motion-phone-settled.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/motion-qa/daan-motion-phone.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/motion-qa/motion-phone.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/project-daan-website-structure.pptx` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/project-daan-website-structure.pptx.inspect.ndjson` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ui-audit/01-current-mobile-viewport.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ui-audit/01-current-mobile.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ui-audit/02-current-desktop.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ui-audit/03-redesign-mobile-v1.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ui-audit/04-redesign-mobile-v2.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ui-audit/05-redesign-desktop.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ui-audit/06-reference-viewport-mobile.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ui-audit/07-reference-mobile-normalized.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ui-audit/08-reference-vs-redesign.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ui-audit/09-before-vs-after.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ux-audit-2026-07-18/01-route-workspace-desktop.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ux-audit-2026-07-18/02-route-alternative-selected.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ux-audit-2026-07-18/03-evidence-drilldown.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ux-audit-2026-07-18/04-route-workspace-mobile.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `outputs/ux-audit-2026-07-18/05-route-comparison-mobile.png` | Import | Unique audit, event, motion, or presentation evidence. |
| `package-lock.json` | Do not import | Obsolete standalone-root build/config would resurrect a duplicate application. |
| `package.json` | Do not import | Obsolete standalone-root build/config would resurrect a duplicate application. |
| `pitch.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `plan.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `prd.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `prompt.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `public/asset/alitaptap-mark.webp` | Map, do not import | Asset is byte-identical under apps/web/public; avoid duplicate root app assets. |
| `public/asset/alitaptap-trail.webp` | Map, do not import | Asset is byte-identical under apps/web/public; avoid duplicate root app assets. |
| `public/asset/daan-spectrum.webp` | Map, do not import | Asset is byte-identical under apps/web/public; avoid duplicate root app assets. |
| `research.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `roadmap.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `source.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `src/App.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/CoverageBar.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/FallbackBanner.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/Header.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/MapCanvas.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/NodePanel.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/ReviewCard.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/RouteAlternativePanel.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/RouteForm.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/RoutePanel.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/RouteSearch.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/ScoreCard.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/SegmentReceipt.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/ShareBar.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/component/WeatherChip.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/fixture/discussion.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/fixture/network.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/fixture/report.json` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/fixture/route-morning.json` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/fixture/route.json` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/map-style.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/path.test.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/path.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/priorityQueue.test.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/priorityQueue.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/route.test.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/route.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/routeProfile.test.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/routeProfile.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/search.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/similarity.test.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/similarity.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/thread.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/type.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/lib/verdict.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/main.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/CommunityPanel.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/CommunityThread.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/KarmaBadge.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/ReplyComposer.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/ReportComposer.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/VoteControl.tsx` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/domain.test.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/domain.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/repository.test.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/repository.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/seed.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/storage.test.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/storage.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/type.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/url.test.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/url.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/useCommunity.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/module/community/useCommunityUrl.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/style/global.css` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/style/motion.css` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `src/vite-env.d.ts` | Map, do not import | Standalone source is already represented and evolved under apps/web/src. |
| `token.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `transport-cost.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `triage.md` | Keep current | Current monorepo or historical record is authoritative; lane-specific edits are represented by imported evidence. |
| `tsconfig.app.json` | Do not import | Obsolete standalone-root build/config would resurrect a duplicate application. |
| `tsconfig.json` | Do not import | Obsolete standalone-root build/config would resurrect a duplicate application. |
| `tsconfig.node.json` | Do not import | Obsolete standalone-root build/config would resurrect a duplicate application. |
| `vite.config.ts` | Do not import | Obsolete standalone-root build/config would resurrect a duplicate application. |

