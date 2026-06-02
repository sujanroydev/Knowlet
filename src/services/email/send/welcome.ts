// src/services/email/send-welcome.ts

import { sendEmail } from "./index";

export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name?: string;
}) {
  return sendEmail({
    from: "Knowlet <welcome@knowlet.in>",
    to: email,
    subject: "Welcome to Knowlet 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to Knowlet!</h1>

        <p>
          Hi ${name || "there"},
        </p>

        <p>
          Thanks for joining Knowlet. You can now explore study materials,
          save bookmarks, track your reading history, and access resources
          from one place.
        </p>

        <p>
          Happy learning!
        </p>

        <p>
          — Team Knowlet
        </p>
      </div>
    `,
  });
}