import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  RoleResponse,
  PermissionResponse,
  RoleCreationRequest,
  RoleUpdateRequest,
} from "@/types/role.types.d";
import type { AxiosResponse } from "axios";

// ==================== ROLE APIs ====================

/**
 * Tạo role mới
 */
export const createRoleApi = (
  data: RoleCreationRequest
): Promise<AxiosResponse<IApiResponse<RoleResponse>>> => {
  return axiosClient.post("/roles", data);
};

/**
 * Lấy danh sách tất cả roles
 */
export const getAllRolesApi = (): Promise<
  AxiosResponse<IApiResponse<RoleResponse[]>>
> => {
  return axiosClient.get("/roles");
};

/**
 * Lấy danh sách roles với phân trang
 */
export const getRolesWithPaginationApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<RoleResponse>>>> => {
  return axiosClient.get("/roles/paginated", { params });
};

/**
 * Lấy thông tin role theo ID
 */
export const getRoleByIdApi = (
  roleId: string
): Promise<AxiosResponse<IApiResponse<RoleResponse>>> => {
  return axiosClient.get(`/roles/${roleId}`);
};

/**
 * Cập nhật thông tin role
 */
export const updateRoleApi = (
  roleId: string,
  data: RoleUpdateRequest
): Promise<AxiosResponse<IApiResponse<RoleResponse>>> => {
  return axiosClient.put(`/roles/${roleId}`, data);
};

/**
 * Xóa role
 */
export const deleteRoleApi = (
  roleId: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/roles/${roleId}`);
};

// ==================== PERMISSION APIs ====================

/**
 * Lấy danh sách tất cả permissions
 */
export const getAllPermissionsApi = (): Promise<
  AxiosResponse<IApiResponse<PermissionResponse[]>>
> => {
  return axiosClient.get("/permissions");
};

/**
 * Lấy danh sách permissions với phân trang
 */
export const getPermissionsWithPaginationApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<PermissionResponse>>>> => {
  return axiosClient.get("/permissions/paginated", { params });
};

/**
 * Lấy thông tin permission theo ID
 */
export const getPermissionByIdApi = (
  permissionId: string
): Promise<AxiosResponse<IApiResponse<PermissionResponse>>> => {
  return axiosClient.get(`/permissions/${permissionId}`);
};
