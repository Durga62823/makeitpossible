import { requireLead } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { getTeamTasks, getTeamMembers } from "@/lib/lead-helpers";
import { TaskBoard } from "@/components/lead/TaskBoard";

export default async function TeamBoardPage() {
  const session = await requireLead();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      team: {
        select: {
          id: true,
          name: true,
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

  const [tasks, teamMembers] = await Promise.all([
    getTeamTasks(user.team.id),
    getTeamMembers(session.user.id),
  ]);

  // Get active sprints for filtering
  const sprints = await prisma.sprint.findMany({
    where: {
      teamId: user.team.id,
      status: { in: ["PLANNING", "ACTIVE"] },
    },
    select: {
      id: true,
      name: true,
      status: true,
    },
    orderBy: { startDate: "desc" },
  });

  // Get team projects for filtering
  const projects = await prisma.project.findMany({
    where: { teamId: user.team.id },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{user.team.name} - Task Board</h2>
        <p className="text-gray-600 mt-1">Manage and coordinate team tasks</p>
      </div>

      <TaskBoard
        tasks={tasks}
        teamMembers={teamMembers}
        sprints={sprints}
        projects={projects}
      />
    </div>
  );
}
