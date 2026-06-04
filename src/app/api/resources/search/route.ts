import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function tokenize(text: string) {
  return text.toLowerCase().replace(/[/-]/g, " ").split(/\s+/).filter(Boolean);
}

function getScore(
  resource: {
    title: string;
    description: string | null;
    path: string;
  },
  query: string,
) {
  const queryTokens = tokenize(query);

  const pathTokens = tokenize(resource.path);
  const titleTokens = tokenize(resource.title);
  const descTokens = tokenize(resource.description ?? "");

  let score = 0;
  let matched = 0;

  for (const token of queryTokens) {
    let found = false;

    if (pathTokens.includes(token)) {
      score += 100;
      found = true;
    }

    if (titleTokens.includes(token)) {
      score += 50;
      found = true;
    }

    if (descTokens.includes(token)) {
      score += 10;
      found = true;
    }

    if (found) matched++;
  }

  score += (matched / queryTokens.length) * 1000;

  return score;
}

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("query")?.trim() ?? "";

    if (!query) {
      return NextResponse.json({ data: [] });
    }

    const words = query
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    const conditions = words.flatMap((word) => {
      const isNumber = /^\d+$/.test(word);

      if (isNumber) {
        return [`path.ilike.%${word}%`];
      }

      return [
        `title.ilike.%${word}%`,
        `description.ilike.%${word}%`,
        `path.ilike.%${word}%`,
      ];
    });

    const db = await connectDb();

    const { data, error } = await db
      .from("resources")
      .select("id,title,description,path")
      .or(conditions.join(","))
      .limit(100);

    if (error) throw error;

    const ranked = (data ?? [])
      .map((resource) => ({
        ...resource,
        score: getScore(resource, query),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    return NextResponse.json({
      data: ranked.map(({ score, ...resource }) => resource),
    });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Server Error" } },
      { status: 500 },
    );
  }
}
