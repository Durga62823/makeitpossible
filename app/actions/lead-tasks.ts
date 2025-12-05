"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireLead } from "@/lib/guards";
import { TaskStatus, TaskPriority, SprintStatus } from "@prisma/client";

/**
 * Create a new task
 */
export async function createTask(data: {
  title: string;
  description?: string;
  projectId?: string;
  assigneeId?: string;
  sprintId?: string;
  priority?: TaskPriority;
  storyPoints?: number;
  estimatedHours?: number;
  tags?: string[];
  acceptanceCriteria?: string;
  technicalNotes?: string;
  dueDate?: Date;
}) {
  try {
    const session = await requireLead();

    const task = await prisma.task.create({
      data: {
        ...data,
        reporterId: session.user.id,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        status: "TODO",
      },
    });

    revalidatePath("/lead/team-board");
    revalidatePath("/lead");

    return { success: true, task };
  } catch (error: any) {
    console.error("Create task error:", error);
    return { success: false, error: error.message || "Failed to create task" };
  }
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  data: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: string;
    sprintId: string;
    storyPoints: number;
    estimatedHours: number;
    actualHours: number;
    blockedReason: string;
    tags: string[];
    acceptanceCriteria: string;
    technicalNotes: string;
    prUrl: string;
    dueDate: Date;
  }>
) {
  try {
    await requireLead();

    const updateData: any = { ...data };
    
    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags);
    }

    // If moving to IN_PROGRESS and no startedAt, set it
    if (data.status === "IN_PROGRESS") {
      const existing = await prisma.task.findUnique({
        where: { id: taskId },
        select: { startedAt: true },
      });
      if (!existing?.startedAt) {
        updateData.startedAt = new Date();
      }
    }

    // If moving to DONE and no completedAt, set it
    if (data.status === "DONE") {
      const existing = await prisma.task.findUnique({
        where: { id: taskId },
        select: { completedAt: true },
      });
      if (!existing?.completedAt) {
        updateData.completedAt = new Date();
      }
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    revalidatePath("/lead/team-board");
    revalidatePath("/lead");
    if (data.sprintId) {
      revalidatePath("/lead/sprints");
    }

    return { success: true, task };
  } catch (error: any) {
    console.error("Update task error:", error);
    return { success: false, error: error.message || "Failed to update task" };
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string) {
  try {
    await requireLead();

    await prisma.task.delete({
      where: { id: taskId },
    });

    revalidatePath("/lead/team-board");
    revalidatePath("/lead");

    return { success: true };
  } catch (error: any) {
    console.error("Delete task error:", error);
    return { success: false, error: error.message || "Failed to delete task" };
  }
}

/**
 * Move task to different status
 */
export async function moveTask(taskId: string, newStatus: TaskStatus) {
  return await updateTask(taskId, { status: newStatus });
}

/**
 * Assign task to user
 */
export async function assignTask(taskId: string, assigneeId: string) {
  return await updateTask(taskId, { assigneeId });
}

/**
 * Create a new sprint
 */
export async function createSprint(data: {
  name: string;
  goal?: string;
  teamId: string;
  startDate: Date;
  endDate: Date;
  capacityHours?: number;
}) {
  try {
    await requireLead();

    const sprint = await prisma.sprint.create({
      data: {
        ...data,
        status: "PLANNING",
      },
    });

    revalidatePath("/lead/sprints");
    revalidatePath("/lead");

    return { success: true, sprint };
  } catch (error: any) {
    console.error("Create sprint error:", error);
    return { success: false, error: error.message || "Failed to create sprint" };
  }
}

/**
 * Update sprint
 */
export async function updateSprint(
  sprintId: string,
  data: Partial<{
    name: string;
    goal: string;
    startDate: Date;
    endDate: Date;
    status: SprintStatus;
    capacityHours: number;
    retrospectiveNotes: string;
  }>
) {
  try {
    await requireLead();

    const sprint = await prisma.sprint.update({
      where: { id: sprintId },
      data,
    });

    revalidatePath("/lead/sprints");
    revalidatePath("/lead");

    return { success: true, sprint };
  } catch (error: any) {
    console.error("Update sprint error:", error);
    return { success: false, error: error.message || "Failed to update sprint" };
  }
}

/**
 * Start sprint (move from PLANNING to ACTIVE)
 */
export async function startSprint(sprintId: string) {
  return await updateSprint(sprintId, { status: "ACTIVE" });
}

/**
 * Complete sprint
 */
export async function completeSprint(sprintId: string, retrospectiveNotes?: string) {
  return await updateSprint(sprintId, {
    status: "COMPLETED",
    retrospectiveNotes,
  });
}

/**
 * Add task to sprint
 */
export async function addTaskToSprint(taskId: string, sprintId: string) {
  return await updateTask(taskId, { sprintId });
}

/**
 * Remove task from sprint
 */
export async function removeTaskFromSprint(taskId: string) {
  return await updateTask(taskId, { sprintId: undefined });
}

/**
 * Record technical metric
 */
export async function recordTechnicalMetric(data: {
  teamId: string;
  projectId?: string;
  metricType: string;
  value: number;
  unit?: string;
  period: string;
  periodStart: Date;
  periodEnd: Date;
  metadata?: any;
}) {
  try {
    await requireLead();

    const metric = await prisma.technicalMetric.create({
      data: {
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });

    revalidatePath("/lead/metrics");

    return { success: true, metric };
  } catch (error: any) {
    console.error("Record metric error:", error);
    return { success: false, error: error.message || "Failed to record metric" };
  }
}

/**
 * Create code review entry
 */
export async function createCodeReview(data: {
  taskId?: string;
  prUrl: string;
  prTitle: string;
  authorId: string;
  linesChanged?: number;
  filesChanged?: number;
}) {
  try {
    await requireLead();

    const review = await prisma.codeReview.create({
      data: {
        ...data,
        status: "pending",
      },
    });

    revalidatePath("/lead/code-reviews");

    return { success: true, review };
  } catch (error: any) {
    console.error("Create code review error:", error);
    return { success: false, error: error.message || "Failed to create code review" };
  }
}

/**
 * Update code review status
 */
export async function updateCodeReview(
  reviewId: string,
  data: {
    status?: string;
    reviewerId?: string;
    comments?: number;
  }
) {
  try {
    const session = await requireLead();

    const updateData: any = { ...data };

    if (data.status === "approved" || data.status === "changes_requested") {
      updateData.reviewedAt = new Date();
      if (!data.reviewerId) {
        updateData.reviewerId = session.user.id;
      }
    }

    if (data.status === "merged") {
      updateData.mergedAt = new Date();
    }

    const review = await prisma.codeReview.update({
      where: { id: reviewId },
      data: updateData,
    });

    revalidatePath("/lead/code-reviews");

    return { success: true, review };
  } catch (error: any) {
    console.error("Update code review error:", error);
    return { success: false, error: error.message || "Failed to update code review" };
  }
}

/**
 * Bulk update task priorities (for reprioritization)
 */
export async function bulkUpdateTaskPriorities(updates: { taskId: string; priority: TaskPriority }[]) {
  try {
    await requireLead();

    await Promise.all(
      updates.map(({ taskId, priority }) =>
        prisma.task.update({
          where: { id: taskId },
          data: { priority },
        })
      )
    );

    revalidatePath("/lead/team-board");

    return { success: true };
  } catch (error: any) {
    console.error("Bulk update priorities error:", error);
    return { success: false, error: error.message || "Failed to update priorities" };
  }
}
