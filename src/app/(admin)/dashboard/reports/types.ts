export type ReportStatus = "open" | "reviewed" | "resolved" | "dismissed";

export type Report = {
  id: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  created_at: string;

  resource: {
    id: string;
    title: string;
    path: string;
  } | null;

  user: {
    id: string;
    name: string;
    picture: string | null;
  } | null;
};
