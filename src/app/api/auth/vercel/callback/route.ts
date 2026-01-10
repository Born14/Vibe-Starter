import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wizardSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { encrypt } from "@/lib/encryption";

const VERCEL_CLIENT_ID = process.env.VERCEL_CLIENT_ID!;
const VERCEL_CLIENT_SECRET = process.env.VERCEL_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const configurationId = request.nextUrl.searchParams.get("configurationId");

  if (!code || !state) {
    return NextResponse.redirect(
      `${APP_URL}/setup/wizard?error=invalid_callback&step=vercel`
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://api.vercel.com/v2/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: VERCEL_CLIENT_ID,
        client_secret: VERCEL_CLIENT_SECRET,
        code,
        redirect_uri: process.env.NEXT_PUBLIC_APP_URL + "/api/auth/vercel/callback",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Vercel token error:", tokenData);
      return NextResponse.redirect(
        `${APP_URL}/setup/wizard?error=token_failed&step=vercel`
      );
    }

    const accessToken = tokenData.access_token;

    // Verify token works by fetching user
    const userResponse = await fetch("https://api.vercel.com/v2/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(
        `${APP_URL}/setup/wizard?error=user_fetch_failed&step=vercel`
      );
    }

    const userData = await userResponse.json();

    // Encrypt and store the token
    const encryptedToken = encrypt(accessToken);

    // Update wizard session
    await db
      .update(wizardSessions)
      .set({
        vercelToken: encryptedToken,
        currentStep: 4, // Move to next step (Clerk)
      })
      .where(eq(wizardSessions.id, state));

    // Redirect back to wizard with success
    return NextResponse.redirect(
      `${APP_URL}/setup/wizard?vercel_success=true&vercel_user=${userData.user?.username || "connected"}`
    );
  } catch (error) {
    console.error("Vercel OAuth error:", error);
    return NextResponse.redirect(
      `${APP_URL}/setup/wizard?error=oauth_failed&step=vercel`
    );
  }
}
