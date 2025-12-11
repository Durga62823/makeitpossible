"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireLead } from "@/lib/guards";
import { hash, compare } from "bcryptjs";
import { z } from "zod";

const preferencesSchema = z.object({
  compactView: z.boolean().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

const notificationsSchema = z.object({
  taskAssignments: z.boolean().optional(),
  codeReviews: z.boolean().optional(),
  sprintUpdates: z.boolean().optional(),
  blockedTasks: z.boolean().optional(),
  weeklySummary: z.boolean().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ActionResponse<T = unknown> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

export async function updatePreferences(payload: unknown): Promise<ActionResponse> {
  try {
    const session = await requireLead();
    const parsed = preferencesSchema.safeParse(payload);
    
    if (!parsed.success) {
      console.error("Preferences validation failed:", parsed.error);
      return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    // Get current preferences and merge
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true },
    });

    const currentPrefs = (user?.preferences as any) || {};
    const updatedPrefs = { ...currentPrefs, ...parsed.data };

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        preferences: updatedPrefs,
      },
    });

    console.log("Preferences updated successfully for user:", session.user.id);
    revalidatePath("/lead/settings");
    return { success: true, message: "Preferences saved successfully" };
  } catch (error) {
    console.error("Failed to update preferences:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to save preferences" };
  }
}

export async function updateNotifications(payload: unknown): Promise<ActionResponse> {
  try {
    const session = await requireLead();
    const parsed = notificationsSchema.safeParse(payload);
    
    if (!parsed.success) {
      console.error("Notifications validation failed:", parsed.error);
      return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    // Get current notification settings and merge
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notificationSettings: true },
    });

    const currentSettings = (user?.notificationSettings as any) || {};
    const updatedSettings = { ...currentSettings, ...parsed.data };

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        notificationSettings: updatedSettings,
      },
    });

    console.log("Notification settings updated successfully for user:", session.user.id);
    revalidatePath("/lead/settings");
    return { success: true, message: "Notification settings saved" };
  } catch (error) {
    console.error("Failed to update notifications:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to save notification settings" };
  }
}

export async function changePassword(payload: unknown): Promise<ActionResponse> {
  try {
    const session = await requireLead();
    const parsed = passwordSchema.safeParse(payload);
    
    if (!parsed.success) {
      console.error("Password validation failed:", parsed.error);
      return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user || !user.password) {
      console.error("User not found or no password set for user:", session.user.id);
      return { success: false, error: "User not found or no password set" };
    }

    const isValid = await compare(parsed.data.currentPassword, user.password);
    if (!isValid) {
      console.error("Incorrect current password for user:", session.user.id);
      return { success: false, error: "Current password is incorrect" };
    }

    const hashedPassword = await hash(parsed.data.newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    console.log("Password changed successfully for user:", session.user.id);
    revalidatePath("/lead/settings");
    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Failed to change password:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to change password" };
  }
}
