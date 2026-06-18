import { schedules, logger } from "@trigger.dev/sdk/v3";

const isProduction = process.env.NODE_ENV === "production";

export const updateLevels = schedules.task({
  id: "update-levels",
  cron: isProduction ? "0 0 1 1,7 *" : "*/5 * * * *",

  run: async () => {
    try {
      const url = isProduction
        ? "https://knowlet.in/api/automation/level-update"
        : "http://localhost:3000/api/automation/level-update";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AUTOMATION_SECRET}`,
          "Content-Type": "application/json",
        },
      });

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
