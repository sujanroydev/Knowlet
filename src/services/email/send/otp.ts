import { sendEmail } from "@/services/email/send";

export async function sendOtpEmail({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: string;
}) {
  const emailHeader =
    type === "change_password"
      ? "<h2>Password Change OTP</h2>"
      : type === "set_password"
        ? "<h2>Password Reset OTP</h2>"
        : "<h2>Email Verification OTP</h2>";

  await sendEmail({
    from: "Knowlet Auth <auth@knowlet.in>",
    replyTo: "support@knowlet.in",
    to: email,
    subject: "Verify Your Email",
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            ${emailHeader && `<h2>${emailHeader}</h2>`}
            <p>Your OTP is:</p>
            <h1 style="letter-spacing: 4px;">${otp}</h1>
            <p>This OTP expires in 10 minutes.</p>
            <p>If you did not request this, ignore this email.</p>
            <p> Team Knowlet</p>  
          </div>
        `,
  });
}
