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

// AI thread search: a natural-language question answered from existing threads.
export const AiSearchRequestSchema = z.object({
  query: z.string().min(3).max(200),
});

export const AiSearchResponseSchema = z.object({
  answer: z.string(),
  // threads the answer drew on, most relevant first
  thread_ids: z.array(z.uuid()).max(5),
});

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
export type AiSearchRequest = z.infer<typeof AiSearchRequestSchema>;
export type AiSearchResponse = z.infer<typeof AiSearchResponseSchema>;
