import { NextRequest } from "next/server";

import { apiError } from "@/lib/api-response";
import { getUserAllEmails } from "@/db/user";
import { sendEmail } from "@/services/email/send";
import { educationalDetailsUpdateReminderTemplate } from "@/services/email/templates/educational-details-update-reminder";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");

    if (auth !== `Bearer ${process.env.AUTOMATION_SECRET}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmails = await getUserAllEmails();

    const batches = [];
    for (let i = 0; i < userEmails.length; i += 50) {
      batches.push(userEmails.slice(i, i + 50));
    }

    for (const batch of batches) {
      await sendEmail({
        to: batch,
        subject: "Verify your academic information",
        html: educationalDetailsUpdateReminderTemplate(),
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return apiError("Server Error", 500);
  }
}
