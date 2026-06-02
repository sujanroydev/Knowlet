import connectDb from "@/lib/db";
import { resend } from "@/lib/resend";
import { getUserEmail } from "@/services/user/get/email";

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

export async function sendEmailByUserId({
  user_id,
  subject,
  html,
  from = "Knowlet <noreply@knowlet.in>",
  replyTo,
}: {
  user_id: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}) {
  try {
    if (!user_id) throw new Error("User ID is required to send email");

    const email = await getUserEmail(user_id);

    const data = await sendEmail({ from, to: email, subject, html, replyTo });

    return data;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}
