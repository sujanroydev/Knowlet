import { parseResourcePath } from "@/components/dashboard/resources/utils";
import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";
import { sendNotificationByUserId } from "@/services/notification/send";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const db = await connectDb();
    const { data, error } = await db
      .from("resources")
      .select("id, title, description, slug, path");

    if (error) throw new Error(error.message);

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let resource: Resource = await req.json();
    const { title, description, content, target, type, slug, path } = resource;

    if (
      !title ||
      !description ||
      !content ||
      !target ||
      !type ||
      !slug ||
      !path
    ) {
      return NextResponse.json(
        { error: { message: "All fields are required." } },
        { status: 400 },
      );
    }

    const { ok, res, payload } = await authGate(req, "admin");
    if (!ok || !payload) return res;

    const { levelSlug, subjectSlug, paperSlug } = parseResourcePath(path);

    let levelData, subjectData, paperData;
    let oldLevelRow, oldSubjectRow, oldPaperRow;
    let newLevelRow, newSubjectRow, newPaperRow;

    const db = await connectDb();

    // fetch
    oldLevelRow = await db
      .from("levels")
      .select("id")
      .eq("slug", levelSlug)
      .maybeSingle();

    if (oldLevelRow?.error) throw new Error(oldLevelRow?.error.message);
    levelData = oldLevelRow?.data;

    // insert
    if (!oldLevelRow?.data) {
      newLevelRow = await db
        .from("levels")
        .insert({
          title: levelSlug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          number: levelSlug.split("-")[1],
          slug: levelSlug,
          path: `${levelSlug}`,
        })
        .select()
        .single();

      if (newLevelRow?.error) throw new Error(newLevelRow?.error.message);
      levelData = newLevelRow?.data;
    }

    // fetch
    if (oldLevelRow?.data) {
      oldSubjectRow = await db
        .from("subjects")
        .select("id")
        .eq("slug", subjectSlug)
        .eq("level_id", levelData?.id)
        .maybeSingle();

      if (oldSubjectRow?.error) throw new Error(oldSubjectRow?.error.message);
      subjectData = oldSubjectRow?.data;
    }

    // insert
    if (!oldLevelRow?.data || !oldSubjectRow?.data) {
      newSubjectRow = await db
        .from("subjects")
        .insert({
          level_id: levelData?.id,
          title: subjectSlug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          slug: subjectSlug,
          path: `${levelSlug}/${subjectSlug}`,
        })
        .select()
        .single();

      if (newSubjectRow?.error) throw new Error(newSubjectRow?.error.message);
      subjectData = newSubjectRow?.data;
    }

    // fetch
    if ((oldLevelRow?.data || oldSubjectRow?.data) && paperSlug) {
      oldPaperRow = await db
        .from("papers")
        .select("id")
        .eq("slug", paperSlug)
        .eq("subject_id", subjectData?.id)
        .maybeSingle();

      if (oldPaperRow?.error) throw new Error(oldPaperRow?.error.message);
      paperData = oldPaperRow?.data;
    }

    // insert
    if ((!oldLevelRow?.data || !oldPaperRow?.data) && paperSlug) {
      newPaperRow = await db
        .from("papers")
        .insert({
          subject_id: subjectData?.id,
          level_id: levelData?.id,
          title: paperSlug.split("-").join(" ").toUpperCase(),
          code: paperSlug.split("-").join("").toUpperCase(),
          slug: paperSlug,
          path: `${levelSlug}/${subjectSlug}/${paperSlug}`,
        })
        .select()
        .single();

      if (newPaperRow?.error) throw new Error(newPaperRow?.error.message);
      paperData = newPaperRow?.data;
    }

    //insert
    const { data, error } = await db.from("resources").insert({
      level_id: levelData?.id,
      subject_id: subjectData?.id,
      paper_id: paperData?.id,
      title,
      description,
      content,
      target,
      type,
      slug,
      path,
    });

    if (error) throw new Error(error.message);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const prefix = path
      .split("/")
      .slice(0, path.split("/")[0].startsWith("semester") ? 3 : 2)
      .join("/");

    const { data: history, error: historyError } = await db
      .from("view_history")
      .select("user_id, resources!inner(path)")
      .ilike("resources.path", `${prefix}%`)
      .gte("created_at", thirtyDaysAgo.toISOString());

    if (!historyError && history && history.length) {
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
      { success: true, data: { resource: data } },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: { message: (error as Error).message } },
      { status: 500 },
    );
  }
}
