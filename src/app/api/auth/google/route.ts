import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("mode");

  if (mode !== "signin" && mode !== "signup") {
    return NextResponse.json(
      { error: "Invalid authentication mode" },
      { status: 400 },
    );
  }

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",

    // Preserve signin/signup through the OAuth flow
    state: mode,

    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return NextResponse.redirect(`${rootUrl}?${qs}`);
}
