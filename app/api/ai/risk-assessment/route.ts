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

    const projectData = await req.json();

    if (!projectData.name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const result = await adminAIService.assessRisk(projectData);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Risk Assessment Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to assess risk" },
      { status: 500 }
    );
  }
}
