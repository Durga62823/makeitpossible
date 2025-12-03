import { requireManager } from "@/lib/guards";
import {
  getDirectReports,
  getTeamCapacity,
  getPendingPTORequests,
  getPendingTimesheets,
} from "@/lib/manager-helpers";
import Link from "next/link";

export const metadata = {
  title: "Manager Dashboard | Make It Possible",
};

export default async function ManagerPage() {
  const session = await requireManager();
  
  const [directReports, pendingPTO, pendingTimesheets, teamCapacity] = await Promise.all([
    getDirectReports(session.user.id),
    getPendingPTORequests(session.user.id),
    getPendingTimesheets(session.user.id),
    getTeamCapacity(session.user.id),
  ]);

  const avgUtilization = teamCapacity.length > 0
    ? teamCapacity.reduce((sum, m) => sum + m.utilization, 0) / teamCapacity.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Welcome, {session.user.name || "Manager"}
        </h2>
        <p className="mt-1 text-slate-500">
          Here's what's happening with your team
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-medium text-slate-500">Team Members</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {directReports.length}
          </div>
          <Link
            href="/manager/team"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View team →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-medium text-slate-500">Pending PTO</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {pendingPTO.length}
          </div>
          <Link
            href="/manager/pto"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Review requests →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-medium text-slate-500">Pending Timesheets</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {pendingTimesheets.length}
          </div>
          <Link
            href="/manager/timesheets"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Review timesheets →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-medium text-slate-500">Team Utilization</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {(avgUtilization * 100).toFixed(0)}%
          </div>
          <Link
            href="/manager/capacity"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View capacity →
          </Link>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent PTO Requests */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Recent PTO Requests</h3>
            <Link
              href="/manager/pto"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {pendingPTO.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div>
                  <div className="font-medium text-slate-900">
                    {request.user.firstName} {request.user.lastName}
                  </div>
                  <div className="text-sm text-slate-500">
                    {request.type.replace("_", " ")} • {request.days} days
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  {new Date(request.startDate).toLocaleDateString()}
                </div>
              </div>
            ))}
            {pendingPTO.length === 0 && (
              <div className="py-8 text-center text-sm text-slate-500">
                No pending PTO requests
              </div>
            )}
          </div>
        </div>

        {/* Recent Timesheets */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Pending Timesheets</h3>
            <Link
              href="/manager/timesheets"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {pendingTimesheets.slice(0, 5).map((timesheet) => (
              <div
                key={timesheet.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div>
                  <div className="font-medium text-slate-900">
                    {timesheet.user.firstName} {timesheet.user.lastName}
                  </div>
                  <div className="text-sm text-slate-500">
                    Week of {new Date(timesheet.weekStart).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {timesheet.totalHours}h
                </div>
              </div>
            ))}
            {pendingTimesheets.length === 0 && (
              <div className="py-8 text-center text-sm text-slate-500">
                No pending timesheets
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Capacity Overview */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Team Capacity</h3>
        <div className="space-y-4">
          {teamCapacity.map((member) => (
            <div key={member.user.id} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="font-medium text-slate-900">
                  {member.user.firstName} {member.user.lastName}
                </div>
                <div className="text-sm text-slate-500">
                  {member.activeProjects} active projects • {member.avgWeeklyHours.toFixed(1)}h/week avg
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full ${
                      member.utilization > 1
                        ? "bg-red-500"
                        : member.utilization > 0.8
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(member.utilization * 100, 100)}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-medium text-slate-900">
                  {(member.utilization * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
          {teamCapacity.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-500">
              No team members assigned
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
