import { UserRole } from "@prisma/client";

export const PERMISSIONS = {
  // User Management
  USER_VIEW_ALL: ["ADMIN"],
  USER_CREATE: ["ADMIN"],
  USER_UPDATE: ["ADMIN"],
  USER_DELETE: ["ADMIN"],
  USER_VIEW_TEAM: ["ADMIN", "MANAGER"],
  USER_VIEW_DIRECT_REPORTS: ["MANAGER"],
  
  // Team Management
  TEAM_VIEW_ALL: ["ADMIN"],
  TEAM_CREATE: ["ADMIN"],
  TEAM_UPDATE: ["ADMIN"],
  TEAM_DELETE: ["ADMIN"],
  TEAM_VIEW_OWN: ["MANAGER"],
  TEAM_MANAGE_OWN: ["MANAGER"],
  
  // Project Management
  PROJECT_VIEW_ALL: ["ADMIN"],
  PROJECT_CREATE: ["ADMIN", "MANAGER"],
  PROJECT_UPDATE: ["ADMIN", "MANAGER"],
  PROJECT_DELETE: ["ADMIN"],
  PROJECT_VIEW_TEAM: ["MANAGER"],
  PROJECT_ASSIGN_MEMBERS: ["ADMIN", "MANAGER"],
  
  // Performance & Appraisals
  APPRAISAL_VIEW_ALL: ["ADMIN"],
  APPRAISAL_CREATE: ["ADMIN", "MANAGER"],
  APPRAISAL_UPDATE_OWN: ["ADMIN", "MANAGER", "EMPLOYEE"],
  APPRAISAL_REVIEW: ["ADMIN", "MANAGER"],
  APPRAISAL_VIEW_TEAM: ["MANAGER"],
  APPRAISAL_SET_GOALS: ["MANAGER"],
  APPRAISAL_CONDUCT_REVIEW: ["MANAGER"],
  
  // PTO Management
  PTO_REQUEST: ["ADMIN", "MANAGER", "EMPLOYEE"],
  PTO_APPROVE: ["ADMIN", "MANAGER"],
  PTO_VIEW_ALL: ["ADMIN"],
  PTO_VIEW_TEAM: ["MANAGER"],
  PTO_CANCEL_OWN: ["ADMIN", "MANAGER", "EMPLOYEE"],
  
  // Timesheet Management
  TIMESHEET_SUBMIT: ["ADMIN", "MANAGER", "EMPLOYEE"],
  TIMESHEET_APPROVE: ["ADMIN", "MANAGER"],
  TIMESHEET_VIEW_ALL: ["ADMIN"],
  TIMESHEET_VIEW_TEAM: ["MANAGER"],
  TIMESHEET_REQUEST_CORRECTION: ["MANAGER"],
  
  // Performance Metrics
  METRICS_VIEW_ALL: ["ADMIN"],
  METRICS_VIEW_TEAM: ["MANAGER"],
  METRICS_VIEW_OWN: ["ADMIN", "MANAGER", "EMPLOYEE"],
  
  // Resource Planning
  CAPACITY_VIEW_ALL: ["ADMIN"],
  CAPACITY_VIEW_TEAM: ["MANAGER"],
  CAPACITY_PLAN: ["ADMIN", "MANAGER"],
  
  // 1:1 Meetings
  ONE_ON_ONE_SCHEDULE: ["MANAGER"],
  ONE_ON_ONE_VIEW_OWN: ["ADMIN", "MANAGER", "EMPLOYEE"],
  
  // Reports & Analytics
  REPORTS_VIEW_ALL: ["ADMIN"],
  REPORTS_VIEW_TEAM: ["MANAGER"],
  REPORTS_EXPORT: ["ADMIN", "MANAGER"],
  
  // Settings
  SETTINGS_MANAGE: ["ADMIN"],
  SETTINGS_VIEW: ["ADMIN", "MANAGER"],
  
  // Audit Logs
  AUDIT_VIEW: ["ADMIN"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission] as readonly string[];
  return allowedRoles.includes(userRole);
}

/**
 * Check if a user role has any of the specified permissions
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if a user role has all of the specified permissions
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Get all permissions for a user role
 */
export function getRolePermissions(userRole: UserRole): Permission[] {
  return Object.entries(PERMISSIONS)
    .filter(([_, roles]) => (roles as readonly string[]).includes(userRole))
    .map(([permission]) => permission as Permission);
}

/**
 * Check if user is a manager
 */
export function isManager(userRole: UserRole): boolean {
  return userRole === "MANAGER";
}

/**
 * Check if user is an admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === "ADMIN";
}

/**
 * Check if user can manage another user (admin or their manager)
 */
export function canManageUser(userRole: UserRole, userId: string, targetUserId: string, targetUserManagerId?: string | null): boolean {
  if (isAdmin(userRole)) return true;
  if (isManager(userRole) && targetUserManagerId === userId) return true;
  return false;
}
