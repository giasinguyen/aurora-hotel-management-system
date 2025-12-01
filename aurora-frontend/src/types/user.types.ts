// User & Role Types for Aurora Hotel Management System

// =====================
// User Types
// =====================

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dob?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  roles: Role[];
  active: boolean;
  emailVerified?: boolean;
  assignedBranchId?: string;
  assignedBranchName?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCreationRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dob?: string;
  email?: string;
  phone?: string;
  roles?: string[];
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  dob?: string;
  email?: string;
  phone?: string;
  address?: string;
  roles?: string[];
  active?: boolean;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  dob?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// User Permission Override - để tắt/bật quyền cho từng user
export interface UserPermissionOverride {
  userId: string;
  permissionId: string;
  permissionName: string;
  enabled: boolean;
}

export interface UpdateUserPermissionsRequest {
  disabledPermissions: string[]; // List of permission IDs to disable
}

export interface UserSearchParams {
  username?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// =====================
// Role Types
// =====================

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface RoleCreationRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface RoleUpdateRequest {
  description?: string;
  permissionIds?: string[];
}

export interface RoleSearchParams {
  name?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Permission Types
export interface PermissionCreationRequest {
  name: string;
  description?: string;
}

export interface PermissionUpdateRequest {
  name?: string;
  description?: string;
}

export interface PermissionSearchParams {
  name?: string;
  description?: string;
  page?: number;
  size?: number;
}

// Role name constants
export const ROLE_NAMES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;

export type RoleName = keyof typeof ROLE_NAMES;

// Role display configurations
export const ROLE_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  ADMIN: { label: 'Quản trị viên', color: 'text-red-700', bgColor: 'bg-red-100' },
  MANAGER: { label: 'Quản lý', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  STAFF: { label: 'Nhân viên', color: 'text-green-700', bgColor: 'bg-green-100' },
  CUSTOMER: { label: 'Khách hàng', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};
