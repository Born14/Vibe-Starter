import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wizardSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { encrypt } from "@/lib/encryption";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state"); // This is our session ID
  const error = request.nextUrl.searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      `${APP_URL}/setup/wizard?error=github_denied&step=github`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${APP_URL}/setup/wizard?error=invalid_callback&step=github`
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub token error:", tokenData);
      return NextResponse.redirect(
        `${APP_URL}/setup/wizard?error=token_failed&step=github`
      );
    }

    const accessToken = tokenData.access_token;

    // Get user info to verify token works
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(
        `${APP_URL}/setup/wizard?error=user_fetch_failed&step=github`
      );
    }

    const userData = await userResponse.json();

    // Encrypt and store the token
    const encryptedToken = encrypt(accessToken);

    // Update wizard session
    await db
      .update(wizardSessions)
      .set({
        githubToken: encryptedToken,
        currentStep: 3, // Move to next step (Vercel)
      })
      .where(eq(wizardSessions.id, state));

    // Redirect back to wizard with success
    return NextResponse.redirect(
      `${APP_URL}/setup/wizard?github_success=true&github_user=${userData.login}`
    );
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(
      `${APP_URL}/setup/wizard?error=oauth_failed&step=github`
    );
  }
}
