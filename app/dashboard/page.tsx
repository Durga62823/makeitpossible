import { auth } from "@/lib/auth";
import Link from "next/link";

export const metadata = {
  title: "Dashboard | Make It Possible",
};

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="px-8 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {session?.user?.name ?? "Leader"}</h1>
        <p className="mt-3 text-slate-500">
          This is a protected area. Plug in your dashboards, AI copilots, and workflows here.
        </p>
        
        <div className="mt-6 flex flex-wrap gap-3">
          {(session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER" || session?.user?.role === "LEAD") && (
            <>
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Admin Dashboard
                </Link>
              )}
              {(session?.user?.role === "MANAGER" || session?.user?.role === "ADMIN") && (
                <Link
                  href="/manager"
                  className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Manager Dashboard
                </Link>
              )}
              {(session?.user?.role === "LEAD" || session?.user?.role === "ADMIN") && (
                <Link
                  href="/lead"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  Tech Lead Dashboard
                </Link>
              )}
            </>
          )}
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
