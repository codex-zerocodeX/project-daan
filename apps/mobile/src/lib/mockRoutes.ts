// Mock route/review data mirroring the Lakbay UI kit click-through
// (ui_kits/lakbay-app). This is placeholder content until POST /v1/routes/plan
// returns real community-stitched routes.

export type LegMode = "walk" | "bus" | "transfer";
export type Tone = "good" | "warn" | "alert";
export type CrowdLevel = 1 | 2 | 3 | 4;

export type RouteLeg = { mode: LegMode; label: string };

export type TripStep = {
  kind: "origin" | "bus" | "destination";
  title: string; // empty for "destination" — filled with the searched place
  subtitle: string;
};

export type RouteSummary = {
  id: string;
  exact: boolean;
  near?: string;
  legs: RouteLeg[];
  duration: string;
  fare: string;
  score: number;
  reviewCount: number;
  crowd: CrowdLevel;
  reliability: string;
  reliabilityTone: Tone;
  walk: string;
  recommended: boolean;
  steps: TripStep[];
};

export type RouteReview = {
  author: string;
  timeAgo: string;
  rating: number;
  comment: string;
  crowd: CrowdLevel;
  reliability: { label: string; tone: Tone };
  walkability: { label: string; tone: Tone };
  helpful: number;
};

export const MOCK_ORIGIN = "Ateneo, Katipunan";
export const DEFAULT_DESTINATION = "Ortigas Center";

export const EXACT_ROUTES: RouteSummary[] = [
  {
    id: "1",
    exact: true,
    legs: [
      { mode: "walk", label: "5 min" },
      { mode: "bus", label: "EDSA Carousel" },
      { mode: "walk", label: "3 min" },
    ],
    duration: "38 min",
    fare: "₱15",
    score: 4.3,
    reviewCount: 128,
    crowd: 2,
    reliability: "On time",
    reliabilityTone: "good",
    walk: "8 min",
    recommended: true,
    steps: [
      { kind: "origin", title: MOCK_ORIGIN, subtitle: "Walk 5 min to Katipunan stop" },
      { kind: "bus", title: "EDSA Carousel", subtitle: "11 stops · usually 26 min" },
      { kind: "destination", title: "", subtitle: "Walk 3 min to destination" },
    ],
  },
  {
    id: "2",
    exact: true,
    legs: [
      { mode: "walk", label: "7 min" },
      { mode: "bus", label: "P2P Ortigas" },
      { mode: "walk", label: "2 min" },
    ],
    duration: "31 min",
    fare: "₱60",
    score: 4.6,
    reviewCount: 74,
    crowd: 1,
    reliability: "On time",
    reliabilityTone: "good",
    walk: "9 min",
    recommended: false,
    steps: [
      { kind: "origin", title: MOCK_ORIGIN, subtitle: "Walk 7 min to P2P terminal" },
      { kind: "bus", title: "P2P Ortigas", subtitle: "Nonstop · usually 22 min" },
      { kind: "destination", title: "", subtitle: "Walk 2 min to destination" },
    ],
  },
  {
    id: "3",
    exact: true,
    legs: [
      { mode: "bus", label: "Route 12" },
      { mode: "transfer", label: "" },
      { mode: "bus", label: "Route 8" },
    ],
    duration: "52 min",
    fare: "₱24",
    score: 3.8,
    reviewCount: 212,
    crowd: 4,
    reliability: "Often delayed",
    reliabilityTone: "alert",
    walk: "4 min",
    recommended: false,
    steps: [
      { kind: "origin", title: MOCK_ORIGIN, subtitle: "Board Route 12 at the corner stop" },
      { kind: "bus", title: "Route 12", subtitle: "8 stops · transfer at Cubao" },
      { kind: "bus", title: "Route 8", subtitle: "6 stops · usually 20 min" },
      { kind: "destination", title: "", subtitle: "Walk 4 min to destination" },
    ],
  },
];

// Same origin, nearby drop-off — the "No exact match nearby?" fallback.
export const SIMILAR_ROUTES: RouteSummary[] = [
  {
    id: "4",
    exact: false,
    near: "Gateway Mall (350 m away)",
    legs: [
      { mode: "walk", label: "6 min" },
      { mode: "bus", label: "EDSA Carousel" },
    ],
    duration: "34 min",
    fare: "₱15",
    score: 4.2,
    reviewCount: 96,
    crowd: 2,
    reliability: "On time",
    reliabilityTone: "good",
    walk: "6 min",
    recommended: false,
    steps: [
      { kind: "origin", title: MOCK_ORIGIN, subtitle: "Walk 6 min to Katipunan stop" },
      { kind: "bus", title: "EDSA Carousel", subtitle: "9 stops · usually 24 min" },
      { kind: "destination", title: "", subtitle: "Drops off near Gateway Mall (350 m away)" },
    ],
  },
];

export const MOCK_REVIEWS: RouteReview[] = [
  {
    author: "Marco R.",
    timeAgo: "2 days ago",
    rating: 4,
    comment:
      "Calm before 7am, seats most days. The driver actually waits at the stop instead of rolling past.",
    crowd: 2,
    reliability: { label: "On time", tone: "good" },
    walkability: { label: "Easy", tone: "good" },
    helpful: 12,
  },
  {
    author: "Jasmine L.",
    timeAgo: "5 days ago",
    rating: 3,
    comment:
      "Gets packed by 8am — had to wait two buses. Walk from the stop is short and shaded though.",
    crowd: 4,
    reliability: { label: "A bit late", tone: "warn" },
    walkability: { label: "Easy", tone: "good" },
    helpful: 7,
  },
  {
    author: "Paolo D.",
    timeAgo: "1 week ago",
    rating: 5,
    comment:
      "My daily ride. Fare is unbeatable and the new lane keeps it moving even in rush hour.",
    crowd: 2,
    reliability: { label: "On time", tone: "good" },
    walkability: { label: "Moderate", tone: "warn" },
    helpful: 20,
  },
];

export function findRoute(id: string): RouteSummary | undefined {
  return [...EXACT_ROUTES, ...SIMILAR_ROUTES].find((r) => r.id === id);
}
