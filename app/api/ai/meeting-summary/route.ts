import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminAIService } from "@/lib/ai-services";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { meetingTranscript } = await req.json();

    if (!meetingTranscript) {
      return NextResponse.json(
        { error: "Meeting transcript is required" },
        { status: 400 }
      );
    }

    const result = await adminAIService.summarizeMeeting(meetingTranscript);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Meeting Summary Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to summarize meeting" },
      { status: 500 }
    );
  }
}
