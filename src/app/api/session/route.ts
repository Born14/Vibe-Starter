import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wizardSessions } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { withCsrfProtection } from "@/lib/csrf";
import { captureAPIError } from "@/lib/error-tracking";
import {
  idSchema,
  vercelTokenSchema,
  clerkPublishableKeySchema,
  clerkSecretKeySchema,
  neonDatabaseUrlSchema,
  anthropicKeySchema,
  openaiKeySchema,
  googleAIKeySchema,
  appNameSchema,
  validateInput,
  sanitizeString,
} from "@/lib/validation";

// Get session status
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("id");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  // Validate and sanitize session ID
  const validation = validateInput(idSchema, sessionId);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const sanitizedSessionId = validation.data;

  try {
    const [session] = await db
      .select({
        id: wizardSessions.id,
        currentStep: wizardSessions.currentStep,
        hasGithub: wizardSessions.githubToken,
        hasVercel: wizardSessions.vercelToken,
        hasClerk: wizardSessions.clerkPublishable,
        hasNeon: wizardSessions.databaseUrl,
        hasAi: wizardSessions.aiKey,
        appName: wizardSessions.appName,
        expiresAt: wizardSessions.expiresAt,
      })
      .from(wizardSessions)
      .where(
        and(
          eq(wizardSessions.id, sanitizedSessionId),
          gt(wizardSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!session) {
      return NextResponse.json({ error: "Session not found or expired" }, { status: 404 });
    }

    return NextResponse.json({
      id: session.id,
      currentStep: session.currentStep,
      hasGithub: !!session.hasGithub,
      hasVercel: !!session.hasVercel,
      hasClerk: !!session.hasClerk,
      hasNeon: !!session.hasNeon,
      hasAi: !!session.hasAi,
      appName: session.appName,
    });
  } catch (error) {
    console.error("Session fetch error:", error);

    // Track error in Sentry
    captureAPIError(error, {
      endpoint: '/api/session',
      method: 'GET',
      statusCode: 500,
    });

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update session (for manual key entry steps)
async function postHandler(request: NextRequest) {
  try {
    const { sessionId, field, value } = await request.json();

    if (!sessionId || !field) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate and sanitize session ID
    const sessionValidation = validateInput(idSchema, sessionId);
    if (!sessionValidation.success) {
      return NextResponse.json({ error: sessionValidation.error }, { status: 400 });
    }

    const sanitizedSessionId = sessionValidation.data;

    // Import encrypt dynamically to avoid issues
    const { encrypt } = await import("@/lib/encryption");

    // Handle special "skipAi" field to advance past AI step without setting keys
    if (field === "skipAi") {
      await db
        .update(wizardSessions)
        .set({ currentStep: 7 }) // Advance to App Name step
        .where(eq(wizardSessions.id, sanitizedSessionId));

      console.log(`Successfully skipped AI setup for session ${sanitizedSessionId}`);
      return NextResponse.json({ success: true });
    }

    // Map field names to database columns and Zod schemas
    const fieldMap: Record<string, { column: keyof typeof wizardSessions.$inferInsert; schema: z.ZodSchema }> = {
      vercelToken: {
        column: "vercelToken",
        schema: vercelTokenSchema,
      },
      clerkPublishable: {
        column: "clerkPublishable",
        schema: clerkPublishableKeySchema,
      },
      clerkSecret: {
        column: "clerkSecret",
        schema: clerkSecretKeySchema,
      },
      databaseUrl: {
        column: "databaseUrl",
        schema: neonDatabaseUrlSchema,
      },
      aiKey: {
        column: "aiKey",
        schema: null, // We'll handle AI key validation separately based on provider
      },
      aiProvider: {
        column: "aiProvider",
        schema: null, // Simple enum check, no schema needed
      },
      appName: {
        column: "appName",
        schema: appNameSchema,
      },
    };

    const fieldConfig = fieldMap[field];
    if (!fieldConfig) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    // Validate input based on field type
    let validatedValue = value;

    if (field === "aiProvider") {
      // Simple enum validation for AI provider
      if (!["claude", "gemini", "openai"].includes(value)) {
        return NextResponse.json({ error: "Invalid AI provider" }, { status: 400 });
      }
      validatedValue = sanitizeString(value);
    } else if (field === "aiKey") {
      // Determine which schema to use based on the key format
      let aiSchema;
      if (value.startsWith("sk-ant-")) {
        aiSchema = anthropicKeySchema;
      } else if (value.startsWith("AIza")) {
        aiSchema = googleAIKeySchema;
      } else if (value.startsWith("sk-")) {
        aiSchema = openaiKeySchema;
      } else {
        return NextResponse.json({ error: "Invalid AI key format" }, { status: 400 });
      }

      const validation = validateInput(aiSchema, value);
      if (!validation.success) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      validatedValue = validation.data;
    } else if (fieldConfig.schema) {
      // Use Zod schema validation for other fields
      const validation = validateInput(fieldConfig.schema, value);
      if (!validation.success) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      validatedValue = validation.data;
    }

    // Encrypt sensitive fields
    const sensitiveFields = ["vercelToken", "clerkPublishable", "clerkSecret", "databaseUrl", "aiKey"];
    const finalValue = sensitiveFields.includes(field) ? encrypt(validatedValue) : validatedValue;

    // Map fields to their corresponding step numbers
    const stepMap: Record<string, number> = {
      vercelToken: 4,      // After Vercel, go to Clerk (step 4)
      clerkPublishable: 4, // Still on Clerk step
      clerkSecret: 5,      // After Clerk secret, go to Neon (step 5)
      databaseUrl: 6,      // After Neon, go to AI (step 6)
      // aiProvider does not advance step - only aiKey does
      aiKey: 7,            // After AI, go to App Name (step 7)
      appName: 8,          // After App Name, go to Deploy (step 8)
    };

    // Update the session with field value and advance step if applicable
    const updateData: Record<string, unknown> = { [fieldConfig.column]: finalValue };
    if (stepMap[field]) {
      updateData.currentStep = stepMap[field];
    }

    console.log(`Session update - field: ${field}, value: ${field === 'aiProvider' ? value : '[REDACTED]'}, column: ${fieldConfig.column}, encrypted: ${sensitiveFields.includes(field)}`);

    await db
      .update(wizardSessions)
      .set(updateData)
      .where(eq(wizardSessions.id, sanitizedSessionId));

    console.log(`Successfully updated session ${sanitizedSessionId} with field ${field}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session update error:", error);

    // Track error in Sentry
    captureAPIError(error, {
      endpoint: '/api/session',
      method: 'POST',
      statusCode: 500,
    });

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Export POST with CSRF protection
export const POST = withCsrfProtection(postHandler);
