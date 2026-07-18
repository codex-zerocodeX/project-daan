import { ChevronDown, Clock3, MapPin, Route as RouteIcon, ShieldCheck, TriangleAlert } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { CoverageBar } from "./component/CoverageBar";
import { FallbackBanner } from "./component/FallbackBanner";
import { Header } from "./component/Header";
import { NodePanel } from "./component/NodePanel";
import { RouteAlternativePanel } from "./component/RouteAlternativePanel";
import { RouteSearch } from "./component/RouteSearch";
import { SegmentReceipt } from "./component/SegmentReceipt";
import { ShareBar } from "./component/ShareBar";
import { placeNode, planRoute, review } from "./lib/route";
import type { DepartureTime, PlaceNode } from "./lib/type";
import { verdictMeta } from "./lib/verdict";
import { CommunityPanel } from "./module/community/CommunityPanel";
import { useCommunity } from "./module/community/useCommunity";
import { useCommunityUrl } from "./module/community/useCommunityUrl";

const node = placeNode();
const MapCanvas = lazy(() => import("./component/MapCanvas").then((module) => ({ default: module.MapCanvas })));
const defaultOrigin = node.find((item) => item.nodeId === "ateneo-gate-3") ?? null;
const defaultDestination = node.find((item) => item.nodeId === "lrt-katipunan") ?? null;
const initialUrl = new URL(window.location.href);
const initialOrigin = node.find((item) => item.nodeId === initialUrl.searchParams.get("originNodeId")) ?? defaultOrigin;
const initialDestination = node.find((item) => item.nodeId === initialUrl.searchParams.get("destinationNodeId")) ?? defaultDestination;

interface RouteQuery {
  originNodeId: string;
  destinationNodeId: string;
}

