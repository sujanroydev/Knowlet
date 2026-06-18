import connectDb from "@/lib/db";
import { sendEmailByUserId } from "@/services/email/send";
import { educationalDetailsUpdateReminderTemplate } from "@/services/email/templates/educational-details-update-reminder";
import { schedules } from "@trigger.dev/sdk/v3";

export const updateLevels = schedules.task({
  id: "update-levels",
  cron: "0 0 1 1,7 *",
  run: async () => {
    // const db = await connectDb();
    // const { data, error } = await db.from("users").select("id");

    // if (error) throw error;
    // const users = data.map((i) => i.id) as string[];

    await sendEmailByUserId({
      user_id: "7cf87d0f-55d0-4275-93df-d240980e436c",
      subject: "Verify your academic information",
      html: educationalDetailsUpdateReminderTemplate(),
    });
  },
});
