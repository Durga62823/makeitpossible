import { ReactNode } from "react";
import { requireLead } from "@/lib/guards";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SettingsProvider } from "@/components/providers/settings-provider";

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
    <SettingsProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="border-b bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Lead Dashboard</h1>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <nav className="flex space-x-8">
            <Link
              href="/lead"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Overview
            </Link>
            <Link
              href="/lead/team-board"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Team Board
            </Link>
            <Link
              href="/lead/sprints"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Sprints
            </Link>
            <Link
              href="/lead/metrics"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Technical Metrics
            </Link>
            <Link
              href="/lead/code-reviews"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Code Reviews
            </Link>
            <Link
              href="/lead/profile"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Profile
            </Link>
            <Link
              href="/lead/settings"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Settings
            </Link>
            <Link
              href="/lead/ai-features"
              className="border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              ✨ AI Features
            </Link>
          </nav>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8 dark:text-gray-100">{children}</main>
      </div>
    </SettingsProvider>
  );
}