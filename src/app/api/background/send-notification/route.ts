import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/services/notification.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Background] Notification error:", error);
    // Return success even on error to prevent QStash retries
    // Errors are logged but don't fail the job
    return NextResponse.json({ success: false, error: "Notification failed" });
  }
}
