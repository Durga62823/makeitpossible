import { prisma } from "@/lib/prisma";

/**
 * Get all direct reports for a manager
 */
export async function getDirectReports(managerId: string) {
  return prisma.user.findMany({
    where: {
      managerId,
      status: "ACTIVE",
    },
    include: {
      team: true,
      department: true,
      projectMembers: {
        include: {
          project: true,
        },
      },
    },
    orderBy: {
      firstName: "asc",
    },
  });
}

/**
 * Get extended team members (direct reports + their reports)
 */
export async function getExtendedTeam(managerId: string) {
  const directReports = await getDirectReports(managerId);
  const directReportIds = directReports.map(r => r.id);
  
  const extendedReports = await prisma.user.findMany({
    where: {
      managerId: {
        in: directReportIds,
      },
      status: "ACTIVE",
    },
    include: {
      manager: true,
      team: true,
      department: true,
    },
  });
  
  return {
    directReports,
    extendedReports,
    all: [...directReports, ...extendedReports],
  };
}

/**
 * Check if a user is a direct report of the manager
 */
export async function isDirectReport(managerId: string, userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { managerId: true },
  });
  
  return user?.managerId === managerId;
}

/**
 * Get team capacity and workload
 */
export async function getTeamCapacity(managerId: string) {
  const team = await getDirectReports(managerId);
  
  // Get active projects for team members
  const projectCounts = await prisma.projectMember.groupBy({
    by: ["userId"],
    where: {
      userId: {
        in: team.map(m => m.id),
      },
      project: {
        status: {
          in: ["ON_TRACK", "AT_RISK", "DELAYED"],
        },
      },
    },
    _count: true,
  });
  
  // Get recent timesheet data
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  const timesheets = await prisma.timesheet.findMany({
    where: {
      userId: {
        in: team.map(m => m.id),
      },
      weekStart: {
        gte: twoWeeksAgo,
      },
      status: {
        in: ["APPROVED", "SUBMITTED"],
      },
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  
  const capacityByUser = team.map(member => {
    const projects = projectCounts.find(p => p.userId === member.id)?._count || 0;
    const userTimesheets = timesheets.filter(t => t.userId === member.id);
    const avgHours = userTimesheets.length > 0
      ? userTimesheets.reduce((sum, t) => sum + t.totalHours, 0) / userTimesheets.length
      : 0;
    
    return {
      user: member,
      activeProjects: projects,
      avgWeeklyHours: avgHours,
      utilization: avgHours / 40, // assuming 40hr work week
    };
  });
  
  return capacityByUser;
}

/**
 * Get team performance metrics
 */
export async function getTeamMetrics(managerId: string) {
  const team = await getDirectReports(managerId);
  const teamIds = team.map(m => m.id);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const metrics = await prisma.performanceMetric.findMany({
    where: {
      userId: {
        in: teamIds,
      },
      recordedAt: {
        gte: thirtyDaysAgo,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      recordedAt: "desc",
    },
  });
  
  return metrics;
}

/**
 * Get pending PTO requests for manager's team
 */
export async function getPendingPTORequests(managerId: string) {
  const team = await getDirectReports(managerId);
  
  return prisma.pTORequest.findMany({
    where: {
      userId: {
        in: team.map(m => m.id),
      },
      status: "PENDING",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

/**
 * Get pending timesheets for manager's team
 */
export async function getPendingTimesheets(managerId: string) {
  const team = await getDirectReports(managerId);
  
  return prisma.timesheet.findMany({
    where: {
      userId: {
        in: team.map(m => m.id),
      },
      status: "SUBMITTED",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      entries: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      weekStart: "desc",
    },
  });
}

/**
 * Get appraisal reviews for manager's team
 */
export async function getTeamAppraisals(managerId: string, cycleId?: string) {
  const team = await getDirectReports(managerId);
  
  return prisma.appraisalReview.findMany({
    where: {
      userId: {
        in: team.map(m => m.id),
      },
      ...(cycleId ? { cycleId } : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          position: true,
        },
      },
      cycle: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Get team calendar (PTO, holidays, availability)
 */
export async function getTeamCalendar(managerId: string, startDate: Date, endDate: Date) {
  const team = await getDirectReports(managerId);
  
  const ptoRequests = await prisma.pTORequest.findMany({
    where: {
      userId: {
        in: team.map(m => m.id),
      },
      status: "APPROVED",
      OR: [
        {
          startDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          endDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });
  
  return {
    team,
    ptoRequests,
  };
}
