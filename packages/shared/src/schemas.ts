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

export type ThreadCategory = z.infer<typeof ThreadCategorySchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Thread = z.infer<typeof ThreadSchema>;
export type Vote = z.infer<typeof VoteSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type LatLng = z.infer<typeof LatLngSchema>;
export type RoutePlanRequest = z.infer<typeof RoutePlanRequestSchema>;
export type RoutePlanResponse = z.infer<typeof RoutePlanResponseSchema>;
