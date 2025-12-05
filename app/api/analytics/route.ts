import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, departmentId: true, managerId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdmin = userRole === "ADMIN";

    // Get summary metrics
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { status: "ACTIVE" },
    });
    const totalProjects = await prisma.project.count();
    const completedProjects = await prisma.project.count({
      where: { status: "COMPLETED" },
    });
    const totalAppraisals = await prisma.appraisalReview.count();

    const appraisalRating = await prisma.appraisalReview.aggregate({
      _avg: { finalRating: true },
    });

    // Get breakdown data
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    });

    const projectsByStatus = await prisma.project.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const ptoStats = await prisma.pTORequest.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const timesheetStats = await prisma.timesheet.groupBy({
      by: ["status"],
      _count: { id: true },
      _sum: { totalHours: true },
    });

    return NextResponse.json({
      summary: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalProjects,
        completedProjects,
        ongoingProjects: totalProjects - completedProjects,
        totalAppraisals,
        averageRating: appraisalRating._avg.finalRating
          ? Number(appraisalRating._avg.finalRating.toFixed(1))
          : 0,
      },
      usersByRole: usersByRole.map((item) => ({
        role: item.role,
        count: item._count.id,
      })),
      projectsByStatus: projectsByStatus.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
      ptoStats: ptoStats.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
      timesheetStats: timesheetStats.map((item) => ({
        status: item.status,
        count: item._count.id,
        totalHours: item._sum.totalHours || 0,
      })),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
