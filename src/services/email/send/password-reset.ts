import { sendEmail } from "@/services/email/send";

export async function sendPasswordResetEmail({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  return sendEmail({
    from: "Knowlet Auth <auth@knowlet.in>",
    replyTo: "support@knowlet.in",
    to: email,
    subject: "Reset your Knowlet password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset OTP</h2>

        <p>Your OTP for resetting your Knowlet password is:</p>

        <h1 style="letter-spacing: 4px;">${otp}</h1>

        <p>
          This OTP expires in 10 minutes.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <p>
          — Team Knowlet
        </p>
      </div>
    `,
  });
}
