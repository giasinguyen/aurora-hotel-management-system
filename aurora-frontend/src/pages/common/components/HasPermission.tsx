import type { ReactNode } from 'react';

interface HasPermissionProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

export default function HasPermission({ children, permission, fallback = null }: HasPermissionProps) {
  // TODO: Implement permission check logic
  // This will check if current user has the required permission
  const userPermissions: string[] = ['read', 'write', 'delete']; // Placeholder - get from Redux store

  const hasPermission = userPermissions.includes(permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
