"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/guards";
import { isDirectReport } from "@/lib/manager-helpers";

export async function approvePTORequest(requestId: string) {
  const session = await requireManager();

  const request = await prisma.pTORequest.findUnique({
    where: { id: requestId },
    select: { userId: true, status: true },
  });

  if (!request) {
    return { success: false, error: "Request not found" };
  }

  if (request.status !== "PENDING") {
    return { success: false, error: "Request is not pending" };
  }

  // Verify this is their direct report
  const isDirectRep = await isDirectReport(session.user.id, request.userId);
  if (!isDirectRep && session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.pTORequest.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      approverId: session.user.id,
      approvedAt: new Date(),
    },
  });

  revalidatePath("/manager/pto");
  return { success: true };
}

export async function rejectPTORequest(requestId: string, reason: string) {
  const session = await requireManager();

  const request = await prisma.pTORequest.findUnique({
    where: { id: requestId },
    select: { userId: true, status: true },
  });

  if (!request) {
    return { success: false, error: "Request not found" };
  }

  if (request.status !== "PENDING") {
    return { success: false, error: "Request is not pending" };
  }

  const isDirectRep = await isDirectReport(session.user.id, request.userId);
  if (!isDirectRep && session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.pTORequest.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      approverId: session.user.id,
      rejectionReason: reason,
      approvedAt: new Date(),
    },
  });

  revalidatePath("/manager/pto");
  return { success: true };
}

export async function approveTimesheet(timesheetId: string) {
  const session = await requireManager();

  const timesheet = await prisma.timesheet.findUnique({
    where: { id: timesheetId },
    select: { userId: true, status: true },
  });

  if (!timesheet) {
    return { success: false, error: "Timesheet not found" };
  }

  if (timesheet.status !== "SUBMITTED") {
    return { success: false, error: "Timesheet is not submitted" };
  }

  const isDirectRep = await isDirectReport(session.user.id, timesheet.userId);
  if (!isDirectRep && session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.timesheet.update({
    where: { id: timesheetId },
    data: {
      status: "APPROVED",
      approverId: session.user.id,
      approvedAt: new Date(),
    },
  });

  revalidatePath("/manager/timesheets");
  return { success: true };
}

export async function rejectTimesheet(timesheetId: string, comments: string) {
  const session = await requireManager();

  const timesheet = await prisma.timesheet.findUnique({
    where: { id: timesheetId },
    select: { userId: true, status: true },
  });

  if (!timesheet) {
    return { success: false, error: "Timesheet not found" };
  }

  if (timesheet.status !== "SUBMITTED") {
    return { success: false, error: "Timesheet is not submitted" };
  }

  const isDirectRep = await isDirectReport(session.user.id, timesheet.userId);
  if (!isDirectRep && session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.timesheet.update({
    where: { id: timesheetId },
    data: {
      status: "REJECTED",
      approverId: session.user.id,
      approvedAt: new Date(),
      comments,
    },
  });

  revalidatePath("/manager/timesheets");
  return { success: true };
}

export async function requestTimesheetCorrection(timesheetId: string, comments: string) {
  const session = await requireManager();

  const timesheet = await prisma.timesheet.findUnique({
    where: { id: timesheetId },
    select: { userId: true, status: true },
  });

  if (!timesheet) {
    return { success: false, error: "Timesheet not found" };
  }

  if (timesheet.status !== "SUBMITTED") {
    return { success: false, error: "Timesheet is not submitted" };
  }

  const isDirectRep = await isDirectReport(session.user.id, timesheet.userId);
  if (!isDirectRep && session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.timesheet.update({
    where: { id: timesheetId },
    data: {
      status: "NEEDS_CORRECTION",
      comments,
    },
  });

  revalidatePath("/manager/timesheets");
  return { success: true };
}
