import { prisma } from "@/lib/prisma";
import { TaskStatus, SprintStatus } from "@prisma/client";

/**
 * Get all team members for a lead
 */
export async function getTeamMembers(leadId: string) {
  const lead = await prisma.user.findUnique({
    where: { id: leadId },
    include: {
      team: {
        include: {
          users: {
            where: { status: "ACTIVE" },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              position: true,
            },
          },
        },
      },
    },
  });

  return lead?.team?.users || [];
}

/**
 * Get all tasks for the team
 */
export async function getTeamTasks(teamId: string, filters?: {
  status?: TaskStatus;
  sprintId?: string;
  assigneeId?: string;
}) {
  const where: any = {};
  
  // Get team projects
  const teamProjects = await prisma.project.findMany({
    where: { teamId },
    select: { id: true },
  });
  
  const projectIds = teamProjects.map(p => p.id);
  
  if (projectIds.length > 0) {
    where.projectId = { in: projectIds };
  }
  
  if (filters?.status) {
    where.status = filters.status;
  }
  
  if (filters?.sprintId) {
    where.sprintId = filters.sprintId;
  }
  
  if (filters?.assigneeId) {
    where.assigneeId = filters.assigneeId;
  }

  return await prisma.task.findMany({
    where,
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      sprint: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  });
}

/**
 * Get team workload distribution
 */
export async function getTeamWorkload(teamId: string) {
  const teamMembers = await prisma.user.findMany({
    where: { teamId, status: "ACTIVE" },
    select: { id: true, name: true },
  });

  const teamProjects = await prisma.project.findMany({
    where: { teamId },
    select: { id: true },
  });
  
  const projectIds = teamProjects.map(p => p.id);

  const workload = await Promise.all(
    teamMembers.map(async (member) => {
      const tasks = await prisma.task.findMany({
        where: {
          assigneeId: member.id,
          projectId: { in: projectIds },
          status: { in: ["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED"] },
        },
        select: {
          id: true,
          status: true,
          storyPoints: true,
          estimatedHours: true,
        },
      });

      const totalStoryPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

      return {
        userId: member.id,
        userName: member.name,
        taskCount: tasks.length,
        storyPoints: totalStoryPoints,
        estimatedHours: totalEstimatedHours,
        inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
        blocked: tasks.filter(t => t.status === "BLOCKED").length,
      };
    })
  );

  return workload;
}

/**
 * Get current and upcoming sprints for the team
 */
export async function getTeamSprints(teamId: string, includeCompleted = false) {
  const where: any = { teamId };
  
  if (!includeCompleted) {
    where.status = { in: ["PLANNING", "ACTIVE"] };
  }

  const sprints = await prisma.sprint.findMany({
    where,
    include: {
      tasks: {
        select: {
          id: true,
          status: true,
          storyPoints: true,
        },
      },
    },
    orderBy: { startDate: "desc" },
  });

  return sprints.map(sprint => {
    const totalPoints = sprint.tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    const completedPoints = sprint.tasks
      .filter(t => t.status === "DONE")
      .reduce((sum, t) => sum + (t.storyPoints || 0), 0);

    return {
      ...sprint,
      totalTasks: sprint.tasks.length,
      completedTasks: sprint.tasks.filter(t => t.status === "DONE").length,
      totalPoints,
      completedPoints,
      progress: totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0,
    };
  });
}

/**
 * Get sprint burndown data
 */
