import { requireManager } from "@/lib/guards";
import { getDirectReports, getExtendedTeam } from "@/lib/manager-helpers";
import Link from "next/link";

export const metadata = {
  title: "Team | Manager Dashboard",
};

export default async function ManagerTeamPage() {
  const session = await requireManager();
  const { directReports, extendedReports } = await getExtendedTeam(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Team Overview</h2>
        <p className="mt-1 text-slate-500">
          Your direct reports and extended team members
        </p>
      </div>

      {/* Direct Reports */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Direct Reports ({directReports.length})
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {directReports.map((member) => (
            <div key={member.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </div>
                    <div>
                      <Link
                        href={`/manager/team/${member.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600"
                      >
                        {member.firstName} {member.lastName}
                      </Link>
                      <div className="text-sm text-slate-500">{member.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Position:</span>{" "}
                      <span className="font-medium text-slate-900">
                        {member.position || "Not set"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Department:</span>{" "}
                      <span className="font-medium text-slate-900">
                        {member.department?.name || "Not assigned"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Team:</span>{" "}
                      <span className="font-medium text-slate-900">
                        {member.team?.name || "Not assigned"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Active Projects:</span>{" "}
                      <span className="font-medium text-slate-900">
                        {member.projectMembers.length}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/manager/team/${member.id}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/manager/one-on-ones?userId=${member.id}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Schedule 1:1
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {directReports.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-500">
              No direct reports assigned
            </div>
          )}
        </div>
      </div>

      {/* Extended Team */}
      {extendedReports.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Extended Team ({extendedReports.length})
            </h3>
            <p className="text-sm text-slate-500">
              Reports of your direct reports
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {extendedReports.map((member) => (
              <div key={member.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-slate-500">
                        Reports to {member.manager?.firstName} {member.manager?.lastName}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Position:</span>{" "}
                      <span className="font-medium text-slate-900">
                        {member.position || "Not set"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Team:</span>{" "}
                      <span className="font-medium text-slate-900">
                        {member.team?.name || "Not assigned"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
