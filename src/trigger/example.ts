import { schedules } from "@trigger.dev/sdk/v3";
import { sendNotificationByEmailId } from "@/services/notification/send";

export const levelUpdateTask = schedules.task({
  id: "level-update",
  cron: "*/1 * * * *",

  run: async () => {
    await sendNotificationByEmailId({
      title: "Hello from Trigger.dev",
      emailId: "sujanroydev@gmail.com",
      options: {},
    });
  },
});
