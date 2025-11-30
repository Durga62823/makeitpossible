"use server";

import { addHours } from "date-fns";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { signIn } from "@/lib/auth";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import { sanitizeInput } from "@/lib/utils";
import { generateToken, hashPassword } from "@/lib/auth-utils";

export type ActionResponse<T = unknown> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

export async function registerUser(payload: unknown): Promise<ActionResponse> {
  const parsed = signUpSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const { firstName, lastName, email, password } = parsed.data;
  const sanitizedEmail = sanitizeInput(email).toLowerCase();

  const rateLimit = await checkRateLimit(`register:${sanitizedEmail}`);
  if (!rateLimit.success) {
    return { success: false, error: "Too many attempts. Please wait a minute." };
  }

  const existing = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
  if (existing) {
    return { success: false, error: "Email already exists" };
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: sanitizedEmail,
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      name: `${sanitizeInput(firstName)} ${sanitizeInput(lastName)}`.trim(),
      password: hashedPassword,
    },
  });

  const token = generateToken();
  await prisma.verificationToken.create({
    data: {
      identifier: sanitizedEmail,
      token,
      expires: addHours(new Date(), 24),
    },
  });

  await sendVerificationEmail({ email: sanitizedEmail, token, firstName: user.firstName });

  return { success: true, message: "Account created. Check your inbox to verify." };
}

export async function loginUser(payload: unknown): Promise<ActionResponse> {
  const parsed = signInSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      rememberMe: parsed.data.rememberMe,
      redirect: false,
    });

    return { success: true, message: "Welcome back" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid credentials" };
        case "AccessDenied":
          return { success: false, error: "Confirm your email before logging in" };
        default:
          logger.error(error, "Auth error");
          return { success: false, error: "Unable to log in" };
      }
    }

    logger.error(error, "Unexpected login error");
    return { success: false, error: "Unexpected error" };
  }
}

export async function resendVerificationEmail(email: string): Promise<ActionResponse> {
  const sanitizedEmail = sanitizeInput(email).toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });

  if (!user) {
    return { success: false, error: "Account not found" };
  }

  if (user.emailVerified) {
    return { success: false, error: "Email already verified" };
  }

  await prisma.verificationToken.deleteMany({ where: { identifier: sanitizedEmail } });
  const token = generateToken();
  await prisma.verificationToken.create({
    data: {
      identifier: sanitizedEmail,
      token,
      expires: addHours(new Date(), 24),
    },
  });

  await sendVerificationEmail({ email: sanitizedEmail, token, firstName: user.firstName });
  return { success: true, message: "Verification email sent" };
}

export async function verifyEmail(token: string): Promise<ActionResponse> {
  if (!token) {
    return { success: false, error: "Missing token" };
  }

  const storedToken = await prisma.verificationToken.findUnique({ where: { token } });
  if (!storedToken) {
    return { success: false, error: "Invalid or expired token" };
  }

  if (storedToken.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return { success: false, error: "Token expired" };
  }

  const user = await prisma.user.update({
    where: { email: storedToken.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.deleteMany({ where: { identifier: storedToken.identifier } });
  await sendWelcomeEmail(user.email, user.firstName);
  revalidatePath("/auth/login");
  return { success: true, message: "Email verified" };
}
