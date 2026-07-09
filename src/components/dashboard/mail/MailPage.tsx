"use client";

import { sendMailAction } from "@/app/(admin)/dashboard/mail/actions";
import { useState } from "react";

export default function MailPage() {
  const [sending, setSending] = useState(false);

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSending(true);

    try {
      await sendMailAction(to, subject, body);

      setTo("");
      setSubject("");
      setBody("");
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">📧 Send Email</h1>
        <p className="mt-1 text-sm text-gray-500">Send a single email.</p>

        <form onSubmit={handleSend} className="mt-6 space-y-5">
          <div>
            <label htmlFor="to" className="mb-2 block text-sm font-medium">
              To
            </label>

            <input
              id="to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="user@example.com"
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
              {sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
