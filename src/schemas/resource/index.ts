import { z } from "zod";

export const ResourceStatsSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  path: z.string(),
  views: z.number(),
  likes: z.number(),
  bookmarks: z.number(),
  feedbacks: z.number(),
  reports: z.number(),
});

export type Resource = z.infer<typeof ResourceStatsSchema>;
