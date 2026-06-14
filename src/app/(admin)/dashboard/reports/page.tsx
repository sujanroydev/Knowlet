import connectDb from "@/lib/db";
import ReportsClient from "./client";
import { Report } from "./types";

export default async function ReportsPage() {
  const db = await connectDb();

  const { data, error } = await db
    .from("resource_reports")
    .select(
      `
      id,
      reason,
      details,
      status,
      created_at,
      resource:resources (
        id,
        title,
        path
      ),
      user:users (
        id,
        name,
        picture
      )
    `,
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return <ReportsClient initialReports={data as unknown as Report[]} />;
}
