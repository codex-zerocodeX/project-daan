import { ArrowUpDown, MapPin, Navigation, Search } from "lucide-react";
import { useId, useState } from "react";
import { searchNode } from "../lib/search";
import type { PlaceNode } from "../lib/type";

interface PlaceFieldProps {
  label: string;
  tone: "origin" | "destination";
  node: PlaceNode[];
  query: string;
  onQueryChange: (value: string) => void;
  onChange: (value: PlaceNode | null) => void;
}

function PlaceField({ label, tone, node, query, onQueryChange, onChange }: PlaceFieldProps) {
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const suggestion = searchNode(query, node);

  function selectNode(selectedNode: PlaceNode) {
    onChange(selectedNode);
    onQueryChange(selectedNode.name);
    setIsOpen(false);
    setActiveIndex(0);
  }

  return (
    <label className="route-place-field relative block">
      <span className="route-place-label block text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">{label}</span>
      <span className="flex min-h-[54px] items-center gap-3 px-3.5 focus-within:text-brand-teal">
        <MapPin size={18} className={tone === "origin" ? "text-pleasant" : "text-harsh"} aria-hidden="true" />
        <input
          role="combobox"
          aria-controls={listId}
          aria-expanded={isOpen && suggestion.length > 0}
          aria-autocomplete="list"
          aria-activedescendant={isOpen && suggestion[activeIndex] ? `${listId}-${suggestion[activeIndex].nodeId}` : undefined}
          autoComplete="off"
          value={query}
          placeholder={tone === "origin" ? "Where are you coming from?" : "Where are you going?"}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onChange={(event) => {
            onQueryChange(event.target.value);
            onChange(null);
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setIsOpen(false);
              setActiveIndex(0);
              return;
            }
            if (!isOpen || suggestion.length === 0) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => (index + 1) % suggestion.length);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => (index - 1 + suggestion.length) % suggestion.length);
            } else if (event.key === "Enter") {
              event.preventDefault();
              selectNode(suggestion[activeIndex]);
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-bold text-ink outline-none placeholder:font-medium placeholder:text-ink-soft/70"
        />
        <Search size={17} className="text-ink-soft/80" aria-hidden="true" />
      </span>
      {isOpen && suggestion.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-40 mt-1 max-h-64 w-full overflow-y-auto rounded-card border border-line bg-surface p-1 shadow-soft">
          {suggestion.map((item, index) => (
            <li
              id={`${listId}-${item.nodeId}`}
              key={item.nodeId}
              role="option"
              aria-selected={index === activeIndex}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => selectNode(item)}
              className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-[9px] px-3 py-2 ${index === activeIndex ? "bg-paper" : "hover:bg-paper"}`}
            >
              <span>
                <span className="block text-sm font-extrabold">{item.name}</span>
                <span className="block text-[11px] font-semibold capitalize text-ink-soft">{item.kind}</span>
              </span>
              {!item.isAccessible && <span className="rounded-chip bg-avoid/10 px-2 py-1 text-[10px] font-bold text-avoid">No route</span>}
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}

interface RouteSearchProps {
  node: PlaceNode[];
  origin: PlaceNode | null;
  destination: PlaceNode | null;
  errorMessage: string | null;
  onOriginChange: (value: PlaceNode | null) => void;
  onDestinationChange: (value: PlaceNode | null) => void;
  onRoute: () => void;
}

export function RouteSearch({ node, origin, destination, errorMessage, onOriginChange, onDestinationChange, onRoute }: RouteSearchProps) {
  const [originQuery, setOriginQuery] = useState(origin?.name ?? "");
  const [destinationQuery, setDestinationQuery] = useState(destination?.name ?? "");

  return (
    <section aria-labelledby="route-search-heading" className="route-search">
      <div className="route-search-copy mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-soft">Plan a walk</p>
          <h2 id="route-search-heading" className="mt-1 text-[25px] font-extrabold leading-tight tracking-[-0.045em]">Plan your route</h2>
        </div>
      </div>
      <div className="route-place-group relative">
        <PlaceField label="Starting from" tone="origin" node={node} query={originQuery} onQueryChange={setOriginQuery} onChange={onOriginChange} />
        <div className="route-place-divider" aria-hidden="true" />
        <button
          type="button"
          aria-label="Swap origin and destination"
          onClick={() => {
            onOriginChange(destination);
            onDestinationChange(origin);
            setOriginQuery(destinationQuery);
            setDestinationQuery(originQuery);
          }}
          className="route-swap absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-chip border border-line bg-surface text-ink shadow-soft"
        >
          <ArrowUpDown size={18} aria-hidden="true" />
        </button>
        <PlaceField label="Going to" tone="destination" node={node} query={destinationQuery} onQueryChange={setDestinationQuery} onChange={onDestinationChange} />
      </div>
      {errorMessage && <p role="alert" className="mt-3 border-l-4 border-avoid bg-avoid/5 px-3 py-2 text-sm font-bold text-avoid">{errorMessage}</p>}
      <button
        type="button"
        onClick={onRoute}
        disabled={!origin || !destination}
        className="route-submit mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-chip bg-brand-teal px-4 py-3 text-[15px] font-extrabold text-surface shadow-[0_12px_24px_rgb(22_123_118/0.24)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Navigation size={18} aria-hidden="true" /> Check this route
      </button>
    </section>
  );
}
