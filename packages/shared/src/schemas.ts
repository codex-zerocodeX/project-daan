import { z } from "zod";

export const ThreadCategorySchema = z.enum([
  "route",
  "terminal",
  "hazard",
  "walkability",
  "general",
]);

export const ProfileSchema = z.object({
  id: z.uuid(),
  username: z.string().min(3).max(30),
  karma: z.number().int(),
  created_at: z.string(),
});

export const ThreadSchema = z.object({
  id: z.uuid(),
  author_id: z.uuid(),
  title: z.string().min(1).max(200),
  body: z.string().max(5000),
  category: ThreadCategorySchema,
  image_url: z.url().nullable(),
  created_at: z.string(),
});

export const VoteSchema = z.object({
  thread_id: z.uuid(),
  user_id: z.uuid(),
  value: z.union([z.literal(1), z.literal(-1)]),
  created_at: z.string(),
});

export const CommentSchema = z.object({
  id: z.uuid(),
  thread_id: z.uuid(),
  author_id: z.uuid(),
  body: z.string().min(1).max(2000),
  image_url: z.url().nullable(),
  created_at: z.string(),
});

// An answer to a thread: an ordered set of nodes forming a route.
export const RouteSchema = z.object({
  id: z.uuid(),
  thread_id: z.uuid(),
  author_id: z.uuid(),
  summary: z.string().max(2000),
  created_at: z.string(),
});

// One step on an answer-route: a map point with an optional image.
export const NodeSchema = z.object({
  id: z.uuid(),
  route_id: z.uuid(),
  seq: z.number().int().min(0),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  label: z.string().max(500),
  image_url: z.url().nullable(),
  created_at: z.string(),
});

export const RouteVoteSchema = z.object({
  route_id: z.uuid(),
  user_id: z.uuid(),
  value: z.union([z.literal(1), z.literal(-1)]),
  created_at: z.string(),
});

export const LatLngSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const RoutePlanRequestSchema = z.object({
  origin: LatLngSchema,
  destination: LatLngSchema,
});

export const RoutePlanResponseSchema = z.object({
  route: z.object({
    type: z.literal("Feature"),
    geometry: z.object({
      type: z.literal("LineString"),
      coordinates: z.array(z.tuple([z.number(), z.number()])),
    }),
    properties: z.object({
      walkability_score: z.number().min(0).max(100),
      summary: z.string(),
    }),
  }),
});

// Route composition: stitch nodes from many threads into a single route.
export const ComposeRequestSchema = z.object({
  origin: LatLngSchema,
  destination: LatLngSchema,
});

export const ComposeStepSchema = z.object({
  node_id: z.uuid(),
  label: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export const ComposeResponseSchema = z.object({
  route: z.object({
    type: z.literal("Feature"),
    geometry: z.object({
      type: z.literal("LineString"),
      coordinates: z.array(z.tuple([z.number(), z.number()])),
    }),
    properties: z.object({
      // true when a single existing answer already spanned origin->destination
      existing: z.boolean(),
      distance_m: z.number(),
      // threads / answer-routes whose nodes were stitched into this route
      thread_ids: z.array(z.uuid()),
      route_ids: z.array(z.uuid()),
      steps: z.array(ComposeStepSchema),
      summary: z.string(),
    }),
  }),
});

// Thread search: find community threads relevant to an origin->destination trip.
// This is the primary flow - threads first, composed routes only as a fallback.
export const ThreadSearchRequestSchema = z.object({
  origin: LatLngSchema,
  destination: LatLngSchema,
});

/** "exact" = one answer-route covers both ends; "partial" = it covers only one. */
export const ThreadMatchSchema = z.enum(["exact", "partial"]);

export const ThreadSearchResultSchema = z.object({
  thread: ThreadSchema,
  match: ThreadMatchSchema,
  /** metres from the trip endpoint to the nearest node on this thread's answers */
  origin_distance_m: z.number().nullable(),
  destination_distance_m: z.number().nullable(),
  route_ids: z.array(z.uuid()),
  answer_count: z.number().int(),
});

export const ThreadSearchResponseSchema = z.object({
  results: z.array(ThreadSearchResultSchema),
});

export type ThreadSearchRequest = z.infer<typeof ThreadSearchRequestSchema>;
export type ThreadMatch = z.infer<typeof ThreadMatchSchema>;
export type ThreadSearchResult = z.infer<typeof ThreadSearchResultSchema>;
export type ThreadSearchResponse = z.infer<typeof ThreadSearchResponseSchema>;

export type ThreadCategory = z.infer<typeof ThreadCategorySchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Thread = z.infer<typeof ThreadSchema>;
export type Vote = z.infer<typeof VoteSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type Route = z.infer<typeof RouteSchema>;
export type Node = z.infer<typeof NodeSchema>;
export type RouteVote = z.infer<typeof RouteVoteSchema>;
export type LatLng = z.infer<typeof LatLngSchema>;
export type RoutePlanRequest = z.infer<typeof RoutePlanRequestSchema>;
export type RoutePlanResponse = z.infer<typeof RoutePlanResponseSchema>;
export type ComposeRequest = z.infer<typeof ComposeRequestSchema>;
export type ComposeStep = z.infer<typeof ComposeStepSchema>;
export type ComposeResponse = z.infer<typeof ComposeResponseSchema>;
