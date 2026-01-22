import { NextRequest, NextResponse } from "next/server";
import { logToAxiom } from "@/lib/axiom";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    await logToAxiom(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Background] Axiom logging error:", error);
    // Return success even on error to prevent QStash retries
    // Errors are logged but don't fail the job
    return NextResponse.json({ success: false, error: "Axiom logging failed" });
  }
}
