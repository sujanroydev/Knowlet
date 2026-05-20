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
    const paperSlug = subjectSlug.startsWith("semester") ? parts[2] : null;

    let level, subject, paper;

    const db = await connectDb();

    let { data, error: levelError } = await db
      .from("levels")
      .select("id")
      .eq("slug", levelSlug)
      .maybeSingle();

    level = data;

    if (!level) {
      const levelRow = await db
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

      level = levelRow.data;
    } else {
      let { data, error: subjectError } = await db
        .from("subjects")
        .select("id")
        .eq("slug", subjectSlug)
        .eq("level_id", level?.id)
        .maybeSingle();

      subject = data;

      if (!subject) {
        const subjectRow = await db
          .from("subjects")
          .insert({
            title: subjectSlug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            number: subjectSlug.split("-")[1],
            slug: subjectSlug,
            path: `${subjectSlug}`,
          })
          .select()
          .single();

        subject = subjectRow.data;
      } else if (paperSlug) {
        let { data, error: paperError } = await db
          .from("papers")
          .select("id")
          .eq("slug", paperSlug)
          .eq("subject_id", subject?.id)
          .maybeSingle();

        paper = data;

        if (!paper) {
          const paperRow = await db
            .from("papers")
            .insert({
              title: paperSlug
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              number: paperSlug.split("-")[1],
              slug: paperSlug,
              path: `${paperSlug}`,
            })
            .select()
            .single();

          paper = paperRow.data;
        }
      }
    }

    const { data: res, error: resErr } = await db.from("resources").insert({
      level_id: level?.id,
      subject_id: subject?.id,
      paper_id: paper?.id,
      ...{ title, description, content, target, type, slug, path },
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
