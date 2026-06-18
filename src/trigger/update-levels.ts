import { schedules } from "@trigger.dev/sdk/v3";
import { sendNotificationByEmailId } from "@/services/notification/send";

export const updateLevels = schedules.task({
  id: "update-levels",
  cron: "0 0 1 1,7 *", // Jan 1 and Jul 1
  run: async () => {
    // recalculate levels
  },
});
