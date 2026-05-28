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
    <footer className="my-12 border-t pt-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-2xl border bg-muted/30 p-5">
        <div>
          <h3 className="text-base font-semibold">
            Did this resource help you study?
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Share feedback or report issues to help improve this resource.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setType("feedback")}
            className="
              inline-flex items-center gap-2
              rounded-xl border px-4 py-2
              text-sm font-medium
              transition-colors
              hover:bg-accent
            "
          >
            <span>💬</span>
            Share Feedback
          </button>

          <button
            onClick={() => setType("report")}
            className="
              inline-flex items-center gap-2
              rounded-xl border px-4 py-2
              text-sm font-medium
              transition-colors
              hover:bg-red-50
              hover:text-red-600
              dark:hover:bg-red-950/30
            "
          >
            <span>⚠</span>
            Report Issue
          </button>
        </div>

        {type === "feedback" && (
          <div className="mt-2 flex flex-col gap-3">
            <textarea
              value={feedbackMsg}
              onChange={(e) => setFeedbackMsg(e.target.value)}
              placeholder="Write your feedback..."
              className="
                min-h-[120px]
                rounded-xl border
                bg-background
                px-4 py-3
                text-sm
                outline-none
              "
            />

            <button
              disabled={loading}
              onClick={handleFeedbackSubmit}
              className="
                rounded-xl bg-primary
                px-4 py-2
                text-sm font-medium
                text-primary-foreground
              "
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        )}

        {type === "report" && (
          <div className="mt-2 flex flex-col gap-3">
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="
                rounded-xl border
                bg-background
                px-4 py-3
                text-sm
                outline-none
              "
            >
              <option value="">Select report reason</option>

              <option value="incorrect_information">
                Incorrect Information
              </option>

              <option value="outdated_content">Outdated Content</option>

              <option value="formatting_issue">Formatting Issue</option>

              <option value="missing_topics">Missing Topics</option>

              <option value="broken_content">Broken Content</option>

              <option value="other">Other</option>
            </select>

            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Additional details (optional)"
              className="
                min-h-[120px]
                rounded-xl border
                bg-background
                px-4 py-3
                text-sm
                outline-none
              "
            />

            <button
              disabled={loading}
              onClick={handleReportSubmit}
              className="
                rounded-xl bg-primary
                px-4 py-2
                text-sm font-medium
                text-primary-foreground
              "
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
