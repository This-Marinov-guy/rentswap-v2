import { NextRequest, NextResponse } from "next/server";
import { logToAxiom } from "@/lib/axiom";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const jobId = request.headers.get('x-qstash-message-id') || crypto.randomUUID();

  try {
    const data = await request.json();

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    await logToAxiom(data);

    const duration = Date.now() - startTime;
    return NextResponse.json({ success: true, jobId, duration });
  } catch (error) {
    const duration = Date.now() - startTime;
    // Return success even on error to prevent QStash retries
    // Errors are logged but don't fail the job
    return NextResponse.json({ success: false, error: "Axiom logging failed", jobId, duration });
  }
}
