import { Map, MousePointer2 } from "lucide-react";
import type { Segment } from "../lib/type";
import { verdictFromScore, verdictMeta } from "../lib/verdict";

interface RoutePanelProp {
  segment: Segment[];
  selectedSegmentId: string | null;
  onSegmentSelect: (segmentId: string) => void;
}

export function RoutePanel({ segment, selectedSegmentId, onSegmentSelect }: RoutePanelProp) {
  const totalLength = segment.reduce((sum, item) => sum + item.lengthM, 0);

  return (
    <section className="rounded-card border border-line bg-surface p-4" aria-labelledby="route-preview-heading">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Map size={19} className="text-ink" aria-hidden="true" />
            <h2 id="route-preview-heading" className="text-base font-extrabold">
              Route condition
            </h2>
          </div>
          <p className="mt-1 text-xs font-medium text-ink-soft">Schematic route preview — live map comes next.</p>
        </div>
        <span className="hidden items-center gap-1 text-[11px] font-bold text-ink-soft sm:flex">
          <MousePointer2 size={13} aria-hidden="true" />
          Select a segment
        </span>
      </div>

      <div className="mt-5 flex items-stretch gap-1" aria-label="Route segment condition from origin to destination">
        {segment.map((item, index) => {
          const verdict = verdictFromScore(item.score);
          const meta = verdictMeta[verdict];
          const VerdictIcon = meta.icon;
          const isSelected = selectedSegmentId === item.segmentId;
          const widthPct = Math.max(12, (item.lengthM / totalLength) * 100);
          const colorClass = {
            pleasant: "bg-pleasant",
            manageable: "bg-manageable",
            harsh: "bg-harsh",
            avoid: "bg-avoid",
          }[verdict];

          return (
            <button
              key={item.segmentId}
              type="button"
              onClick={() => onSegmentSelect(item.segmentId)}
              className={`group min-w-0 rounded-[8px] border-2 p-1.5 text-left transition-none ${
                isSelected ? "border-ink bg-paper" : "border-transparent hover:border-line"
              }`}
              style={{ width: `${widthPct}%` }}
              aria-label={`Segment ${index + 1}: ${item.name}, ${meta.label}, score ${item.score}`}
              aria-pressed={isSelected}
            >
              <span className={`block h-2 rounded-chip ${colorClass}`} />
              <span className={`mt-2 flex items-center gap-1 truncate text-[10px] font-extrabold uppercase ${meta.className}`}>
                <VerdictIcon size={12} className="shrink-0" aria-hidden="true" />
                <span className="sm:hidden">{meta.shortLabel}</span>
                <span className="hidden truncate sm:inline">{meta.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
