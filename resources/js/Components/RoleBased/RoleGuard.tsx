import React, { ReactNode } from 'react';
import {
  Permission,
  User,
  UserRole,
  hasAllPermissions,
  hasAnyPermission,
} from '../../types/roles';

interface RoleGuardProps {
  user: User;
  roles?: UserRole[];
  permissions?: Permission[];
  requireAllPermissions?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * RoleGuard component for conditional rendering based on user roles and permissions
 *
 * @example
 * // Render only for admin users
 * <RoleGuard user={user} roles={[UserRole.ADMIN]}>
 *   <AdminPanel />
 * </RoleGuard>
 *
 * @example
 * // Render for users with specific permission
 * <RoleGuard user={user} permissions={[Permission.CONTROL_CRADLE]}>
 *   <CradleControls />
 * </RoleGuard>
 *
 * @example
 * // Render for users with any of the specified permissions
 * <RoleGuard user={user} permissions={[Permission.VIEW_CRADLE_DATA, Permission.ACCESS_CAMERA]}>
 *   <MonitoringPanel />
 * </RoleGuard>
 *
 * @example
 * // Render for users with all of the specified permissions
 * <RoleGuard user={user} permissions={[Permission.CONTROL_CRADLE, Permission.VIEW_CRADLE_DATA]} requireAllPermissions>
 *   <AdvancedControls />
 * </RoleGuard>
 *
 * @example
 * // With fallback content
 * <RoleGuard user={user} roles={[UserRole.ADMIN]} fallback={<AccessDenied />}>
 *   <AdminPanel />
 * </RoleGuard>
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  user,
  roles = [],
  permissions = [],
  requireAllPermissions = false,
  fallback = null,
  children,
}) => {
  // Check if user has any of the required roles
  const hasRequiredRole = roles.length === 0 || roles.includes(user.role);

  // Check permissions based on the requireAllPermissions flag
  const hasRequiredPermissions =
    permissions.length === 0 ||
    (requireAllPermissions
      ? hasAllPermissions(user, permissions)
      : hasAnyPermission(user, permissions));

  // Render children if all conditions are met, otherwise render fallback
  if (hasRequiredRole && hasRequiredPermissions) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default RoleGuard;
