import ReportsClient from "./client";
import { fetchResourceReports } from "@/db/resource/report";

export default async function ReportsPage() {
  const reports = await fetchResourceReports();

  return <ReportsClient initialReports={reports} />;
}
