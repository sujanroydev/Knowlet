"use server";

import { sendEmail } from "@/services/email/send";

export async function sendMailAction(
  to: string,
  subject: string,
  body: string,
  from = "hello@knowlet.in",
) {
  await sendEmail({
    to,
    from,
    subject,
    html: body,
  });
}
