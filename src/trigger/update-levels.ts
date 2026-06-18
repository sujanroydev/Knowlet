import connectDb from "@/lib/db";
import { sendEmail } from "@/services/email/send";
import { educationalDetailsUpdateReminderTemplate } from "@/services/email/templates/educational-details-update-reminder";
import { schedules } from "@trigger.dev/sdk/v3";

export const updateLevels = schedules.task({
  id: "update-levels",
  cron: "0 0 1 1,7 *",
  run: async () => {
    const db = await connectDb();
    const { data, error } = await db.from("users").select("email");

    if (error) throw error;
    const userEmails = data.map((i) => i.email) as string[];

    await sendEmail({
      to: userEmails,
      subject: "Verify your academic information",
      html: educationalDetailsUpdateReminderTemplate(),
    });
  },
});
