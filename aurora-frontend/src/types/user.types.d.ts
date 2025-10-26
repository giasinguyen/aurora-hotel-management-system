// ==================== USER TYPES ====================

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  avatar?: string;
  dateOfBirth?: string;
  roles?: RoleResponse[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface RoleResponse {
  id: string;
  name: string;
  description?: string;
  permissions?: PermissionResponse[];
}

export interface PermissionResponse {
  id: string;
  name: string;
  description?: string;
}

export interface UserRegistrationRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface UserCreationRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  roleIds?: string[];
}

export interface UserUpdateRequest {
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  roleIds?: string[];
}

export interface UserSearchParams {
  username?: string;
  page?: number;
  size?: number;
}

export interface UserPaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}
