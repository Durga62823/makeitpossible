import { requireLead } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import {
  getTeamTasks,
  getTeamSprints,
  getBlockedTasks,
  getTeamWorkload,
  getSprintVelocity,
} from "@/lib/lead-helpers";
import Link from "next/link";

export default async function LeadOverviewPage() {
  const session = await requireLead();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          _count: {
            select: { users: true },
          },
        },
      },
    },
  });

  if (!user?.team) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Team Assigned</h2>
        <p className="text-gray-600">Please contact your administrator to assign you to a team.</p>
      </div>
    );
  }

  const teamId = user.team.id;

  const [
    allTasks,
    activeSprints,
    blockedTasks,
    workload,
    velocityData,
  ] = await Promise.all([
    getTeamTasks(teamId),
    getTeamSprints(teamId, false),
    getBlockedTasks(teamId),
    getTeamWorkload(teamId),
    getSprintVelocity(teamId, 5),
  ]);

  const tasksByStatus = {
    todo: allTasks.filter((t) => t.status === "TODO").length,
    inProgress: allTasks.filter((t) => t.status === "IN_PROGRESS").length,
    inReview: allTasks.filter((t) => t.status === "IN_REVIEW").length,
    done: allTasks.filter((t) => t.status === "DONE").length,
    blocked: blockedTasks.length,
  };

  const currentSprint = activeSprints.find((s) => s.status === "ACTIVE");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{user.team.name}</h2>
        <p className="text-gray-600">
          {user.team._count.users} team members • {allTasks.length} total tasks
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">To Do</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{tasksByStatus.todo}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">In Progress</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{tasksByStatus.inProgress}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">In Review</div>
          <div className="mt-2 text-3xl font-bold text-purple-600">{tasksByStatus.inReview}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Done</div>
          <div className="mt-2 text-3xl font-bold text-green-600">{tasksByStatus.done}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Blocked</div>
          <div className="mt-2 text-3xl font-bold text-red-600">{tasksByStatus.blocked}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Sprint */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Sprint</h3>
          {currentSprint ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">{currentSprint.name}</h4>
                  {currentSprint.goal && (
                    <p className="text-sm text-gray-600 mt-1">{currentSprint.goal}</p>
                  )}
                </div>
                <Link
                  href="/lead/sprints"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Details →
                </Link>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{currentSprint.progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${currentSprint.progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tasks:</span>{" "}
                    <span className="font-medium">
                      {currentSprint.completedTasks} / {currentSprint.totalTasks}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Points:</span>{" "}
                    <span className="font-medium">
                      {currentSprint.completedPoints} / {currentSprint.totalPoints}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Ends: {new Date(currentSprint.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No active sprint</p>
              <Link
                href="/lead/sprints"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Plan Sprint
              </Link>
            </div>
          )}
        </div>

        {/* Sprint Velocity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sprint Velocity</h3>
          {velocityData.velocities.length > 0 ? (
            <div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {velocityData.avgVelocity.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Average points per sprint</div>
              </div>
              <div className="space-y-2">
                {velocityData.velocities.slice(0, 3).map((v) => (
                  <div key={v.sprintId} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{v.sprintName}</span>
                    <span className="text-sm font-medium">{v.points} points</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No completed sprints yet
            </p>
          )}
        </div>
      </div>

      {/* Blocked Tasks */}
      {blockedTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">⚠️</span> Blocked Tasks
            </h3>
            <Link
              href="/lead/team-board?filter=blocked"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {blockedTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-3 bg-red-50 rounded border border-red-200"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  {task.blockedReason && (
                    <p className="text-sm text-gray-600 mt-1">{task.blockedReason}</p>
                  )}
                  {task.project && (
                    <p className="text-xs text-gray-500 mt-1">{task.project.name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Workload */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Team Workload</h3>
          <Link
            href="/lead/team-board"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Manage Tasks →
          </Link>
        </div>
        <div className="space-y-4">
          {workload.slice(0, 5).map((member) => (
            <div key={member.userId}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{member.userName}</span>
                <span className="text-sm text-gray-600">
                  {member.taskCount} tasks • {member.storyPoints} pts
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (member.storyPoints / Math.max(...workload.map((w) => w.storyPoints))) * 100
                      )}%`,
                    }}
                  />
                </div>
                {member.blocked > 0 && (
                  <span className="text-xs text-red-600 font-medium">
                    {member.blocked} blocked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/lead/team-board?action=create-task"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="text-2xl mb-2">➕</div>
          <h4 className="font-semibold text-gray-900">Create Task</h4>
          <p className="text-sm text-gray-600 mt-1">Add a new task to the board</p>
        </Link>
        <Link
          href="/lead/sprints?action=create-sprint"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="text-2xl mb-2">📅</div>
          <h4 className="font-semibold text-gray-900">Plan Sprint</h4>
          <p className="text-sm text-gray-600 mt-1">Create and plan a new sprint</p>
        </Link>
        <Link
          href="/lead/metrics"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="text-2xl mb-2">📊</div>
          <h4 className="font-semibold text-gray-900">View Metrics</h4>
          <p className="text-sm text-gray-600 mt-1">Track team technical metrics</p>
        </Link>
      </div>
    </div>
  );
}
