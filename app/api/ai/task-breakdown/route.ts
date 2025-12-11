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

    const { taskDescription } = await req.json();

    if (!taskDescription) {
      return NextResponse.json(
        { error: "Task description is required" },
        { status: 400 }
      );
    }

    const result = await adminAIService.breakdownTask(taskDescription);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Task Breakdown Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to breakdown task" },
      { status: 500 }
    );
  }
}
