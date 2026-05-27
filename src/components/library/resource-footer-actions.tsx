"use client";

import { useReader } from "@/context/ReaderContext";
import { useState } from "react";
import { toast } from "sonner";

export default function ResourceFooterActions() {
  const { resourceId } = useReader();

  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportStatus, setReportStatus] = useState("");

  const handleFeedback = async () => {
    try {
      const res = await fetch("/api/resources/feedback", {
        method: "POST",
        body: JSON.stringify({ feedbackMsg, resourceId }),
      });

      if (res.ok) toast.error("failed to submit feedback");

      toast.success("feedback submitted");
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = async () => {
    try {
      const res = await fetch("/api/resources/report", {
        method: "POST",
        body: JSON.stringify({
          reportDetails,
          reportReason,
          reportStatus,
          resourceId,
        }),
      });

      if (res.ok) toast.error("failed to submit report");

      toast.success("report submitted");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <footer className="mt-12 border-t pt-6">
      <div className="flex flex-col gap-4 rounded-2xl border bg-muted/30 p-5">
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
            onClick={handleFeedback}
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
            onClick={handleReport}
            className="
              inline-flex items-center gap-2
              rounded-xl border px-4 py-2
              text-sm font-mediumss
              +-------------
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
      </div>
    </footer>
  );
}
