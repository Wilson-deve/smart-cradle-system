// Define role enum
export enum Role {
  ADMIN = 'admin',
  PARENT = 'parent',
  BABYSITTER = 'babysitter',
}

// Define role interface
export interface IRole {
  id: number;
  name: string;
  slug: string;
  description?: string;
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
  name: PermissionType;
  description: string;
}

// Extend the User interface to include role information
export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  roles: IRole[];
  permissions?: PermissionData[];
  created_at?: string;
  updated_at?: string;
}

// Define device interface
export interface Device {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

// Define role types
export enum RoleType {
  ADMIN = 'admin',
  PARENT = 'parent',
  BABYSITTER = 'babysitter',
}

// Define permission types
export enum PermissionType {
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
export const rolePermissions: Record<Role, PermissionType[]> = {
  [Role.ADMIN]: [
    PermissionType.MANAGE_USERS,
    PermissionType.MANAGE_DEVICES,
    PermissionType.MANAGE_SETTINGS,
    PermissionType.VIEW_ALL_DATA,
    PermissionType.VIEW_SYSTEM_LOGS,
  ],
  [Role.PARENT]: [
    PermissionType.VIEW_CRADLE_DATA,
    PermissionType.ACCESS_CAMERA,
    PermissionType.CONTROL_CRADLE,
    PermissionType.VIEW_HEALTH_ANALYTICS,
    PermissionType.MANAGE_BABYSITTERS,
  ],
  [Role.BABYSITTER]: [
    PermissionType.VIEW_BABY_STATUS,
    PermissionType.ACCESS_MONITORING,
    PermissionType.RECEIVE_ALERTS,
    PermissionType.CONTROL_CRADLE_LIMITED,
  ],
};

// Helper function to check if a user has a specific permission
export function hasPermission(user: User, permission: PermissionType): boolean {
  if (!user.permissions) return false;
  return user.permissions.some(p => p.name === permission);
}

// Helper function to check if a user has any of the specified permissions
export function hasAnyPermission(
  user: User,
  permissions: PermissionType[],
): boolean {
  if (!user.permissions) return false;
  return permissions.some((permission) =>
    user.permissions?.some(p => p.name === permission),
  );
}

// Helper function to check if a user has all of the specified permissions
export function hasAllPermissions(
  user: User,
  permissions: PermissionType[],
): boolean {
  if (!user.permissions) return false;
  return permissions.every((permission) =>
    user.permissions?.some(p => p.name === permission),
  );
}
