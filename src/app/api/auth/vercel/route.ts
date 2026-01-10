import { NextRequest, NextResponse } from "next/server";

const VERCEL_CLIENT_ID = process.env.VERCEL_CLIENT_ID!;
const VERCEL_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + "/api/auth/vercel/callback";

// Initiate Vercel OAuth flow
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  const params = new URLSearchParams({
    client_id: VERCEL_CLIENT_ID,
    redirect_uri: VERCEL_REDIRECT_URI,
    state: sessionId,
  });

  const vercelAuthUrl = `https://vercel.com/integrations/${VERCEL_CLIENT_ID}/new?${params.toString()}`;

  return NextResponse.redirect(vercelAuthUrl);
}
