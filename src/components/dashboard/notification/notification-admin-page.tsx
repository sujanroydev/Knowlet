"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Bell,
  Send,
  Save,
  History,
  FileText,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { Bars } from "react-loader-spinner";

type NotificationData = {
  id?: string;
  title: string;
  body: string;
  image: string;
  icon?: string;
  badge?: string;
  tag?: string;
  action_url: string;
};

const defaultPreview = {
  title: "Stop Scrolling. Start Revising.",
  body: "Important topics, quick notes & exam-focused questions ready for you.",
  image:
    "https://res.cloudinary.com/db975putk/image/upload/q_auto/f_auto/v1779595876/IMG_20260524_094028_cmlvb1.png",
  icon: "https://knowlet.in/icons/web-app-manifest-192x192.png",
  badge: "https://knowlet.in/icons/favicon-96x96.png",
  tag: undefined,
  action_url: "https://knowlet.in",
};

export default function NotificationAdminPage() {
  const [sending, setSending] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [icon, setIcon] = useState("");
  const [badge, setBadge] = useState("");
  const [tag, setTag] = useState("");
  const [action_url, setActionUrl] = useState("");

  const [drafts, setDrafts] = useState<NotificationData[]>([]);
  const [history, setHistory] = useState<NotificationData[]>([]);

  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);

  useEffect(() => {
    loadDrafts();
    loadHistory();
  }, []);

  function loadDrafts() {
    const data = JSON.parse(localStorage.getItem("drafts") || "[]");
    setDrafts(data);
  }

  async function loadHistory() {
    const res = await fetch("/api/notification");
    const { data, error } = await res.json();

    if (error) {
      toast.error("Failed to load history");
      return;
    }

    setHistory(data);
  }

  function loadInput(data: NotificationData) {
    setTitle(data.title || "");
    setBody(data.body || "");
    setImage(data.image || "");
    setIcon(data.icon || "");
    setBadge(data.badge || "");
    setTag(data.tag || "");
    setActionUrl(data.action_url || "");
  }

  async function sendNow() {
    try {
      const payload = {
        title: title || defaultPreview.title,
        body: body || defaultPreview.body,
        image: image || defaultPreview.image,
        icon: icon || defaultPreview.icon,
        badge: badge || defaultPreview.badge,
        tag: tag || defaultPreview.tag,
        action_url: action_url || defaultPreview.action_url,
      };

      setSending(true);

      const res = await fetch("/api/notification/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const {
        data: { total_users, sent_count, failed_count },
        error,
      } = await res.json();

      setSending(false);

      if (error) {
        toast.error("Failed to send notification");
        return;
      }

      if (!res.ok) return;

      await loadHistory();

      toast.success("Notification sent!", {
        description: `sent: ${sent_count}, total: ${total_users}, failed: ${failed_count}`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSending(false);
    }
  }

  function saveDraft() {
    const draft = {
      id: crypto.randomUUID(),
      title,
      body,
      image,
      icon,
      badge,
      tag,
      action_url,
    };

    const updatedDrafts = [...drafts, draft];

    localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);

    toast.info("Draft saved!");
  }

  function removeDraft(id: string) {
    const updated = drafts.filter((item) => item.id !== id);

    localStorage.setItem("drafts", JSON.stringify(updated));
    setDrafts(updated);
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
                value={action_url}
                onChange={(e) => setActionUrl(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              {advancedOptionsOpen && (
                <>
                  <input
                    placeholder="Icon URL"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="Badge URL"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="Tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </>
              )}
            </div>

            <div className="mt-5 flex justify-between">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => sendNow()}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
                >
                  {sending ? (
                    <div className="flex justify-center items-center">
                      <Bars
                        height={25}
                        color="white"
                        ariaLabel="bars-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <>
                      <Send size={18} />
                      Send
                    </>
                  )}
                </button>

                <button
                  onClick={saveDraft}
                  className="flex items-center gap-2 rounded-xl bg-gray-800 px-5 py-3 text-white transition hover:bg-black"
                >
                  <Save size={18} />
                  Save Draft
                </button>
              </div>
              <button
                onClick={() => setAdvancedOptionsOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl bg-gray-200 px-5 py-3 text-gray-700 transition hover:bg-gray-300"
              >
                <Settings size={18} />
                Show Advance Options
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Preview</h2>

            <div
              onClick={() =>
                window.open(action_url || defaultPreview.action_url, "_blank")
              }
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
                      onClick={() => draft.id && removeDraft(draft.id)}
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

                      <p className="line-clamp-1 text-sm text-gray-500">
                        {item.body}
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
      </div>
    </div>
  );
}
