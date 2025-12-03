import { requireManager } from "@/lib/guards";
import { getPendingTimesheets } from "@/lib/manager-helpers";
import { TimesheetApprovalCard } from "@/components/manager/TimesheetApprovalCard";

export const metadata = {
  title: "Timesheets | Manager Dashboard",
};

export default async function ManagerTimesheetsPage() {
  const session = await requireManager();
  const timesheets = await getPendingTimesheets(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Team Timesheets</h2>
        <p className="mt-1 text-slate-500">
          Review and approve timesheets from your team
        </p>
      </div>

      {/* Pending Timesheets */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Pending Timesheets ({timesheets.length})
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {timesheets.map((timesheet) => (
            <TimesheetApprovalCard key={timesheet.id} timesheet={timesheet} />
          ))}
          {timesheets.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-500">
              No pending timesheets to review
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
