"use client";

import { useReader } from "@/context/ReaderContext";
import { useState } from "react";
import { toast } from "sonner";

export default function ResourceFooterActions() {
  const { resourceId } = useReader();

  const [type, setType] = useState<"feedback" | "report" | null>(null);

  const [loading, setLoading] = useState(false);

  const [feedbackMsg, setFeedbackMsg] = useState("");

  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  const handleFeedbackSubmit = async () => {
    if (!feedbackMsg.trim()) {
      toast.error("Please enter feedback");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/resources/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackMsg, resourceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to submit feedback");
        return;
      }

      toast.success("Feedback submitted");

      setFeedbackMsg("");
      setType(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      toast.error("Please select a reason");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/resources/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportReason, reportDetails, resourceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to submit report");
        return;
      }

      toast.success("Report submitted");

      setReportReason("");
      setReportDetails("");

      setType(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-muted/40 to-background p-6 shadow-sm">
      <div className="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight">
          Did this help you understand better?
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your feedback improves the quality of this resource for everyone.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setType("feedback")}
          className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:bg-primary/5"
        >
          💬 Share Feedback
        </button>

        <button
          onClick={() => setType("report")}
          className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-red-500/5 hover:text-red-600 hover:shadow-md"
        >
          ⚠ Report Issue
        </button>
      </div>

      {/* FEEDBACK FORM */}
      {type === "feedback" && (
        <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <textarea
            value={feedbackMsg}
            onChange={(e) => setFeedbackMsg(e.target.value)}
            placeholder="Write your thoughts..."
            className="min-h-[130px] w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />

          <button
            disabled={loading}
            onClick={handleFeedbackSubmit}
            className="inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      )}

      {/* REPORT FORM */}
      {type === "report" && (
        <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          >
            <option value="">Select a reason</option>
            <option value="incorrect_information">Incorrect Information</option>
            <option value="outdated_content">Outdated Content</option>
            <option value="formatting_issue">Formatting Issue</option>
            <option value="missing_topics">Missing Topics</option>
            <option value="broken_content">Broken Content</option>
            <option value="other">Other</option>
          </select>

          <textarea
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            placeholder="Add details (optional)"
            className="min-h-[120px] w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />

          <button
            disabled={loading}
            onClick={handleReportSubmit}
            className="inline-flex w-full items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-600 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      )}
    </footer>
  );
}
