"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Bell,
  Send,
  Save,
  BarChart3,
  History,
  FileText,
} from "lucide-react";

type NotificationData = {
  id?: string;
  title: string;
  body: string;
  image: string;
  url: string;
  to?: string;
};

const defaultPreview = {
  title: "⚡ Stop Scrolling. Start Revising.",
  body: "Important topics, quick notes & exam-focused questions ready for you.",
  image:
    "https://res.cloudinary.com/db975putk/image/upload/q_auto/f_auto/v1779595876/IMG_20260524_094028_cmlvb1.png",
  url: "https://knowlet.in",
};

export default function NotificationAdminPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const [drafts, setDrafts] = useState<NotificationData[]>([]);
  const [history, setHistory] = useState<NotificationData[]>([]);

  const [sentCount, setSentCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    loadDrafts();
    loadHistory();
    loadStats();
  }, []);

  function loadDrafts() {
    const data = JSON.parse(localStorage.getItem("drafts") || "[]");
    setDrafts(data);
  }

  function loadHistory() {
    const data = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(data);
  }

  function loadStats() {
    setSentCount(Number(localStorage.getItem("sent") || 0));
    setClickCount(Number(localStorage.getItem("clicks") || 0));
  }

  function loadInput(data: NotificationData) {
    setTitle(data.title || "");
    setBody(data.body || "");
    setImage(data.image || "");
    setUrl(data.url || "");
  }

  async function sendNow(to?: string) {
    try {
      const payload = {
        title: title || defaultPreview.title,
        body: body || defaultPreview.body,
        image: image || defaultPreview.image,
        url: url || defaultPreview.url,
      };

      const res = await fetch("/api/notification/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to send notification");
        return;
      }

      const newHistory = [
        ...history,
        {
          id: crypto.randomUUID(),
          title: payload.title,
          body: payload.body,
          image: payload.image,
          url: payload.url,
          to: to || "public",
        },
      ];

      localStorage.setItem("history", JSON.stringify(newHistory));
      setHistory(newHistory);

      const newSentCount = sentCount + 1;
      localStorage.setItem("sent", String(newSentCount));
      setSentCount(newSentCount);

      alert("Notification sent!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  function saveDraft() {
    const draft = {
      id: crypto.randomUUID(),
      title,
      body,
      image,
      url,
    };

    const updatedDrafts = [...drafts, draft];

    localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);

    alert("Draft saved!");
  }

  function removeItem(id: string, from: "drafts" | "history") {
    if (from === "drafts") {
      const updated = drafts.filter((item) => item.id !== id);

      localStorage.setItem("drafts", JSON.stringify(updated));
      setDrafts(updated);
    }

    if (from === "history") {
      const updated = history.filter((item) => item.id !== id);

      localStorage.setItem("history", JSON.stringify(updated));
      setHistory(updated);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-600 p-3 text-white">
            <Bell />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Notification Dashboard</h1>

            <p className="text-gray-500">
              Manage push notifications for Knowlet
            </p>
          </div>
        </div>

        {/* Top Grid */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Create Notification */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Create Notification</h2>

            <div className="space-y-4">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <textarea
                placeholder="Message"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="h-28 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                placeholder="Click URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => sendNow()}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
              >
                <Send size={18} />
                Send
              </button>

              <button
                onClick={saveDraft}
                className="flex items-center gap-2 rounded-xl bg-gray-800 px-5 py-3 text-white transition hover:bg-black"
              >
                <Save size={18} />
                Save Draft
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Preview</h2>

            <div
              onClick={() => window.open(url || defaultPreview.url, "_blank")}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
            >
              <div className="p-5">
                <h3 className="mb-2 text-2xl font-bold">
                  {title || defaultPreview.title}
                </h3>

                <p className="text-gray-600">{body || defaultPreview.body}</p>
              </div>

              <img
                src={image || defaultPreview.image}
                alt="preview"
                className="h-64 w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Drafts + History */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Drafts */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <FileText className="text-blue-600" />
              <h2 className="text-xl font-semibold">Drafts</h2>
            </div>

            <div className="space-y-2">
              {drafts.length ? (
                drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => loadInput(draft)}
                    >
                      <p className="font-medium">{draft.title || "Untitled"}</p>

                      <p className="line-clamp-1 text-sm text-gray-500">
                        {draft.body}
                      </p>
                    </div>

                    <button
                      onClick={() => draft.id && removeItem(draft.id, "drafts")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-gray-400">
                  No drafts available
                </p>
              )}
            </div>
          </div>

          {/* History */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <History className="text-green-600" />
              <h2 className="text-xl font-semibold">History</h2>
            </div>

            <div className="space-y-2">
              {history.length ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadInput(item)}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{item.title || "Untitled"}</p>

                      <p className="text-sm text-gray-500">
                        Visible to:{" "}
                        <span className="font-medium text-green-600">
                          {item.to}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-gray-400">
                  No notification history
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="text-purple-600" />
            <h2 className="text-xl font-semibold">Stats</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm text-gray-500">Total Sent</p>

              <h3 className="mt-2 text-4xl font-bold text-blue-600">
                {sentCount}
              </h3>
            </div>

            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-sm text-gray-500">Total Clicks</p>

              <h3 className="mt-2 text-4xl font-bold text-green-600">
                {clickCount}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
