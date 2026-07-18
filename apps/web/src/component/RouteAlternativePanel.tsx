import { Check, Clock3, Leaf, Route as RouteIcon } from "lucide-react";
import type { RouteAlternative } from "../lib/type";

interface RouteAlternativePanelProps {
  alternative: RouteAlternative[];
  selectedRouteId: string | null;
  onSelect: (routeId: string) => void;
}

export function RouteAlternativePanel({ alternative, selectedRouteId, onSelect }: RouteAlternativePanelProps) {
  if (alternative.length === 0) return null;
  return (
    <section aria-labelledby="alternative-heading" className="route-alternative">
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">Your options</p>
          <h2 id="alternative-heading" className="text-sm font-extrabold">Choose your route</h2>
        </div>
        <span className="text-right text-[10px] font-bold leading-tight text-ink-soft">Compare time<br />and comfort</span>
      </div>
      <div className="route-alternative-grid grid grid-cols-2 gap-1 bg-paper p-1">
        {alternative.map((item, index) => {
          const isSelected = item.routeId === selectedRouteId;
          return (
            <button
              key={item.routeId}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(item.routeId)}
              className={`route-alternative-button min-h-[76px] rounded-[11px] p-3 text-left ${isSelected ? "bg-brand-navy text-surface shadow-[0_8px_18px_rgb(8_34_55/0.14)]" : "bg-transparent text-ink"}`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-extrabold sm:text-sm">
                  {index === 0 ? <RouteIcon size={16} aria-hidden="true" /> : <Leaf size={16} aria-hidden="true" />}
                  <span className="truncate">{item.label}</span>
                </span>
                {isSelected ? <Check size={15} className="shrink-0 text-brand-gold" aria-hidden="true" /> : null}
              </span>
              <span className={`mt-2 flex items-center gap-1.5 text-[11px] font-bold sm:gap-2 sm:text-xs ${isSelected ? "text-surface/70" : "text-ink-soft"}`}>
                {(item.route.distanceM / 1000).toFixed(1)} km
                <span aria-hidden="true">·</span>
                <Clock3 size={13} aria-hidden="true" /> {item.route.durationMin} min
              </span>
              <span className={`mt-1 block font-mono text-[10px] font-extrabold ${isSelected ? "text-brand-gold" : "text-ink-soft"}`}>{item.route.score}/100 walkability</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
