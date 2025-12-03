import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPermission, type Permission } from "@/lib/permissions";

/**
 * Require authentication for a page/route
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/login");
  }
  
  return session;
}

/**
 * Require specific permission for a page/route
 */
export async function requirePermission(permission: Permission) {
  const session = await requireAuth();
  
  if (!hasPermission(session.user.role, permission)) {
    redirect("/dashboard");
  }
  
  return session;
}

/**
 * Require manager role
 */
export async function requireManager() {
  const session = await requireAuth();
  
  if (session.user.role !== "MANAGER" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  
  return session;
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  const session = await requireAuth();
  
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  
  return session;
}
