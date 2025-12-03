import { requireManager } from "@/lib/guards";
import { getTeamAppraisals } from "@/lib/manager-helpers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Appraisals | Manager Dashboard",
};

export default async function ManagerAppraisalsPage() {
  const session = await requireManager();
  
  const [cycles, teamAppraisals] = await Promise.all([
    prisma.appraisalCycle.findMany({
      orderBy: { startDate: "desc" },
      take: 5,
    }),
    getTeamAppraisals(session.user.id),
  ]);

  const activeCycle = cycles.find(c => c.status === "IN_PROGRESS");
  const draft = teamAppraisals.filter(a => a.status === "DRAFT");
  const inProgress = teamAppraisals.filter(a => a.status === "IN_PROGRESS");
  const completed = teamAppraisals.filter(a => a.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Team Appraisals</h2>
        <p className="mt-1 text-slate-500">
          Conduct performance reviews and manage team appraisals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-500">Draft</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">
            {draft.length}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-500">In Progress</div>
          <div className="mt-1 text-2xl font-semibold text-blue-600">
            {inProgress.length}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-500">Completed</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">
            {completed.length}
          </div>
        </div>
      </div>

      {/* Active Cycle */}
      {activeCycle && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {activeCycle.name}
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                {activeCycle.description}
              </p>
              <div className="mt-2 text-sm text-blue-600">
                {new Date(activeCycle.startDate).toLocaleDateString()} -{" "}
                {new Date(activeCycle.endDate).toLocaleDateString()}
              </div>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              Active Cycle
            </span>
          </div>
        </div>
      )}

      {/* In Progress Reviews */}
      {inProgress.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              In Progress ({inProgress.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {inProgress.map((review) => (
              <div key={review.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-900">
                      {review.user.firstName} {review.user.lastName}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {review.user.position} • {review.cycle.name}
                    </div>
                    {review.selfReview && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Self-review submitted
                        </span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/manager/appraisals/${review.id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Conduct Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draft Reviews */}
      {draft.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Draft ({draft.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {draft.map((review) => (
              <div key={review.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-900">
                      {review.user.firstName} {review.user.lastName}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {review.user.position} • {review.cycle.name}
                    </div>
                  </div>
                  <Link
                    href={`/manager/appraisals/${review.id}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Start Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Reviews */}
      {completed.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Completed ({completed.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {completed.slice(0, 10).map((review) => (
              <div key={review.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-900">
                      {review.user.firstName} {review.user.lastName}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {review.user.position} • {review.cycle.name}
                    </div>
                    {review.finalRating && (
                      <div className="mt-2 text-sm">
                        <span className="text-slate-500">Final Rating:</span>{" "}
                        <span className="font-semibold text-slate-900">
                          {review.finalRating.toFixed(1)}/5.0
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/manager/appraisals/${review.id}`}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {teamAppraisals.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
          No appraisals available
        </div>
      )}
    </div>
  );
}
