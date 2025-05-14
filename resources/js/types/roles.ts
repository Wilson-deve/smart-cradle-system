// Define user roles
export enum Role {
  ADMIN = 'admin',
  PARENT = 'parent',
  BABYSITTER = 'babysitter',
}

// Define the role data structure
export interface RoleData {
  id: number;
  name: string;
  permissions?: PermissionData[];
  users?: User[];
}

// Define permission data structure
export interface PermissionData {
  id: number;
  name: string;
  description: string;
}

// Extend the User interface to include role information
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  role: Role;
  status: 'active' | 'inactive';
  permissions?: string[];
  devices?: Device[];
}

// Define device interface
export interface Device {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

// Define permission types
export enum Permission {
  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_DEVICES = 'manage_devices',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_ALL_DATA = 'view_all_data',
  VIEW_SYSTEM_LOGS = 'view_system_logs',

  // Parent permissions
  VIEW_CRADLE_DATA = 'view_cradle_data',
  ACCESS_CAMERA = 'access_camera',
  CONTROL_CRADLE = 'control_cradle',
  VIEW_HEALTH_ANALYTICS = 'view_health_analytics',
  MANAGE_BABYSITTERS = 'manage_babysitters',

  // Babysitter permissions
  VIEW_BABY_STATUS = 'view_baby_status',
  ACCESS_MONITORING = 'access_monitoring',
  RECEIVE_ALERTS = 'receive_alerts',
  CONTROL_CRADLE_LIMITED = 'control_cradle_limited',
}

// Define role-permission mapping
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.MANAGE_DEVICES,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_ALL_DATA,
    Permission.VIEW_SYSTEM_LOGS,
  ],
  [Role.PARENT]: [
    Permission.VIEW_CRADLE_DATA,
    Permission.ACCESS_CAMERA,
    Permission.CONTROL_CRADLE,
    Permission.VIEW_HEALTH_ANALYTICS,
    Permission.MANAGE_BABYSITTERS,
  ],
  [Role.BABYSITTER]: [
    Permission.VIEW_BABY_STATUS,
    Permission.ACCESS_MONITORING,
    Permission.RECEIVE_ALERTS,
    Permission.CONTROL_CRADLE_LIMITED,
  ],
};

// Helper function to check if a user has a specific permission
export function hasPermission(user: User, permission: Permission): boolean {
  if (!user.permissions) return false;
  return user.permissions.includes(permission);
}

// Helper function to check if a user has any of the specified permissions
export function hasAnyPermission(
  user: User,
  permissions: Permission[],
): boolean {
  if (!user.permissions) return false;
  return permissions.some((permission) =>
    user.permissions?.includes(permission),
  );
}

// Helper function to check if a user has all of the specified permissions
export function hasAllPermissions(
  user: User,
  permissions: Permission[],
): boolean {
  if (!user.permissions) return false;
  return permissions.every((permission) =>
    user.permissions?.includes(permission),
  );
}
