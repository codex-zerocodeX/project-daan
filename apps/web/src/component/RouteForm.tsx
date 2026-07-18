import { ArrowDown, Clock3, MapPin } from "lucide-react";
import type { DepartureTime } from "../lib/type";

interface RouteFormProp {
  originLabel: string;
  destinationLabel: string;
  departureTime: DepartureTime;
  onDepartureTimeChange: (departureTime: DepartureTime) => void;
}

const departureOption: { value: DepartureTime; label: string; detail: string }[] = [
  { value: "06:00", label: "6 AM", detail: "cooler" },
  { value: "14:00", label: "2 PM", detail: "now" },
];

export function RouteForm({
  originLabel,
  destinationLabel,
  departureTime,
  onDepartureTimeChange,
}: RouteFormProp) {
  return (
    <section aria-labelledby="route-heading">
      <div className="mb-4 flex items-center justify-between gap-3 lg:mb-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-soft">Route check</p>
          <h1 id="route-heading" className="mt-1 text-xl font-bold tracking-[-0.025em]">
            Before you walk it
          </h1>
        </div>
        <Clock3 size={20} className="text-ink-soft" aria-hidden="true" />
      </div>

      <div className="relative grid gap-2 lg:grid-cols-2">
        <label className="grid gap-1">
          <span className="sr-only">Origin</span>
          <span className="flex min-h-11 items-center gap-3 rounded-card border border-line bg-surface px-3 text-sm font-semibold">
            <MapPin size={17} className="shrink-0 text-pleasant" aria-hidden="true" />
            <input className="min-w-0 flex-1 bg-transparent outline-none" value={originLabel} readOnly />
          </span>
        </label>
        <ArrowDown size={14} className="absolute left-[14px] top-[41px] z-10 text-ink-soft lg:hidden" aria-hidden="true" />
        <label className="grid gap-1">
          <span className="sr-only">Destination</span>
          <span className="flex min-h-11 items-center gap-3 rounded-card border border-line bg-surface px-3 text-sm font-semibold">
            <MapPin size={17} className="shrink-0 text-harsh" aria-hidden="true" />
            <input className="min-w-0 flex-1 bg-transparent outline-none" value={destinationLabel} readOnly />
          </span>
        </label>
      </div>

      <div className="mt-4 lg:mt-3 lg:flex lg:items-center lg:gap-3" role="group" aria-labelledby="departure-label">
        <p id="departure-label" className="mb-2 shrink-0 text-xs font-bold text-ink-soft lg:mb-0">
          Leave at
        </p>
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 rounded-card bg-paper p-1">
          {departureOption.map((option) => {
            const isSelected = departureTime === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onDepartureTimeChange(option.value)}
                className={`rounded-[9px] px-3 py-2 text-left transition-none ${
                  isSelected ? "bg-ink text-surface" : "text-ink-soft hover:bg-surface"
                }`}
              >
                <span className="block text-sm font-extrabold">{option.label}</span>
                <span className={`block text-[11px] font-semibold ${isSelected ? "text-surface/70" : "text-ink-soft"}`}>
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
