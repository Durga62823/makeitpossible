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

    const sprintData = await req.json();

    if (!sprintData.teamMembers || !sprintData.tasks) {
      return NextResponse.json(
        { error: "Team members and tasks are required" },
        { status: 400 }
      );
    }

    const result = await adminAIService.planSprint(sprintData);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Sprint Planning Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to plan sprint" },
      { status: 500 }
    );
  }
}
