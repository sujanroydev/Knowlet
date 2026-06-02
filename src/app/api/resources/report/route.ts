import { verifyJwt } from "@/lib/auth";
import connectDb from "@/lib/db";
import { sendEmail, sendEmailByUserId } from "@/services/email/send";
import { reportReceivedTemplate } from "@/services/email/templates/report-received";
import { newResourceReportTemplate } from "@/services/email/templates/resource-report-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { reportReason, reportDetails, resourceId } = await req.json();
    const token = req.cookies.get("token")?.value;
    const payload = await verifyJwt(token);

    if (!payload) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 403 },
      );
    }

    const db = await connectDb();

    const { error } = await db.from("resource_reports").insert({
      user_id: payload.user_id,
      resource_id: resourceId,
      reason: reportReason,
      details: reportDetails,
    });

    if (error) throw new Error(error.message);

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
