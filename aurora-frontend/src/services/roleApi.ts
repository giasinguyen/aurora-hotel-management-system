import axiosClient from '@/config/axiosClient';
import type { ApiResponse, PageResponseDto } from '@/types/apiResponse';
import type { 
  Role, 
  RoleCreationRequest, 
  RoleUpdateRequest, 
  RoleSearchParams,
  Permission,
  PermissionCreationRequest,
  PermissionUpdateRequest,
  PermissionSearchParams,
} from '@/types/user.types';

const ROLE_BASE_URL = '/api/v1/roles';
const PERMISSION_BASE_URL = '/api/v1/permissions';

// =====================
// Role APIs
// =====================

/**
 * Get all roles with pagination (Admin only)
 */
export const getRoles = async (params?: RoleSearchParams): Promise<ApiResponse<PageResponseDto<Role>>> => {
  const response = await axiosClient.get(ROLE_BASE_URL, { 
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sortBy: params?.sortBy ?? 'name',
      sortDir: params?.sortDir ?? 'asc',
    }
  });
  return response.data;
};

/**
 * Get allowed roles based on caller's authority (Staff/Manager/Admin)
 * - Staff: only CUSTOMER role
 * - Manager: STAFF and CUSTOMER roles
 * - Admin: all roles
 */
export const getAllowedRoles = async (params?: RoleSearchParams): Promise<ApiResponse<PageResponseDto<Role>>> => {
  const response = await axiosClient.get(`${ROLE_BASE_URL}/allowed`, { 
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 100,
      sortBy: params?.sortBy ?? 'name',
      sortDir: params?.sortDir ?? 'asc',
    }
  });
  return response.data;
};

/**
 * Get role by ID
 */
export const getRoleById = async (id: string): Promise<ApiResponse<Role>> => {
  const response = await axiosClient.get(`${ROLE_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create new role (Admin only)
 */
export const createRole = async (data: RoleCreationRequest): Promise<ApiResponse<Role>> => {
  const response = await axiosClient.post(ROLE_BASE_URL, data);
  return response.data;
};

/**
 * Update role (Admin only)
 */
export const updateRole = async (id: string, data: RoleUpdateRequest): Promise<ApiResponse<Role>> => {
  const response = await axiosClient.put(`${ROLE_BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Delete role (Admin only)
 */
export const deleteRole = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete(`${ROLE_BASE_URL}/${id}`);
  return response.data;
};

// =====================
// Permission APIs
// =====================

/**
 * Get all permissions with pagination
 */
export const getPermissions = async (params?: PermissionSearchParams): Promise<ApiResponse<PageResponseDto<Permission>>> => {
  const response = await axiosClient.get(PERMISSION_BASE_URL, { 
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    }
  });
  return response.data;
};

/**
 * Get permission by ID
 */
export const getPermissionById = async (id: string): Promise<ApiResponse<Permission>> => {
  const response = await axiosClient.get(`${PERMISSION_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create new permission (Admin only)
 */
export const createPermission = async (data: PermissionCreationRequest): Promise<ApiResponse<Permission>> => {
  const response = await axiosClient.post(PERMISSION_BASE_URL, data);
  return response.data;
};

/**
 * Update permission (Admin only)
 */
export const updatePermission = async (id: string, data: PermissionUpdateRequest): Promise<ApiResponse<Permission>> => {
  const response = await axiosClient.put(`${PERMISSION_BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Delete permission (Admin only)
 */
export const deletePermission = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete(`${PERMISSION_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Search permissions
 */
export const searchPermissions = async (params: PermissionSearchParams): Promise<ApiResponse<PageResponseDto<Permission>>> => {
  const response = await axiosClient.get(`${PERMISSION_BASE_URL}/search`, { params });
  return response.data;
};

export default {
  // Role
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  // Permission
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  searchPermissions,
};
