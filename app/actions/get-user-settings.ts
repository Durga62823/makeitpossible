"use server";

import { prisma } from "@/lib/prisma";
import { requireLead } from "@/lib/guards";

export async function getUserSettings() {
  try {
    const session = await requireLead();
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        preferences: true,
        notificationSettings: true,
      },
    });

    return {
      preferences: (user?.preferences as any) || {
        darkMode: false,
        compactView: false,
        timezone: "UTC (GMT+0:00)",
        language: "English",
      },
      notificationSettings: (user?.notificationSettings as any) || {
        taskAssignments: true,
        codeReviews: true,
        sprintUpdates: true,
        blockedTasks: true,
        weeklySummary: false,
      },
    };
  } catch (error) {
    console.error("Failed to load user settings:", error);
    return {
      preferences: {
        compactView: false,
        timezone: 'UTC (GMT+0:00)',
        language: 'English',
      },tificationSettings: {
        taskAssignments: true,
        codeReviews: true,
        sprintUpdates: true,
        blockedTasks: true,
        weeklySummary: false,
      },
    };
  }
}
