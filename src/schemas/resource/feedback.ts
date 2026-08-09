import { z } from "zod";

export const feedbackSchema = z.object({
  id: z.string(),
  message: z.string(),
  created_at: z.string(),

  resource: z.object({
    id: z.string(),
    title: z.string(),
  }).nullable(),

  user: z.object({
    id: z.string(),
    name: z.string(),
    picture: z.string().nullable(),
  }).nullable(),
});

export type Feedback = z.infer<typeof feedbackSchema>;