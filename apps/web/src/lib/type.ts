export type Verdict = "pleasant" | "manageable" | "harsh" | "avoid";
export type EvidenceState = "positive" | "negative" | "unknown";
export type EvidenceSource = "osm" | "open-meteo" | "community";
export type ReportKind = "blocked" | "flooded" | "unlit" | "queue";

export interface Weather {
  apparentTemperatureC: number;
  rainProbabilityPct: number;
  multiplier: number;
  source: "open-meteo";
  fetchedAt: string;
}

export interface Evidence {
  kind: "sidewalk" | "crossing" | "lit" | "road_class" | "surface" | ReportKind;
  value: string;
  state: EvidenceState;
  delta: number;
  source: EvidenceSource;
  weight: number;
  sourceUrl: string | null;
  reportId: string | null;
  reporterKarma: number | null;
  reportedAt: string | null;
}

export interface Segment {
  segmentId: string;
  name: string;
  lengthM: number;
  score: number;
  polyline: [number, number][];
  roadClass: string;
  evidence: Evidence[];
  explanation: string;
}

export interface Route {
  routeId: string;
  originLabel: string;
  destinationLabel: string;
  departureTime: string;
  distanceM: number;
  durationMin: number;
  score: number;
  verdict: Verdict;
  coveragePct: number;
  weather: Weather;
  isFixture: boolean;
  segment: Segment[];
}

export interface Report {
  reportId: string;
  deviceId: string;
  segmentRef: string;
  kind: ReportKind;
  note: string | null;
  lat: number | null;
  lng: number | null;
  acceptCount: number;
  disputeCount: number;
  createdAt: string;
}

export type DepartureTime = "06:00" | "14:00";

export type PlaceKind = "campus" | "crossing" | "landmark" | "transit" | "junction";
export type ReviewTarget = "node" | "thread";

export interface PlaceNode {
  nodeId: string;
  name: string;
  shortName: string;
  alias: string[];
  kind: PlaceKind;
  position: [number, number];
  isAccessible: boolean;
}

export interface RouteEdge {
  edgeId: string;
  fromNodeId: string;
  toNodeId: string;
  distanceM: number;
  costMinute: number;
  score: number;
  isOneWay: boolean;
  roadClass: string;
  explanation: string;
}

export interface RouteGraph {
  node: PlaceNode[];
  edge: RouteEdge[];
}

export interface PathSuccess {
  isSuccess: true;
  nodeId: string[];
  edgeId: string[];
  costMinute: number;
  distanceM: number;
}

export interface PathFailure {
  isSuccess: false;
  reason: "missing_node" | "unreachable" | "negative_cost" | "invalid_cost";
  nodeId: string[];
  edgeId: string[];
  costMinute: 0;
  distanceM: 0;
}

export type PathResult = PathSuccess | PathFailure;

export interface RouteThread {
  threadId: string;
  routeId: string;
  question: string;
  body: string;
  askedBy: string;
  askedAt: string;
  nodeId: string[];
}

export interface Review {
  reviewId: string;
  target: ReviewTarget;
  targetId: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  createdAt: string;
}

export interface ReviewSummary {
  reviewCount: number;
  ratingAverage: number | null;
  rating: { value: number; count: number }[];
  theme: string[];
}

export interface ReviewMatch {
  review: Review;
  similarity: number;
}

export interface RouteAlternative {
  routeId: string;
  label: string;
  profile: import("./routeProfile").RouteProfileId[];
  path: PathSuccess;
  route: Route;
  thread: RouteThread[];
}
