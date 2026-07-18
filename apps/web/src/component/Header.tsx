import { Footprints } from "lucide-react";

export function Header() {
  return (
    <header className="daan-header flex min-h-16 items-center justify-between gap-4 border-b border-line bg-surface pr-4 sm:min-h-[78px] sm:pr-7 lg:pr-9">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <span className="daan-brand-mark h-16 w-[72px] shrink-0 rounded-br-[20px] sm:h-[78px] sm:w-[112px] sm:rounded-br-[24px]" aria-hidden="true">
          <img src="/asset/alitaptap-mark.webp" alt="" />
        </span>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2.5">
            <p className="text-xl font-extrabold tracking-[-0.045em] text-ink sm:text-[22px]">Daan</p>
            <span className="hidden text-[11px] font-extrabold uppercase tracking-[0.15em] text-ink sm:inline">
              Evidence for the way ahead
            </span>
          </div>
          <p className="truncate text-xs font-semibold text-ink-soft sm:text-[15px] sm:font-medium">How Walkable?<span className="hidden sm:inline"> · module 1 of the receipt engine</span></p>
        </div>
      </div>
      <div className="hidden min-h-10 items-center gap-2 rounded-chip border border-line bg-surface px-4 py-2 text-xs font-bold text-ink md:flex">
        <Footprints size={16} aria-hidden="true" />
        Metro Manila
      </div>
    </header>
  );
}
