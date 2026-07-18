import { CircleCheckBig, CircleHelp, OctagonX, SunMedium, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Verdict } from "./type";

export interface VerdictMeta {
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  className: string;
}

export const verdictMeta: Record<Verdict | "unknown", VerdictMeta> = {
  pleasant: {
    label: "Pleasant",
    shortLabel: "Good",
    description: "Comfortable conditions for this walk",
    icon: CircleCheckBig,
    className: "verdict-pleasant",
  },
  manageable: {
    label: "Manageable",
    shortLabel: "Okay",
    description: "Walkable with a few trade-offs",
    icon: SunMedium,
    className: "verdict-manageable",
  },
  harsh: {
    label: "Harsh",
    shortLabel: "Harsh",
    description: "Heat and route friction make this walk harsh",
    icon: TriangleAlert,
    className: "verdict-harsh",
  },
  avoid: {
    label: "Avoid",
    shortLabel: "Avoid",
    description: "Consider another way to travel",
    icon: OctagonX,
    className: "verdict-avoid",
  },
  unknown: {
    label: "Unknown",
    shortLabel: "Unknown",
    description: "Evidence has not been mapped yet",
    icon: CircleHelp,
    className: "verdict-unknown",
  },
};

export function verdictFromScore(score: number): Verdict {
  if (score >= 70) return "pleasant";
  if (score >= 50) return "manageable";
  if (score >= 30) return "harsh";
  return "avoid";
}
