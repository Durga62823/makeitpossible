import { requireManager } from "@/lib/guards";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserMenu, LogoutButton } from "@/components/common";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireManager();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8 flex-1">
              <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                Manager
              </h1>
              <nav className="hidden md:flex gap-1">
                <Link
                  href="/manager"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  Overview
                </Link>
                <Link
                  href="/manager/team"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  Team
                </Link>
                <Link
                  href="/manager/timesheets"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  Timesheets
                </Link>
                <Link
                  href="/manager/pto"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  PTO Requests
                </Link>
                <Link
                  href="/manager/appraisals"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  Appraisals
                </Link>
                <Link
                  href="/manager/capacity"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  Capacity
                </Link>
                <Link
                  href="/manager/ai-features"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  ✨ AI Features
                </Link>
              </nav>
            </div>
            {/* User Profile Section - Right Aligned */}
            <div className="flex items-center gap-3 ml-auto">
              <UserMenu
                name={session.user.name}
                email={session.user.email}
                image={session.user.image}
              />
              <LogoutButton
                variant="ghost"
                size="sm"
                showIcon={true}
                showLabel={false}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
