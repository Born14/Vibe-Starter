import { NextRequest, NextResponse } from "next/server";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + "/api/auth/github/callback";

// Initiate GitHub OAuth flow
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  // GitHub OAuth scopes - only request what we need
  const scopes = ["repo", "read:user"].join(" ");

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: scopes,
    state: sessionId, // Pass session ID through OAuth state
  });

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  return NextResponse.redirect(githubAuthUrl);
}
