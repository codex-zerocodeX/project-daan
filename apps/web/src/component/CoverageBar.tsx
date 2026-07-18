import { CircleHelp, ShieldCheck } from "lucide-react";

interface CoverageBarProp {
  coveragePct: number;
}

export function CoverageBar({ coveragePct }: CoverageBarProp) {
  const unknownPct = 100 - coveragePct;

  return (
    <section className="rounded-card border border-line bg-surface p-4 shadow-[0_10px_30px_rgb(8_34_55/0.035)] lg:p-3" aria-labelledby="coverage-heading">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-pleasant" aria-hidden="true" />
            <h2 id="coverage-heading" className="text-sm font-extrabold">
              {coveragePct}% evidence coverage
            </h2>
          </div>
          <p className="mt-1 text-xs font-medium text-ink-soft">Structural infrastructure data covers {coveragePct}% of this route.</p>
        </div>
        <span className="font-mono text-xs font-bold text-unknown">{unknownPct}% unknown</span>
      </div>

      <div
        className="mt-3 flex h-3 overflow-hidden rounded-chip bg-paper lg:mt-2"
        role="img"
        aria-label={`${coveragePct}% of route length has structural infrastructure evidence; ${unknownPct}% is unknown`}
      >
        <span className="daan-spectrum" style={{ width: `${coveragePct}%` }} />
        <span className="coverage-unknown flex-1" />
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-unknown">
        <CircleHelp size={14} aria-hidden="true" />
        Unknown is not scored and never hidden.
      </p>
    </section>
  );
}
