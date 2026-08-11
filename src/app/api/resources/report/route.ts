import { NextRequest, NextResponse } from "next/server";

import { authGate } from "@/lib/auth/authGate";
import { insertReport } from "@/db/resource/report";
import { sendEmail, sendEmailByUserId } from "@/services/email/send";
import { reportReceivedTemplate } from "@/services/email/templates/report-received";
import { newResourceReportTemplate } from "@/services/email/templates/resource-report-admin";

export async function POST(req: NextRequest) {
  try {
    const { reportReason, reportDetails, resourceId } = await req.json();
    const { ok, res, payload } = await authGate(req, "jwt");

    if (!ok || !payload) return res;

    await insertReport(payload.user_id, resourceId, reportReason, reportDetails);

    void sendEmailByUserId({
      user_id: payload.user_id,
      subject: "Your Report Has Been Submitted",
      html: reportReceivedTemplate({ reportReason, reportDetails }),
    }).catch((err) => {
      console.error("Failed to send email:", err);
    });

    void sendEmail({
      to: "knowlet.official@gmail.com",
      subject: "Resource Report: Action Required",
      html: newResourceReportTemplate({
        userId: payload.user_id,
        resourceId,
        reportReason,
        reportDetails,
      }),
    }).catch((err) => {
      console.error("Failed to send email:", err);
    });

    return NextResponse.json(
      { reportReason, reportDetails, resourceId },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: { message: "Server error" } },
      { status: 500 },
    );
  }
}
