import { NextRequest, NextResponse } from "next/server";

import { authGate } from "@/lib/auth/authGate";
import { Resource } from "@/types/resource";
import { updateResource } from "@/db/resource";
import { getResourceReporterIds } from "@/db/resource/report";
import { sendNotificationByUserId } from "@/services/notification/send";
import { buildResourcePath } from "@/components/dashboard/resources/utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    let updatedResource: Resource = await req.json();
    const { title, description, content, level, subject, paper, target, type } = updatedResource;
    const { id: resourceId } = await params;

    if (!resourceId) {
      return NextResponse.json(
        { error: { message: "Resource ID is required." } },
        { status: 400 },
      );
    }

    if (
      !title ||
      !description ||
      !content ||
      !level ||
      !subject ||
      !target ||
      !type
    ) {
      return NextResponse.json(
        { error: { message: "All fields are required." } },
        { status: 400 },
      );
    }

    const { ok, res, payload } = await authGate(req, "admin");
    if (!ok || !payload) return res;

    const path = buildResourcePath({ level, subject, paper, target, type });

    const resource = await updateResource(resourceId, {
      title,
      description,
      content,
    });

    void (async () => {
      try {
        const reporterIds = await getResourceReporterIds(resourceId);

        if (!reporterIds?.length) return;

        await sendNotificationByUserId({
          user_id: reporterIds,
          title: "✅ Thanks for the Report!",
          options: {
            body: "We've fixed the issue or updated the resource. Tap to view the latest version.",
            data: {
              action_url: `https://knowlet.in/library/${path}`,
              type: "resource",
            },
          },
        });
      } catch (error) {
        console.error("Failed to notify resource reporters:", error);
      }
    })();

    return NextResponse.json(
      { success: true, data: { resource }, path },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: { message: (error as Error).message } },
      { status: 500 },
    );
  }
}
