import { sendNotificationByEmailId } from "@/services/notification/send";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await sendNotificationByEmailId({
    title: "Hello from github actions",
    emailId: "sujanroydev@gmail.com",
    options: {},
  });

  return Response.json({ success: true });
}