function App() {
  const [origin, setOrigin] = useState<PlaceNode | null>(initialOrigin);
  const [destination, setDestination] = useState<PlaceNode | null>(initialDestination);
  const [routeQuery, setRouteQuery] = useState<RouteQuery>({
    originNodeId: initialOrigin?.nodeId ?? "",
    destinationNodeId: initialDestination?.nodeId ?? "",
  });
  const [departureTime, setDepartureTime] = useState<DepartureTime>("14:00");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [routeNotice, setRouteNotice] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
  const [isThreadOpen, setIsThreadOpen] = useState(
    () =>
      window.matchMedia("(min-width: 1024px)").matches ||
      ["threadId", "reportId", "replyId"].some((key) => initialUrl.searchParams.has(key)),
  );
  const resultSummaryRef = useRef<HTMLElement | null>(null);

  const routePlan = useMemo(
    () => planRoute(routeQuery.originNodeId, routeQuery.destinationNodeId, departureTime),
    [departureTime, routeQuery],
  );
  const routeId = useMemo(() => routePlan.alternative.map((item) => item.routeId), [routePlan.alternative]);
  const threadId = useMemo(
    () => [...new Set(routePlan.alternative.flatMap((item) => item.thread.map((thread) => thread.threadId)))],
    [routePlan.alternative],
  );
  const segmentId = useMemo(
    () => [...new Set(routePlan.alternative.flatMap((item) => item.route.segment.map((segment) => segment.segmentId)))],
    [routePlan.alternative],
  );
  const community = useCommunity(threadId);
  const communityContext = useMemo(
    () => ({
      routeId,
      segmentId,
      threadId,
      reportId: community.snapshot.state.report.map((item) => item.reportId),
      replyId: community.snapshot.state.reply.map((item) => item.replyId),
    }),
    [community.snapshot, routeId, segmentId, threadId],
  );
  const { urlState, navigateCommunity } = useCommunityUrl(communityContext);
  const activeAlternative = routePlan.alternative.find((item) => item.routeId === urlState.routeId) ?? routePlan.alternative[0] ?? null;
  const activeSegmentId = activeAlternative?.route.segment.map((item) => item.segmentId) ?? [];
  const openSegmentId = urlState.segmentId ?? selectedSegmentId ?? activeSegmentId[0] ?? null;
  const communityProjection = activeSegmentId.map((item) => community.getProjection(activeAlternative?.routeId ?? "", item));
  const selectedNode = node.find((item) => item.nodeId === selectedNodeId) ?? null;
  const comparisonAlternative = routePlan.alternative.find((item) => item.routeId !== activeAlternative?.routeId) ?? null;
  const scoreDelta = comparisonAlternative && activeAlternative ? comparisonAlternative.route.score - activeAlternative.route.score : 0;
  const durationDelta = comparisonAlternative && activeAlternative ? comparisonAlternative.route.durationMin - activeAlternative.route.durationMin : 0;
  const routeMeta = activeAlternative ? verdictMeta[activeAlternative.route.verdict] : null;
  const RouteVerdictIcon = routeMeta?.icon;
  const routeError = routePlan.failure?.reason === "unreachable"
    ? "No walkable connection is available for those two places in this map yet."
    : routePlan.failure?.reason === "missing_node"
      ? "Choose both places from the search suggestions."
      : routePlan.failure?.reason === "invalid_cost"
        ? "This route has invalid evidence, so Daan did not score it."
        : routePlan.failure?.reason === "negative_cost"
          ? "This route has an invalid negative path cost, so Daan did not score it."
          : formError;

  useEffect(() => {
    if (!activeAlternative || urlState.routeId) return;
    navigateCommunity(
      { routeId: activeAlternative.routeId, segmentId: activeAlternative.route.segment[0]?.segmentId ?? null },
      true,
    );
  }, [activeAlternative, navigateCommunity, urlState.routeId]);

  useEffect(() => {
    const layoutQuery = window.matchMedia("(min-width: 1024px)");
    const changeLayout = (event: MediaQueryListEvent) => {
      setIsDetailOpen(event.matches);
      setIsThreadOpen(event.matches);
    };
    layoutQuery.addEventListener("change", changeLayout);
    return () => layoutQuery.removeEventListener("change", changeLayout);
  }, []);

  function submitRoute() {
    if (!origin || !destination) {
      setFormError("Choose both places from the search suggestions.");
      return;
    }
    if (origin.nodeId === destination.nodeId) {
      setFormError("Your origin and destination are the same. Choose a different place.");
      return;
    }
    setFormError(null);
    setSelectedNodeId(null);
    setSelectedSegmentId(null);
    setRouteQuery({ originNodeId: origin.nodeId, destinationNodeId: destination.nodeId });
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("originNodeId", origin.nodeId);
    nextUrl.searchParams.set("destinationNodeId", destination.nodeId);
    window.history.pushState(window.history.state, "", nextUrl);
    navigateCommunity({ routeId: null, segmentId: null, threadId: null, reportId: null, replyId: null }, true);
    setRouteNotice(`Route checked from ${origin.shortName} to ${destination.shortName}.`);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        resultSummaryRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  }

  function changeOrigin(value: PlaceNode | null) {
    setOrigin(value);
    setFormError(null);
  }

  function changeDestination(value: PlaceNode | null) {
    setDestination(value);
    setFormError(null);
  }

  function selectAlternative(routeId: string) {
    const alternative = routePlan.alternative.find((item) => item.routeId === routeId);
    setSelectedNodeId(null);
    const segmentId = alternative?.route.segment[0]?.segmentId ?? null;
    setSelectedSegmentId(segmentId);
    navigateCommunity({ routeId, segmentId, threadId: null, reportId: null, replyId: null });
  }

  function selectNode(nodeId: string) {
    setSelectedNodeId(nodeId);
    document.getElementById("place-panel")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      {activeAlternative?.route.isFixture && <FallbackBanner fetchedAt={activeAlternative.route.weather.fetchedAt} />}

      <main className="daan-layout mx-auto w-full max-w-[1500px] sm:px-6 sm:py-5 lg:px-8">
        <div className="daan-map-stage relative grid content-start lg:sticky lg:top-4">
          <Suspense fallback={<div className="daan-map grid place-items-center bg-surface text-sm font-bold text-ink-soft">Loading route map…</div>}>
            <MapCanvas alternative={activeAlternative} selectedNodeId={selectedNodeId} onNodeSelect={selectNode} />
          </Suspense>
          <div className="daan-map-intro pointer-events-none absolute left-5 top-5 z-10 max-w-[245px] sm:hidden">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-soft">Your next move</p>
            <h1 className="mt-1 text-[30px] font-extrabold leading-[1.02] tracking-[-0.055em] text-ink">Where to today?</h1>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-ink-soft">Compare time, comfort, and what commuters know.</p>
          </div>
          {selectedNode && (
            <div id="place-panel" className="mt-3 px-3 sm:px-0">
              <NodePanel node={selectedNode} review={review} thread={activeAlternative?.thread ?? []} onClose={() => setSelectedNodeId(null)} />
            </div>
          )}
        </div>

        <section className="daan-control daan-route-sheet" aria-label="Plan and compare a route">
          <RouteSearch
            node={node}
            origin={origin}
            destination={destination}
            errorMessage={routeError}
            onOriginChange={changeOrigin}
            onDestinationChange={changeDestination}
            onRoute={submitRoute}
          />

          <div className="departure-control flex items-center justify-between gap-3 border-t border-line" role="group" aria-labelledby="departure-label">
            <span id="departure-label" className="inline-flex items-center gap-2 text-xs font-extrabold text-ink-soft"><Clock3 size={16} aria-hidden="true" /> Leave at</span>
            <div className="grid grid-cols-2 rounded-chip bg-paper p-1">
              {(["06:00", "14:00"] as DepartureTime[]).map((time) => (
                <button
                  key={time}
                  type="button"
                  aria-pressed={departureTime === time}
                  onClick={() => setDepartureTime(time)}
                  className={`min-h-11 rounded-chip px-4 text-xs font-extrabold ${departureTime === time ? "bg-brand-navy text-surface shadow-[0_6px_14px_rgb(8_34_55/0.12)]" : "text-ink-soft"}`}
                >
                  {time === "06:00" ? "6 AM" : "2 PM"}
                </button>
              ))}
            </div>
          </div>

          <RouteAlternativePanel alternative={routePlan.alternative} selectedRouteId={activeAlternative?.routeId ?? null} onSelect={selectAlternative} />

          {activeAlternative && routeMeta && RouteVerdictIcon ? (
            <section
              id="route-result-summary"
              ref={resultSummaryRef}
              tabIndex={-1}
              className="route-result-summary scroll-mt-4 border-t border-line"
              aria-labelledby="route-result-heading"
              aria-live="polite"
            >
              <span className="sr-only">{routeNotice}</span>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-ink-soft">Your route check</p>
                  <h2 id="route-result-heading" className="mt-1 text-lg font-extrabold tracking-[-0.03em]">{activeAlternative.label}</h2>
                </div>
                <span className={`inline-flex min-h-10 items-center gap-1.5 rounded-chip bg-paper px-3 text-xs font-extrabold ${routeMeta.className}`}>
                  <RouteVerdictIcon size={16} aria-hidden="true" /> {routeMeta.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-[1.1fr_0.9fr_0.9fr] divide-x divide-line">
                <div className="pr-3">
                  <span className="text-[36px] font-extrabold leading-none tracking-[-0.06em] text-brand-navy">{activeAlternative.route.score}</span>
                  <span className="ml-1 text-[11px] font-bold text-ink-soft">/100</span>
                  <span className="mt-1 block text-[10px] font-bold text-ink-soft">walkability</span>
                </div>
                <div className="px-3">
                  <Clock3 size={16} className="text-brand-teal" aria-hidden="true" />
                  <span className="mt-1 block text-base font-extrabold">{activeAlternative.route.durationMin} min</span>
                  <span className="text-[10px] font-bold text-ink-soft">{(activeAlternative.route.distanceM / 1000).toFixed(1)} km</span>
                </div>
                <div className="pl-3">
                  <ShieldCheck size={16} className="text-pleasant" aria-hidden="true" />
                  <span className="mt-1 block text-base font-extrabold">{activeAlternative.route.coveragePct}%</span>
                  <span className="text-[10px] font-bold text-ink-soft">evidence</span>
                </div>
              </div>

              {comparisonAlternative && scoreDelta !== 0 && (
                <p className="mt-3 border-l-4 border-brand-gold bg-brand-gold/10 px-3 py-2 text-xs font-semibold leading-relaxed text-ink">
                  {scoreDelta > 0
                    ? `${comparisonAlternative.label} takes ${Math.abs(durationDelta)} min more and adds ${scoreDelta} walkability points.`
                    : `${comparisonAlternative.label} saves ${Math.abs(durationDelta)} min, but scores ${Math.abs(scoreDelta)} points lower.`}
                </p>
              )}

              <div className="mt-3">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft"><RouteIcon size={14} aria-hidden="true" /> {activeAlternative.path.nodeId.length} mapped checkpoint</p>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                  {activeAlternative.path.nodeId.map((nodeId, index) => {
                    const place = node.find((item) => item.nodeId === nodeId)!;
                    return (
                      <button key={nodeId} type="button" onClick={() => selectNode(nodeId)} className="checkpoint-button inline-flex min-h-11 shrink-0 items-center gap-2 rounded-chip bg-paper px-3 text-xs font-extrabold">
                        <MapPin size={14} className={index === 0 ? "text-pleasant" : "text-brand-teal"} aria-hidden="true" />
                        {place.shortName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : (
            <section className="border-l-4 border-avoid bg-avoid/5 p-4" aria-live="polite">
              <TriangleAlert className="text-avoid" aria-hidden="true" />
              <h2 className="mt-2 text-lg font-extrabold">Route unavailable</h2>
              <p className="mt-1 text-sm font-medium text-ink-soft">{routeError ?? "Choose two connected places to calculate a route."}</p>
            </section>
          )}
        </section>

        {activeAlternative && (
          <details className="daan-detail daan-disclosure" open={isDetailOpen} onToggle={(event) => setIsDetailOpen(event.currentTarget.open)}>
            <summary className="daan-disclosure-summary">
              <span>
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">The evidence</span>
                <span className="text-base font-extrabold">Why this route scored {activeAlternative.route.score}</span>
              </span>
              <ChevronDown size={20} aria-hidden="true" />
            </summary>
            <div className="daan-disclosure-content grid content-start gap-4">
              <CoverageBar coveragePct={activeAlternative.route.coveragePct} />
              <SegmentReceipt
                segment={activeAlternative.route.segment}
                selectedSegmentId={openSegmentId}
                communityProjection={communityProjection}
                onSegmentSelect={(segmentId) => {
                  setSelectedSegmentId(segmentId);
                  navigateCommunity({ segmentId, reportId: null, replyId: null });
                }}
              />
              <ShareBar route={activeAlternative.route} />
            </div>
          </details>
        )}

        {activeAlternative && activeAlternative.thread.length > 0 && (
          <details className="daan-thread daan-disclosure" open={isThreadOpen} onToggle={(event) => setIsThreadOpen(event.currentTarget.open)}>
            <summary className="daan-disclosure-summary">
              <span>
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">Along this path</span>
                <span className="text-base font-extrabold">Community updates</span>
              </span>
              <ChevronDown size={20} aria-hidden="true" />
            </summary>
            <div className="daan-disclosure-content">
              <CommunityPanel
                  routeId={activeAlternative.routeId}
                  thread={activeAlternative.thread}
                  segment={activeAlternative.route.segment.map((item) => ({ segmentId: item.segmentId, name: item.name }))}
                  selectedThreadId={urlState.threadId}
                  selectedReportId={urlState.reportId}
                  selectedReplyId={urlState.replyId}
                  threadView={community.threadView}
                  onThreadSelect={(threadId) => navigateCommunity({ threadId, reportId: null, replyId: null })}
                  onReportSelect={(reportId) => navigateCommunity({ reportId, replyId: null })}
                  onReplySelect={(replyId) => navigateCommunity({ replyId })}
                  onCreateReport={(input) => {
                    const report = community.createReport({ ...input, routeId: activeAlternative.routeId });
                    navigateCommunity({ threadId: report.threadId, segmentId: report.segmentId, reportId: report.reportId, replyId: null });
                  }}
                  onCreateReply={(input) => {
                    const result = community.createReply(input);
                    if (result.isSuccess) navigateCommunity({ reportId: result.reply.reportId, replyId: result.reply.replyId });
                    return result;
                  }}
                  onVote={community.castVote}
              />
            </div>
          </details>
        )}
      </main>
    </div>
  );
}

export default App;
