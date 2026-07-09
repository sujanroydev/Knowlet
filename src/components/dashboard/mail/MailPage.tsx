"use client";

import { sendMailAction } from "@/app/(admin)/dashboard/mail/actions";
import { invitationToKnowletTemplate } from "@/services/email/templates/invitation-to-knowlet";
import { useState } from "react";
import { toast } from "sonner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MailPage() {
  const [sending, setSending] = useState(false);

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(
    "You're Invited to Join Knowlet – Study Smarter, Anytime",
  );
  const [body, setBody] = useState(invitationToKnowletTemplate());

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const emails = [
      ...new Set(
        to
          .split(/[\s,;]+/)
          .map((email) => email.trim())
          .filter(Boolean),
      ),
    ];

    if (emails.length === 0) {
      toast.error("Please enter at least one email address.");
      return;
    }

    const invalidEmails = emails.filter((email) => !EMAIL_REGEX.test(email));

    if (invalidEmails.length > 0) {
      toast.error(`Invalid email(s): ${invalidEmails.join(", ")}`);
      return;
    }

    setSending(true);

    try {
      const result = await sendMailAction(emails, subject, body);

      if (result.failed.length === 0) {
        toast.success(
          `Successfully sent ${result.sent} email${result.sent > 1 ? "s" : ""}.`,
        );

        setTo("");
        setSubject("");
        setBody(invitationToKnowletTemplate());
      } else if (result.sent > 0) {
        toast.warning(
          `Sent ${result.sent}/${result.total} emails. ${result.failed.length} failed.`,
        );

        console.table(result.failed);
      } else {
        toast.error("Failed to send any emails.");
        console.table(result.failed);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while sending emails.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">📧 Send Email</h1>

        <p className="mt-1 text-sm text-gray-500">
          Enter one or more email addresses separated by commas.
        </p>

        <form onSubmit={handleSend} className="mt-6 space-y-5">
          <div>
            <label htmlFor="to" className="mb-2 block text-sm font-medium">
              To
            </label>

            <input
              id="to"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="user1@example.com, user2@example.com"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium">
              Subject
            </label>

            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Welcome to Knowlet"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="body" className="mb-2 block text-sm font-medium">
              Body
            </label>

            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              placeholder="Write your email..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? `Sending...` : "Send Email"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
