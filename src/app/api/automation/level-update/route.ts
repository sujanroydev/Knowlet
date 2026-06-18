import { apiError } from "@/lib/api-response";
import { sendNotificationByEmailId } from "@/services/notification/send";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
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
  } catch (error) {
    return apiError("Server Error", 500);
  }
}
