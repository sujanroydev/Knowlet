import { z } from "zod";

export const ReportStatusSchema = z.enum([
  "open",
  "reviewed",
  "resolved",
  "dismissed",
]);

export type ReportStatus = z.infer<typeof ReportStatusSchema>;

export const ReportSchema = z.object({
  id: z.string(),
  reason: z.string(),
  details: z.string().nullable(),
  status: ReportStatusSchema,
  created_at: z.string(),

  resource: z.object({
      id: z.string(),
      title: z.string(),
      path: z.string(),
  }).nullable(),

  user: z.object({
      id: z.string(),
      name: z.string(),
      picture: z.string().nullable(),
  }).nullable(),
});

export type Report = z.infer<typeof ReportSchema>;