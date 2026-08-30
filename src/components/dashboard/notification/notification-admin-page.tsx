"use client";

import { useEffect, useState, useRef } from "react";
import {
  Trash2,
  Bell,
  Send,
  Save,
  History,
  FileText,
  Settings,
  XCircle,
  CheckCircle2,
  Users,
  Clock,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type NotificationData = {
  id?: string;
  title: string;
  body: string;
  image: string;
  icon?: string;
  badge?: string;
  tag?: string;
  total_users?: number;
  sent_count?: number;
  failed_count?: number;
  action_url: string;
  created_at?: string;
};

const defaultPreview = {
  title: "Stop Scrolling. Start Revising.",
  body: "Important topics, quick notes & exam-focused questions ready for you.",
  image:
    "https://res.cloudinary.com/db975putk/image/upload/q_auto/f_auto/v1779595876/IMG_20260524_094028_cmlvb1.png",
  icon: "https://knowlet.in/icons/android-chrome-192x192.png",
  badge: "https://knowlet.in/icons/favicon-32x32.png",
  action_url: "https://knowlet.in",
};

export default function NotificationAdminPage() {
  const [sending, setSending] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(defaultPreview.title);
  const [body, setBody] = useState(defaultPreview.body);
  const [image, setImage] = useState(defaultPreview.image);
  const [icon, setIcon] = useState(defaultPreview.icon);
  const [badge, setBadge] = useState(defaultPreview.badge);
  const [tag, setTag] = useState("");
  const [action_url, setActionUrl] = useState(defaultPreview.action_url);

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

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        toast.info("Select an image first");
        return;
      }

      setImageUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/notification/upload-image", {
        method: "POST",
        body: formData,
      });

      const { data, error } = await res.json();
      setImageUploading(false);

      if (error) {
        toast.error(error.message || "Failed to upload image");
        return;
      }

      if (!res.ok) {
        toast.error("Upload failed");
        return;
      }

      setImage(data.imageUrl);
      toast.success("Image uploaded successfully!");

      // Reset file input
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      setImageUploading(false);
      toast.error("Failed to upload image");
    }
  }

  async function sendNow() {
    try {
      const payload = {
        title: title,
        body: body,
        image: image,
        icon: icon,
        badge: badge,
        tag: tag || undefined,
        action_url: action_url,
      };

      setSending(true);

      const res = await fetch("/api/notification/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const { data, error } = await res.json();

      setSending(false);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!res.ok) return;

      const { total_users, sent_count, failed_count } = data;

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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notification Image
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={imageUploading}
                    className="flex items-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                  >
                    {imageUploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Choose Image
                      </>
                    )}
                  </button>
                  {image && image !== defaultPreview.image && (
                    <button
                      type="button"
                      onClick={() => setImage(defaultPreview.image)}
                      className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-gray-600 transition hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {image && image !== defaultPreview.image && (
                  <p className="text-xs text-green-600">✓ Image uploaded</p>
                )}
                {image === defaultPreview.image && (
                  <p className="text-xs text-gray-500">
                    Or paste image URL below
                  </p>
                )}
              </div>
              <input
                placeholder="Image URL (optional)"
                value={image === defaultPreview.image ? "" : image}
                onChange={(e) =>
                  setImage(e.target.value || defaultPreview.image)
                }
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
                  <>
                    <Send size={18} />
                    {sending ? "Sending..." : "Send"}
                  </>
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
                {advancedOptionsOpen
                  ? "Hide Advanced Options"
                  : "Show Advanced Options"}
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
              className="p-3 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
            >
              <div className="flex justify-between">
                <div className="w-10 flex items-center">
                  <img
                    src="/icons/android-chrome-192x192.png"
                    alt="icon"
                    className="h-10 w-10 rounded-full"
                  />
                </div>

                <div className="flex-1 px-3">
                  <h3 className="mb-2 text-2xl font-bold">
                    {title || defaultPreview.title}
                  </h3>

                  {body && <p className="text-gray-600">{body}</p>}
                </div>

                {icon && (
                  <img
                    src={icon}
                    alt="icon"
                    className="h-6 w-6 rounded-full self-end"
                  />
                )}
              </div>

              {image && (
                <img
                  src={image}
                  alt="preview"
                  className="h-auto w-full object-cover overflow-hidden rounded-2xl mt-3"
                />
              )}
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

            <div className="space-y-2 overflow-auto max-h-96">
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

            <div className="space-y-2 overflow-auto max-h-96">
              {history.length ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadInput(item)}
                    className="flex flex-row cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{item.title || "Untitled"}</p>

                      <p className="line-clamp-1 text-sm text-gray-500">
                        {item.body}
                      </p>

                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          {item.total_users}
                        </div>

                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          {item.sent_count}
                        </div>

                        <div className="flex items-center gap-1">
                          <XCircle size={12} />
                          {item.failed_count}
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(item.created_at!).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt="preview"
                        className="h-auto w-15 rounded-md object-cover"
                      />
                    )}
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
