import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/services/notification.service";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const jobId = request.headers.get('x-qstash-message-id') || crypto.randomUUID();
  const timestamp = new Date().toISOString();

  console.log('[QStash Background] Notification job received', {
    jobId,
    timestamp,
    url: request.url,
  });

  try {
    const body = await request.json();
    const { type, data } = body;

    console.log('[QStash Background] Processing notification', {
      jobId,
      type,
      hasData: !!data,
      timestamp,
    });

    if (!type || !data) {
      console.error('[QStash Background] Invalid request data', {
        jobId,
        hasType: !!type,
        hasData: !!data,
        timestamp,
      });
      return NextResponse.json(
        { error: "Missing type or data" },
        { status: 400 }
      );
    }

    const notificationService = new NotificationService();
    await notificationService.sendNotification(
      type as 'room_listing' | 'room_searching',
      data
    );

    const duration = Date.now() - startTime;
    console.log('[QStash Background] Notification sent successfully', {
      jobId,
      type,
      duration,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, jobId, duration });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("[QStash Background] Notification error", {
      jobId,
      error: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      duration,
      timestamp: new Date().toISOString(),
    });
    // Return success even on error to prevent QStash retries
    // Errors are logged but don't fail the job
    return NextResponse.json({ success: false, error: "Notification failed", jobId, duration });
  }
}
