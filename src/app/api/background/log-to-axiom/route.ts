import { NextRequest, NextResponse } from "next/server";
import { logToAxiom } from "@/lib/axiom";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const jobId = request.headers.get('x-qstash-message-id') || crypto.randomUUID();
  const timestamp = new Date().toISOString();

  console.log('[QStash Background] Axiom logging job received', {
    jobId,
    timestamp,
    url: request.url,
  });

  try {
    const data = await request.json();

    console.log('[QStash Background] Processing Axiom log', {
      jobId,
      dataType: data.type,
      hasRequestId: !!data.requestId,
      timestamp,
    });

    if (!data || typeof data !== 'object') {
      console.error('[QStash Background] Invalid data format', {
        jobId,
        dataType: typeof data,
        timestamp,
      });
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    await logToAxiom(data);

    const duration = Date.now() - startTime;
    console.log('[QStash Background] Axiom log sent successfully', {
      jobId,
      dataType: data.type,
      duration,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, jobId, duration });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("[QStash Background] Axiom logging error", {
      jobId,
      error: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      duration,
      timestamp: new Date().toISOString(),
    });
    // Return success even on error to prevent QStash retries
    // Errors are logged but don't fail the job
    return NextResponse.json({ success: false, error: "Axiom logging failed", jobId, duration });
  }
}
