import { Check, Copy, Link2 } from "lucide-react";
import { useState } from "react";
import type { Route } from "../lib/type";
import { verdictMeta } from "../lib/verdict";

interface ShareBarProp {
  route: Route;
  receiptKey: string;
}

interface ShareActionProp {
  route: Route;
}

function ShareAction({ route }: ShareActionProp) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  async function copySummary() {
    const summary = `Daan: ${route.originLabel} to ${route.destinationLabel} scores ${route.score}/100 (${verdictMeta[route.verdict].label}) with ${route.coveragePct}% evidence coverage.`;
    try {
      await navigator.clipboard.writeText(`${summary} ${window.location.href}`);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copySummary}
      aria-live="polite"
      className="print-hide inline-flex items-center gap-2 rounded-chip bg-ink px-3 py-2 text-xs font-extrabold text-surface hover:bg-ink/90"
    >
      {copyState === "copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy unavailable" : "Copy route receipt"}
    </button>
  );
}

export function ShareBar({ route, receiptKey }: ShareBarProp) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
        <Link2 size={13} aria-hidden="true" />
        © OpenStreetMap contributors · Weather by Open-Meteo
      </p>
      <ShareAction key={receiptKey} route={route} />
    </footer>
  );
}
