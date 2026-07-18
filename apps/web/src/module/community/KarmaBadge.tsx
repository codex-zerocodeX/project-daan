import { Award } from "lucide-react";

interface KarmaBadgeProp {
  karma: number;
  weight: number;
}

export function KarmaBadge({ karma, weight }: KarmaBadgeProp) {
  return (
    <span className="inline-flex items-center gap-1 rounded-chip border border-line bg-paper px-2 py-1 font-mono text-[10px] font-bold text-ink-soft">
      <Award size={12} aria-hidden="true" /> karma {karma} · ×{weight.toFixed(1)}
    </span>
  );
}
