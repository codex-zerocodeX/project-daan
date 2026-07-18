import { AlertTriangle, ChevronDown, CircleHelp, ExternalLink, RadioTower } from "lucide-react";
import type { Evidence, Segment } from "../lib/type";
import { verdictFromScore, verdictMeta } from "../lib/verdict";
import type { CommunityProjection } from "../module/community/type";

interface SegmentReceiptProp {
  segment: Segment[];
  selectedSegmentId: string | null;
  communityProjection?: CommunityProjection[];
  onSegmentSelect?: (segmentId: string) => void;
}

function evidenceLabel(evidence: Evidence) {
  return `${evidence.kind.replace("_", " ")}: ${evidence.value}`;
}

function EvidencePill({ evidence }: { evidence: Evidence }) {
  const isCommunity = evidence.source === "community";
  const isUnknown = evidence.state === "unknown";
  const className = isCommunity
    ? "border-harsh/60 bg-harsh/5 text-harsh"
    : isUnknown
      ? "border-unknown/60 bg-transparent text-unknown"
      : "border-line bg-paper text-ink";
  const content = (
    <>
      {isCommunity ? <RadioTower size={12} aria-hidden="true" /> : isUnknown ? <CircleHelp size={12} aria-hidden="true" /> : null}
      <span>{evidenceLabel(evidence)}</span>
      {isCommunity && <span className="text-[9px]">reported · karma {evidence.reporterKarma ?? 0} · ×{evidence.weight}</span>}
      {evidence.sourceUrl && <ExternalLink size={11} aria-hidden="true" />}
    </>
  );

  if (evidence.sourceUrl) {
    return (
      <a
        href={evidence.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center gap-1 rounded-chip border px-2 py-1 text-[10px] font-bold ${className}`}
      >
        {content}
      </a>
    );
  }

  return <span className={`inline-flex items-center gap-1 rounded-chip border border-dashed px-2 py-1 text-[10px] font-bold ${className}`}>{content}</span>;
}

export function SegmentReceipt({ segment, selectedSegmentId, communityProjection = [], onSegmentSelect }: SegmentReceiptProp) {
  return (
    <section aria-labelledby="receipt-heading">
      <div className="mb-2 flex items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-soft">Evidence receipt</p>
          <h2 id="receipt-heading" className="mt-0.5 text-xl font-bold tracking-[-0.025em]">
            Daan shows its work
          </h2>
        </div>
        <span className="font-mono text-[11px] font-bold text-ink-soft">{segment.length} segment</span>
      </div>

      <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
        {segment.map((item, index) => {
          const verdict = verdictFromScore(item.score);
          const meta = verdictMeta[verdict];
          const VerdictIcon = meta.icon;
          const isSelected = selectedSegmentId === item.segmentId;
          const projection = communityProjection.find((community) => community.segmentId === item.segmentId);

          return (
            <details key={item.segmentId} open={isSelected} className={isSelected ? "bg-paper/70" : "bg-surface"}>
              <summary onClick={() => onSegmentSelect?.(item.segmentId)} className="flex cursor-pointer list-none items-center gap-3 px-3 py-3 [&::-webkit-details-marker]:hidden">
                <span className={`grid size-9 shrink-0 place-items-center rounded-[9px] bg-paper font-mono text-sm font-extrabold ${meta.className}`}>
                  {item.score}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold">
                    {index + 1}. {item.name}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] font-bold text-ink-soft">
                    {(item.lengthM / 1000).toFixed(2)} km
                    <span aria-hidden="true">·</span>
                    <span className={`inline-flex items-center gap-1 ${meta.className}`}>
                      <VerdictIcon size={12} aria-hidden="true" />
                      {meta.label}
                    </span>
                  </span>
                </span>
                <ChevronDown size={17} className="shrink-0 text-ink-soft" aria-hidden="true" />
              </summary>
              <div className="px-3 pb-4 pl-[60px]">
                <p className="text-xs font-medium leading-relaxed text-ink-soft">{item.explanation}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.evidence.map((evidence, evidenceIndex) => (
                    <EvidencePill key={`${item.segmentId}-${evidence.kind}-${evidenceIndex}`} evidence={evidence} />
                  ))}
                </div>
                {projection && (projection.activeCount > 0 || projection.excludedCount > 0) && (
                  <div className="mt-3 border-t border-line pt-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">Live community status</p>
                    <p className="mt-1 text-[10px] font-medium text-ink-soft">Votes change evidence eligibility; the disclosed fixture score above stays fixed.</p>
                    <div className="mt-2 grid gap-2">
                      {projection.activeReport.map((community) => (
                        <div key={community.report.reportId} className="rounded-[9px] border border-pleasant/40 bg-pleasant/5 p-2 text-xs font-medium text-ink">
                          <span className="font-extrabold capitalize text-pleasant">{community.report.kind}</span> · {community.report.body}
                          <span className="mt-1 block font-mono text-[10px] font-bold text-ink-soft">karma {community.karma} · ×{community.weight.toFixed(1)} · {community.tally.acceptCount} accept</span>
                        </div>
                      ))}
                      {projection.excludedReport.map((community) => (
                        <div key={community.report.reportId} className="rounded-[9px] border border-avoid/40 bg-avoid/5 p-2 text-xs font-medium text-ink-soft opacity-75">
                          <span className="line-through">{community.report.body}</span>
                          <span className="mt-1 flex items-center gap-1 font-extrabold text-avoid"><AlertTriangle size={12} aria-hidden="true" /> Disputed · excluded from route score.</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
