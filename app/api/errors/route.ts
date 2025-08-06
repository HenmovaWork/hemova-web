import { NextRequest, NextResponse } from "next/server";

interface ErrorLogData {
  message: string;
  stack?: string;
  digest?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  buildId?: string;
  component?: string;
  props?: Record<string, any>;
  additionalContext?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const errorData: ErrorLogData = await request.json();

    // Validate required fields
    if (!errorData.message || !errorData.timestamp) {
      return NextResponse.json(
        { error: "Missing required fields: message and timestamp" },
        { status: 400 },
      );
    }

    // Add server-side context
    const enrichedErrorData = {
      ...errorData,
      serverTimestamp: new Date().toISOString(),
      ip:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      headers: {
        "user-agent": request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
        "x-forwarded-for": request.headers.get("x-forwarded-for"),
      },
    };

    // Log to console (in production, you'd send to external service)
    console.error("Client error received:", enrichedErrorData);

    // In production, send to external monitoring service
    if (process.env.NODE_ENV === "production") {
      await sendToMonitoringService(enrichedErrorData);
    }

    // Store in database or file system if needed
    await storeError(enrichedErrorData);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing error log:", error);
    return NextResponse.json(
      { error: "Failed to process error log" },
      { status: 500 },
    );
  }
}

async function sendToMonitoringService(errorData: any): Promise<void> {
  // Example integrations:

  // Sentry
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureException(new Error(errorData.message), {
  //     extra: errorData,
  //   });
  // }

  // LogRocket
  // if (process.env.LOGROCKET_APP_ID) {
  //   LogRocket.captureException(new Error(errorData.message));
  // }

  // Custom webhook
  if (process.env.ERROR_WEBHOOK_URL) {
    try {
      await fetch(process.env.ERROR_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ERROR_WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify(errorData),
      });
    } catch (webhookError) {
      console.error("Failed to send to webhook:", webhookError);
    }
  }
}

async function storeError(errorData: any): Promise<void> {
  // In a real application, you might store errors in:
  // - Database (MongoDB, PostgreSQL, etc.)
  // - File system
  // - Cloud storage (S3, Google Cloud Storage)

  // For now, we'll just log to console
  // In production, implement proper storage
  console.log("Error stored:", {
    timestamp: errorData.serverTimestamp,
    message: errorData.message,
    component: errorData.component,
    url: errorData.url,
  });
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
