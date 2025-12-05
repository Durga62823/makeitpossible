import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Try to connect to database
    const result = await prisma.$queryRaw`SELECT NOW()`;

    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
        query_result: result,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Database connection error:", errorMessage);

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: errorMessage,
        timestamp: new Date().toISOString(),
        help: [
          "1. Check if Supabase project is paused at https://app.supabase.com",
          "2. If paused, click 'Resume' to restart the database",
          "3. Verify DATABASE_URL in .env file is correct",
          "4. Wait 2-3 minutes after resuming before retrying",
        ],
      },
      { status: 503 }
    );
  }
}
