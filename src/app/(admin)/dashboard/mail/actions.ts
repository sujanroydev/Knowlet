"use server";

import { sendEmail } from "@/services/email/send";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendMailAction(
  to: string | string[],
  subject: string,
  body: string,
  from = "Knowlet <hello@knowlet.in>",
) {
  const recipients = Array.isArray(to) ? to : [to];

  let sent = 0;
  const failed: { email: string; error: string }[] = [];

  for (const email of recipients) {
    try {
      await sendEmail({
        to: email.trim(),
        from,
        subject,
        html: body,
      });

      sent++;

      await sleep(550);
    } catch (error) {
      failed.push({
        email,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      await sleep(550);
    }
  }

  return {
    total: recipients.length,
    sent,
    failed,
  };
}
