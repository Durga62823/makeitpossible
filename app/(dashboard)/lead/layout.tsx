import { ReactNode } from "react";
import { requireLead } from "@/lib/guards";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LeadLayout({ children }: { children: ReactNode }) {
  const session = await requireLead();

  // Check if user has a team assigned
  try {
    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { teamId: true },
    });

    if (!user?.teamId) {
      redirect("/dashboard?error=no-team-assigned");
    }
  } catch (error) {
    console.error("Database connection error:", error);
    redirect("/dashboard?error=database-connection-failed");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-900">Tech Lead Dashboard</h1>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <nav className="flex space-x-8">
            <Link
              href="/lead"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900"
            >
              Overview
            </Link>
            <Link
              href="/lead/team-board"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900"
            >
              Team Board
            </Link>
            <Link
              href="/lead/sprints"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900"
            >
              Sprints
            </Link>
            <Link
              href="/lead/metrics"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900"
            >
              Technical Metrics
            </Link>
            <Link
              href="/lead/code-reviews"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900"
            >
              Code Reviews
            </Link>
          </nav>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
