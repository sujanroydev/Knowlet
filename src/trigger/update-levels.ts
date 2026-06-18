import { schedules, logger } from "@trigger.dev/sdk/v3";

export const updateLevels = schedules.task({
  id: "update-levels",
  // cron: "0 0 1 1,7 *",
  cron: "*/2 * * * *",

  run: async () => {
    try {
      const res = await fetch(
        "https://knowlet.in/api/automation/level-update",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.AUTOMATION_SECRET}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API failed: ${res.status} - ${text}`);
      }

      const data = await res.json();
      logger.info("Level update success", { data });
    } catch (err) {
      logger.error("Level update failed", { err });
      throw err;
    }
  },
});
