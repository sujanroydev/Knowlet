import { NextRequest, NextResponse } from "next/server";

import {
  parseResourcePath,
  buildResourcePath,
} from "@/components/dashboard/resources/utils";
import { sendNotificationByUserId } from "@/services/notification/send";
import { authGate } from "@/lib/auth/authGate";

import { getResources, insertResource } from "@/db/resource";
import { getLevelId, insertLevel } from "@/db/resource/level";
import { getSubjectId, insertSubject } from "@/db/resource/subject";
import { getPaperId, insertPaper } from "@/db/resource/paper";
import { getRecentViewHistory } from "@/db/resource/history";
import { apiError } from "@/lib/api-response";
import { PostgrestError } from "@supabase/supabase-js";

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

    const path = buildResourcePath({ level, subject, paper, target, type });

    const { levelSlug, subjectSlug, paperSlug, typeSlug, targetSlug } =
      parseResourcePath(path);

    let levelId = await getLevelId(levelSlug);
    let subjectId: string;
    let paperId: string | undefined;
    let isSubjectNew = false;

    if (!levelId) {
      const levelData = await insertLevel({
        title: level,
        number: Number(levelSlug.split("-")[1]),
        slug: levelSlug,
        path: levelSlug,
      });

      levelId = levelData.id;

      const subjectData = await insertSubject({
        level_id: levelId,
        title: subject,
        slug: subjectSlug,
        path: `${levelSlug}/${subjectSlug}`,
      });

      subjectId = subjectData.id;
      isSubjectNew = true;
    } else {
      subjectId = await getSubjectId(subjectSlug, levelId);

      if (!subjectId) {
        const subjectData = await insertSubject({
          level_id: levelId,
          title: subject,
          slug: subjectSlug,
          path: `${levelSlug}/${subjectSlug}`,
        });

        subjectId = subjectData.id;
        isSubjectNew = true;
      }
    }

    if (paperSlug) {
      if (!isSubjectNew) {
        paperId = await getPaperId(paperSlug, subjectId);
      }
      if (!paperId) {
        const paperData = await insertPaper({
          subject_id: subjectId,
          level_id: levelId,
          title: paperSlug.split("-").join(" ").toUpperCase(),
          code: paperSlug.split("-").join("").toUpperCase(),
          slug: paperSlug,
          path: `${levelSlug}/${subjectSlug}/${paperSlug}`,
        });

        paperId = paperData.id;
      }
    }

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
      return apiError("Resource already exists.");
    }

    return apiError(error instanceof Error ? error.message : "Unknown error");
  }
}
