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

    const employeeData = await req.json();

    if (!employeeData.name || !employeeData.role) {
      return NextResponse.json(
        { error: "Employee name and role are required" },
        { status: 400 }
      );
    }

    const result = await adminAIService.reviewPerformance(employeeData);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Performance Review Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate performance review" },
      { status: 500 }
    );
  }
}
