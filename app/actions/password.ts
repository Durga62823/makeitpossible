"use server";

import { addHours } from "date-fns";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { ActionResponse } from "@/app/actions/auth";
import { sanitizeInput } from "@/lib/utils";
import { generateToken, hashPassword } from "@/lib/auth-utils";

export async function sendPasswordResetEmailAction(payload: unknown): Promise<ActionResponse> {
  const parsed = forgotPasswordSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const email = sanitizeInput(parsed.data.email).toLowerCase();
  const rateLimit = await checkRateLimit(`reset:${email}`);
  if (!rateLimit.success) {
    return { success: false, error: "Please wait before trying again" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: "Account not found" };
  }

  const token = generateToken();
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires: addHours(new Date(), 1),
    },
  });

  await sendPasswordResetEmail({ email, token, firstName: user.firstName });
  return { success: true, message: "Password reset instructions sent" };
}

export async function resetPassword(token: string, payload: unknown): Promise<ActionResponse> {
  const parsed = resetPasswordSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.used) {
    return { success: false, error: "Invalid or used token" };
  }

  if (record.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    return { success: false, error: "Token expired" };
  }

  const hashedPassword = await hashPassword(parsed.data.password);
  await prisma.user.update({
    where: { email: record.email },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });

  revalidatePath("/auth/login");
  return { success: true, message: "Password updated" };
}
