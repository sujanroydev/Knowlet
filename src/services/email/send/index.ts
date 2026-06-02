import { resend } from "@/lib/resend";

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  from = "Knowlet <noreply@knowlet.in>",
  replyTo,
}: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error("Email send failed:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}
