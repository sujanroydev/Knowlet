import { authGate } from "@/lib/auth/authGate";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

    const parts = path.split("/");

    const levelSlug = parts[0];
    const subjectSlug = parts[1];
    const paperSlug = levelSlug.startsWith("semester") ? parts[2] : null;

    let level, subject, paper;
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
    level = oldLevelRow?.data;

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
      level = newLevelRow?.data;
    }

    // fetch
    if (oldLevelRow?.data) {
      oldSubjectRow = await db
        .from("subjects")
        .select("id")
        .eq("slug", subjectSlug)
        .eq("level_id", level?.id)
        .maybeSingle();

      if (oldSubjectRow?.error) throw new Error(oldSubjectRow?.error.message);
      subject = oldSubjectRow?.data;
    }

    // insert
    if (!oldLevelRow?.data || !oldSubjectRow?.data) {
      newSubjectRow = await db
        .from("subjects")
        .insert({
          level_id: level?.id,
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
      subject = newSubjectRow?.data;
    }

    // fetch
    if ((oldLevelRow?.data || oldSubjectRow?.data) && paperSlug) {
      oldPaperRow = await db
        .from("papers")
        .select("id")
        .eq("slug", paperSlug)
        .eq("subject_id", subject?.id)
        .maybeSingle();

      if (oldPaperRow?.error) throw new Error(oldPaperRow?.error.message);
      paper = oldPaperRow?.data;
    }

    // insert
    if ((!oldLevelRow?.data || !oldPaperRow?.data) && paperSlug) {
      newPaperRow = await db
        .from("papers")
        .insert({
          subject_id: subject?.id,
          level_id: level?.id,
          title: paperSlug.split("-").join(" ").toUpperCase(),
          code: paperSlug.split("-").join("").toUpperCase(),
          slug: paperSlug,
          path: `${levelSlug}/${subjectSlug}/${paperSlug}`,
        })
        .select()
        .single();

      if (newPaperRow?.error) throw new Error(newPaperRow?.error.message);
      paper = newPaperRow?.data;
    }

    //insert
    const { data, error } = await db.from("resources").insert({
      level_id: level?.id,
      subject_id: subject?.id,
      paper_id: paper?.id,
      title,
      description,
      content,
      target,
      type,
      slug,
      path,
    });

    if (error) throw new Error(error.message);

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
