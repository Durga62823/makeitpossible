import { UserRole } from "@prisma/client";

export const PERMISSIONS = {
  // User Management
  USER_VIEW_ALL: ["ADMIN"],
  USER_CREATE: ["ADMIN"],
  USER_UPDATE: ["ADMIN"],
  USER_DELETE: ["ADMIN"],
  USER_VIEW_TEAM: ["ADMIN", "MANAGER", "LEAD"],
  USER_VIEW_DIRECT_REPORTS: ["MANAGER"],
  
  // Team Management
  TEAM_VIEW_ALL: ["ADMIN"],
  TEAM_CREATE: ["ADMIN"],
  TEAM_UPDATE: ["ADMIN"],
  TEAM_DELETE: ["ADMIN"],
  TEAM_VIEW_OWN: ["MANAGER", "LEAD"],
  TEAM_MANAGE_OWN: ["MANAGER"],
  
  // Project Management
  PROJECT_VIEW_ALL: ["ADMIN"],
  PROJECT_CREATE: ["ADMIN", "MANAGER"],
  PROJECT_UPDATE: ["ADMIN", "MANAGER", "LEAD"],
  PROJECT_DELETE: ["ADMIN"],
  PROJECT_VIEW_TEAM: ["MANAGER", "LEAD"],
  PROJECT_ASSIGN_MEMBERS: ["ADMIN", "MANAGER"],
  
  // Task Management (Lead-focused)
  TASK_VIEW_ALL: ["ADMIN"],
  TASK_VIEW_TEAM: ["ADMIN", "MANAGER", "LEAD"],
  TASK_CREATE: ["ADMIN", "MANAGER", "LEAD"],
  TASK_UPDATE: ["ADMIN", "MANAGER", "LEAD"],
  TASK_DELETE: ["ADMIN", "MANAGER", "LEAD"],
  TASK_ASSIGN: ["ADMIN", "MANAGER", "LEAD"],
  TASK_MOVE: ["ADMIN", "MANAGER", "LEAD"],
  TASK_SET_PRIORITY: ["ADMIN", "MANAGER", "LEAD"],
  
  // Sprint Management
  SPRINT_CREATE: ["ADMIN", "MANAGER", "LEAD"],
  SPRINT_UPDATE: ["ADMIN", "MANAGER", "LEAD"],
  SPRINT_VIEW_TEAM: ["ADMIN", "MANAGER", "LEAD"],
  SPRINT_PLAN: ["ADMIN", "MANAGER", "LEAD"],
  SPRINT_CLOSE: ["ADMIN", "MANAGER", "LEAD"],
  
  // Code Review
  CODE_REVIEW_VIEW_TEAM: ["ADMIN", "MANAGER", "LEAD"],
  CODE_REVIEW_APPROVE: ["ADMIN", "LEAD"],
  CODE_REVIEW_REQUEST_CHANGES: ["ADMIN", "LEAD"],
  
  // Technical Metrics
  TECHNICAL_METRICS_VIEW_TEAM: ["ADMIN", "MANAGER", "LEAD"],
  TECHNICAL_METRICS_RECORD: ["ADMIN", "LEAD"],
  
  // Performance & Appraisals (Manager only - Lead cannot conduct formal appraisals)
  APPRAISAL_VIEW_ALL: ["ADMIN"],
  APPRAISAL_CREATE: ["ADMIN", "MANAGER"],
  APPRAISAL_UPDATE_OWN: ["ADMIN", "MANAGER", "LEAD", "EMPLOYEE"],
  APPRAISAL_REVIEW: ["ADMIN", "MANAGER"],
  APPRAISAL_VIEW_TEAM: ["MANAGER"],
  APPRAISAL_SET_GOALS: ["MANAGER"],
  APPRAISAL_CONDUCT_REVIEW: ["MANAGER"],
  
  // PTO Management (Manager only - Lead cannot approve PTO)
  PTO_REQUEST: ["ADMIN", "MANAGER", "LEAD", "EMPLOYEE"],
  PTO_APPROVE: ["ADMIN", "MANAGER"],
  PTO_VIEW_ALL: ["ADMIN"],
  PTO_VIEW_TEAM: ["MANAGER"],
  PTO_CANCEL_OWN: ["ADMIN", "MANAGER", "LEAD", "EMPLOYEE"],
  
  // Timesheet Management (Manager only - Lead cannot approve timesheets)
  TIMESHEET_SUBMIT: ["ADMIN", "MANAGER", "LEAD", "EMPLOYEE"],
  TIMESHEET_APPROVE: ["ADMIN", "MANAGER"],
  TIMESHEET_VIEW_ALL: ["ADMIN"],
  TIMESHEET_VIEW_TEAM: ["MANAGER"],
  TIMESHEET_REQUEST_CORRECTION: ["MANAGER"],
  
  // Performance Metrics
  METRICS_VIEW_ALL: ["ADMIN"],
  METRICS_VIEW_TEAM: ["MANAGER", "LEAD"],
  METRICS_VIEW_OWN: ["ADMIN", "MANAGER", "LEAD", "EMPLOYEE"],
  
  // Resource Planning (Lead has task-level workload visibility only)
  CAPACITY_VIEW_ALL: ["ADMIN"],
  CAPACITY_VIEW_TEAM: ["MANAGER"],
  CAPACITY_VIEW_TEAM_WORKLOAD: ["MANAGER", "LEAD"],
  CAPACITY_PLAN: ["ADMIN", "MANAGER"],
  
  // 1:1 Meetings (Manager only)
  ONE_ON_ONE_SCHEDULE: ["MANAGER"],
  ONE_ON_ONE_VIEW_OWN: ["ADMIN", "MANAGER", "LEAD", "EMPLOYEE"],
  
  // Reports & Analytics
  REPORTS_VIEW_ALL: ["ADMIN"],
  REPORTS_VIEW_TEAM: ["MANAGER", "LEAD"],
  REPORTS_EXPORT: ["ADMIN", "MANAGER"],
  REPORTS_TECHNICAL: ["ADMIN", "LEAD"],
  
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
 * Check if user is a lead
 */
export function isLead(userRole: UserRole): boolean {
  return userRole === "LEAD";
}

/**
 * Check if user is an admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === "ADMIN";
}

/**
 * Check if user is a manager or lead (has team responsibility)
 */
export function hasTeamResponsibility(userRole: UserRole): boolean {
  return userRole === "MANAGER" || userRole === "LEAD";
}

/**
 * Check if user can manage another user (admin or their manager)
 */
export function canManageUser(userRole: UserRole, userId: string, targetUserId: string, targetUserManagerId?: string | null): boolean {
  if (isAdmin(userRole)) return true;
  if (isManager(userRole) && targetUserManagerId === userId) return true;
  return false;
}
