import { apiError } from "@/lib/api-response";
import connectDb from "@/lib/db";
import { sendEmail } from "@/services/email/send";
import { educationalDetailsUpdateReminderTemplate } from "@/services/email/templates/educational-details-update-reminder";
import { sendNotificationByEmailId } from "@/services/notification/send";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");

    if (auth !== `Bearer ${process.env.AUTOMATION_SECRET}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDb();
    const { data, error } = await db.from("users").select("email");

    if (error) throw error;
    const userEmails = data.map((i) => i.email) as string[];

    await sendEmail({
      // to: userEmails,
      to: "sujanroydev@gmail.com",
      subject: "Verify your academic information",
      html: educationalDetailsUpdateReminderTemplate(),
    });

    return Response.json({ success: true });
  } catch (error) {
    return apiError("Server Error", 500);
  }
}
