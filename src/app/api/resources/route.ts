import { NextRequest, NextResponse } from "next/server";

import { parseResourcePath, buildResourcePath } from "@/utils/resource";
import { authGate } from "@/lib/auth/authGate";
import { apiError } from "@/lib/api-response";

import { sendNotificationByUserId } from "@/services/notification/send";
import { getResources, insertResource } from "@/db/resource";
import { getRecentViewHistory } from "@/db/resource/history";
import { ensureResourceHierarchy } from "@/actions/resource";

export async function GET(req: NextRequest) {
  try {
    const resources = await getResources();

    return NextResponse.json({ data: resources });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  let path = "";
  try {
    const { title, description, content, level, subject, paper, target, type } =
      await req.json();

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

    path = buildResourcePath({ level, subject, paper, target, type });

    const { typeSlug, targetSlug } = parseResourcePath(path);

    const { levelId, subjectId, paperId } = await ensureResourceHierarchy({
      type,
      level,
      subject,
      paper,
      target,
    });

    //insert
    const resource = await insertResource({
      level_id: levelId,
      subject_id: subjectId,
      paper_id: paperId,
      title,
      description,
      content,
      target: targetSlug,
      type: typeSlug,
      slug: targetSlug,
      path,
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const prefix = path
      .split("/")
      .slice(0, path.split("/")[0].startsWith("semester") ? 3 : 2)
      .join("/");

    const history = await getRecentViewHistory(
      prefix,
      thirtyDaysAgo.toISOString(),
    );

    if (history && history.length) {
      const { subject, paper, type, target } = parseResourcePath(path);
      void sendNotificationByUserId({
        user_id: [...new Set(history.map((h) => h.user_id) ?? [])],
        title: `📚 New ${paper || subject} Resource`,
        options: {
          body: `New ${target} ${type} ${type.endsWith("s") ? "are" : "is"} now available.`,
          data: {
            action_url: `https://knowlet.in/library/${path}`,
            type: "resource",
          },
        },
      });
    }

    return NextResponse.json(
      { success: true, data: { resource }, path },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to save resource", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { error: { message: "Resource already exists" }, path },
        { status: 500 },
      );
    }

    return apiError(error instanceof Error ? error.message : "Unknown error");
  }
}
