import { verifyAdmin } from "@/lib/auth";
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

    const payload = await verifyAdmin(req.cookies.get("token")?.value);

    if (!payload) {
      return NextResponse.json(
        { error: { message: "Unauthorized User" } },
        { status: 403 },
      );
    }

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

      paper = oldPaperRow?.data;
    }

    // insert
    if ((!oldLevelRow?.data || !oldSubjectRow?.data) && paperSlug) {
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

      paper = newPaperRow?.data;
    }

    // console.log(level, subject, paper);
    console.log("\n\n");
    console.log(oldLevelRow?.data, oldSubjectRow?.data, oldPaperRow?.data);
    console.log("\n\n");
    console.log(oldLevelRow?.error, oldSubjectRow?.error, oldPaperRow?.error);
    console.log("\n\n");
    console.log(newLevelRow?.data, newSubjectRow?.data, newPaperRow?.data);
    console.log("\n\n");
    console.log(newLevelRow?.error, newSubjectRow?.error, newPaperRow?.error);

    //insert
    const { data: res, error: resErr } = await db.from("resources").insert({
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

    if (resErr) throw new Error(resErr.message);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: { message: (error as Error).message } },
      { status: 500 },
    );
  }
}
