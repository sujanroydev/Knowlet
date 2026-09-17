import { NextRequest, NextResponse } from "next/server";
import { generateResource } from "@/services/knowva/generation/resource";

type Unit = {
  id: number;
  target: string;
  syllabus: string;
};

type GenerateRequest = {
  level: string;
  subject: string;
  paper: string;
  type: string;
  units: Unit[];
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;

    const { level, subject, paper, type, units } = body;

    if (!level || !subject || !paper || !type) {
      return NextResponse.json(
        { error: "Missing resource metadata" },
        { status: 400 },
      );
    }

    if (!Array.isArray(units)) {
      return NextResponse.json(
        { error: "Units must be an array" },
        { status: 400 },
      );
    }

    const results = [];

    for (const unit of units) {
      if (!unit.syllabus?.trim()) {
        results.push({
          id: unit.id,
          target: unit.target,
          status: "skipped",
        });

        continue;
      }

      try {
        const generated = await generateResource({
          syllabus: unit.syllabus,
          model: "gemini-3.5-flash-lite",
        });

        if (typeof generated !== "string") {
          throw new Error("Invalid generation response");
        }

        const parsed = JSON.parse(generated);

        const resource = {
          title: parsed.title,
          description: parsed.description,
          content: parsed.resource,

          level,
          subject,
          paper,
          target: unit.target,
          type,
        };

        const response = await fetch(
          `${request.nextUrl.origin}/api/resources`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(resource),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to publish resource");
        }

        results.push({
          id: unit.id,
          target: unit.target,
          status: "success",
          title: parsed.title,
          description: parsed.description,
        });
      } catch (error) {
        console.error(`${unit.target} failed:`, error);

        results.push({
          id: unit.id,
          target: unit.target,
          status: "failed",
          error:
            error instanceof Error ? error.message : "Unknown generation error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Resource generation failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