export async function getSprintBurndown(sprintId: string) {
  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    include: {
      tasks: {
        select: {
          id: true,
          storyPoints: true,
          completedAt: true,
        },
      },
    },
  });

  if (!sprint) return null;

  const totalPoints = sprint.tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  const sprintDays = Math.ceil(
    (sprint.endDate.getTime() - sprint.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate ideal burndown
  const idealBurndown = Array.from({ length: sprintDays + 1 }, (_, i) => ({
    day: i,
    ideal: totalPoints - (totalPoints / sprintDays) * i,
  }));

  // Calculate actual burndown
  const completedByDay = sprint.tasks
    .filter(t => t.completedAt)
    .reduce((acc: Record<number, number>, task) => {
      const daysSinceStart = Math.floor(
        (task.completedAt!.getTime() - sprint.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      acc[daysSinceStart] = (acc[daysSinceStart] || 0) + (task.storyPoints || 0);
      return acc;
    }, {});

  let remainingPoints = totalPoints;
  const actualBurndown = idealBurndown.map(({ day }) => {
    remainingPoints -= completedByDay[day] || 0;
    return {
      day,
      actual: Math.max(0, remainingPoints),
    };
  });

  return {
    totalPoints,
    sprintDays,
    idealBurndown,
    actualBurndown,
  };
}

/**
 * Get technical metrics for the team
 */
export async function getTeamTechnicalMetrics(teamId: string, periodStart: Date, periodEnd: Date) {
  const metrics = await prisma.technicalMetric.findMany({
    where: {
      teamId,
      periodStart: { gte: periodStart },
      periodEnd: { lte: periodEnd },
    },
    orderBy: { recordedAt: "desc" },
  });

  // Group by metric type
  const grouped = metrics.reduce((acc: Record<string, any[]>, metric) => {
    if (!acc[metric.metricType]) {
      acc[metric.metricType] = [];
    }
    acc[metric.metricType].push(metric);
    return acc;
  }, {});

  return grouped;
}

/**
 * Get pending code reviews for the team
 */
export async function getTeamCodeReviews(teamId: string, status?: string) {
  const teamMembers = await prisma.user.findMany({
    where: { teamId, status: "ACTIVE" },
    select: { id: true },
  });

  const memberIds = teamMembers.map(m => m.id);
  const where: any = {
    OR: [
      { authorId: { in: memberIds } },
      { reviewerId: { in: memberIds } },
    ],
  };

  if (status) {
    where.status = status;
  }

  return await prisma.codeReview.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

/**
 * Get blocked tasks for the team
 */
export async function getBlockedTasks(teamId: string) {
  const teamProjects = await prisma.project.findMany({
    where: { teamId },
    select: { id: true },
  });
  
  const projectIds = teamProjects.map(p => p.id);

  return await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
      status: "BLOCKED",
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Get sprint velocity (average points completed per sprint)
 */
export async function getSprintVelocity(teamId: string, lastNSprints = 5) {
  const completedSprints = await prisma.sprint.findMany({
    where: {
      teamId,
      status: "COMPLETED",
    },
    include: {
      tasks: {
        where: { status: "DONE" },
        select: { storyPoints: true },
      },
    },
    orderBy: { endDate: "desc" },
    take: lastNSprints,
  });

  const velocities = completedSprints.map(sprint => ({
    sprintId: sprint.id,
    sprintName: sprint.name,
    points: sprint.tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0),
  }));

  const avgVelocity =
    velocities.length > 0
      ? velocities.reduce((sum, v) => sum + v.points, 0) / velocities.length
      : 0;

  return {
    velocities,
    avgVelocity,
  };
}

/**
 * Get task cycle time and lead time metrics
 */
export async function getTaskMetrics(teamId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const teamProjects = await prisma.project.findMany({
    where: { teamId },
    select: { id: true },
  });
  
  const projectIds = teamProjects.map(p => p.id);

  const completedTasks = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
      status: "DONE",
      completedAt: { gte: since },
    },
    select: {
      id: true,
      createdAt: true,
      startedAt: true,
      completedAt: true,
    },
  });

  const metrics = completedTasks.map(task => {
    const leadTime = task.completedAt && task.createdAt
      ? (task.completedAt.getTime() - task.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      : 0;

    const cycleTime = task.completedAt && task.startedAt
      ? (task.completedAt.getTime() - task.startedAt.getTime()) / (1000 * 60 * 60 * 24)
      : 0;

    return { taskId: task.id, leadTime, cycleTime };
  });

  const avgLeadTime = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.leadTime, 0) / metrics.length
    : 0;

  const avgCycleTime = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.cycleTime, 0) / metrics.length
    : 0;

  return {
    completedTasks: metrics.length,
    avgLeadTime,
    avgCycleTime,
    metrics,
  };
}

/**
 * Get AI-suggested task assignments based on workload and skills
 */
export async function getAISuggestedAssignments(teamId: string, taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      title: true,
      description: true,
      tags: true,
      storyPoints: true,
    },
  });

  if (!task) return [];

  const workload = await getTeamWorkload(teamId);

  // Simple AI logic: suggest members with lowest workload
  // In production, this would use actual AI/ML based on skills, past performance, etc.
  const suggestions = workload
    .sort((a, b) => a.storyPoints - b.storyPoints)
    .slice(0, 3)
    .map((member, index) => ({
      userId: member.userId,
      userName: member.userName,
      currentWorkload: member.storyPoints,
      confidence: 0.9 - index * 0.1, // Mock confidence score
      reason: `Low workload (${member.storyPoints} points), available capacity`,
    }));

  return suggestions;
}
