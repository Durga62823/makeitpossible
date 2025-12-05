import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata = {
  title: "Settings | Make It Possible",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch user preferences and notifications from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      preferences: true,
      notificationSettings: true,
    },
  });

  const preferences = (user?.preferences as any) || {
    theme: "light",
    language: "English",
    timezone: "UTC",
  };

  const notifications = (user?.notificationSettings as any) || {
    emailNotifications: true,
    projectUpdates: true,
    teamActivity: true,
    loginAlerts: true,
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your preferences, notifications, and account settings
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Preferences & Notifications (wider) */}
        <div className="lg:col-span-2">
          <SettingsClient
            initialPreferences={preferences}
            initialNotifications={notifications}
          />
        </div>

        {/* Right Column - Account Settings */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Account</h2>

          <div className="space-y-3">
            <button className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
              Change Password
            </button>
            <button className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
              Download My Data
            </button>
            <button className="w-full px-4 py-3 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
