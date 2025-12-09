import axiosClient from '@/config/axiosClient';
import type { ApiResponse, PageResponseDto } from '@/types/apiResponse';
import type { 
  User, 
  UserCreationRequest, 
  UserUpdateRequest, 
  ProfileUpdateRequest,
  UserSearchParams,
  UpdateUserPermissionsRequest
} from '@/types/user.types';

const BASE_URL = '/api/v1/users';

/**
 * Get all users (no pagination)
 */
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

/**
 * Get paginated list of users
 */
export const getUsersPaginated = async (params?: UserSearchParams): Promise<ApiResponse<PageResponseDto<User>>> => {
  const response = await axiosClient.get(`${BASE_URL}/paginated`, { 
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sortBy: params?.sortBy ?? 'username',
      sortDirection: params?.sortDir ?? 'asc',
    }
  });
  return response.data;
};

/**
 * Get users by role name with pagination
 */
export const getUsersByRole = async (
  roleName: string,
  params?: { page?: number; size?: number; sortBy?: string; sortDir?: string }
): Promise<ApiResponse<PageResponseDto<User>>> => {
  const response = await axiosClient.get(`${BASE_URL}/role/${roleName}`, {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sortBy: params?.sortBy ?? 'username',
      sortDirection: params?.sortDir ?? 'asc',
    }
  });
  return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  const response = await axiosClient.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Get user by username
 */
export const getUserByUsername = async (username: string): Promise<ApiResponse<User>> => {
  const response = await axiosClient.get(`${BASE_URL}/username/${username}`);
  return response.data;
};

/**
 * Get current logged-in user info
 */
export const getMyInfo = async (): Promise<ApiResponse<User>> => {
  const response = await axiosClient.get(`${BASE_URL}/myInfo`);
  return response.data;
};

/**
 * Update current logged-in user info (self profile update)
 */
export const updateMyInfo = async (data: ProfileUpdateRequest): Promise<ApiResponse<User>> => {
  const response = await axiosClient.put(`${BASE_URL}/myInfo`, data);
  return response.data;
};

/**
 * Create new user (Admin only)
 */
export const createUser = async (data: UserCreationRequest): Promise<ApiResponse<User>> => {
  const response = await axiosClient.post(BASE_URL, data);
  return response.data;
};

/**
 * Create new user with limited roles (Manager/Staff)
 * Manager can create STAFF and CUSTOMER
 * Staff can only create CUSTOMER
 */
export const createUserLimited = async (data: UserCreationRequest): Promise<ApiResponse<User>> => {
  const response = await axiosClient.post(`${BASE_URL}/create-limited`, data);
  return response.data;
};

/**
 * Register new user (Public)
 */
export const registerUser = async (data: UserCreationRequest): Promise<ApiResponse<User>> => {
  const response = await axiosClient.post(`${BASE_URL}/register`, data);
  return response.data;
};

/**
 * Update user
 */
export const updateUser = async (id: string, data: UserUpdateRequest): Promise<ApiResponse<User>> => {
  const response = await axiosClient.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Search users by username
 */
export const searchUsers = async (params: UserSearchParams): Promise<ApiResponse<PageResponseDto<User>>> => {
  const response = await axiosClient.get(`${BASE_URL}/search`, { 
    params: {
      username: params.username,
      page: params.page ?? 0,
      size: params.size ?? 10,
    }
  });
  return response.data;
};

/**
 * Toggle user active status (activate/deactivate)
 */
export const toggleUserStatus = async (id: string, active: boolean): Promise<ApiResponse<User>> => {
  const response = await axiosClient.patch(`${BASE_URL}/${id}/status`, { active });
  return response.data;
};

/**
 * Assign role to user
 */
export const assignRoleToUser = async (userId: string, roleId: string): Promise<ApiResponse<User>> => {
  const response = await axiosClient.post(`${BASE_URL}/${userId}/roles/${roleId}`);
  return response.data;
};

/**
 * Remove role from user
 */
export const removeRoleFromUser = async (userId: string, roleId: string): Promise<ApiResponse<User>> => {
  const response = await axiosClient.delete(`${BASE_URL}/${userId}/roles/${roleId}`);
  return response.data;
};

/**
 * Update user permissions (disable specific permissions)
 */
export const updateUserPermissions = async (userId: string, data: UpdateUserPermissionsRequest): Promise<ApiResponse<User>> => {
  const response = await axiosClient.put(`${BASE_URL}/${userId}/permissions`, data);
  return response.data;
};

/**
 * Get user's effective permissions (considering overrides)
 */
export const getUserPermissions = async (userId: string): Promise<ApiResponse<string[]>> => {
  const response = await axiosClient.get(`${BASE_URL}/${userId}/permissions`);
  return response.data;
};
export const uploadAvatar = async (file: File): Promise<ApiResponse<User>> => {
  const formData = new FormData();
  formData.append('file', file); // Key 'file' phải khớp với @RequestParam bên Java

  // Giả định endpoint là POST /api/v1/users/avatar
  const response = await axiosClient.post(`${BASE_URL}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
export const userApi = {
  getUsers,
  getUsersPaginated,
  getUserById,
  getUserByUsername,
  getMyInfo,
  updateMyInfo,
  createUser,
  registerUser,
  updateUser,
  deleteUser,
  searchUsers,
  toggleUserStatus,
  assignRoleToUser,
  removeRoleFromUser,
  updateUserPermissions,
  getUserPermissions,
  uploadAvatar,
};

export default userApi;
