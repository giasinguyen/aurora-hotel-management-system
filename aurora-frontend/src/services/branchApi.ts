import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  BranchResponse,
  BranchCreationRequest,
  BranchUpdateRequest,
} from "@/types/branch.types.d";
import type { AxiosResponse } from "axios";

// ==================== BRANCH APIs ====================

/**
 * Tạo chi nhánh mới
 */
export const createBranchApi = (
  data: BranchCreationRequest
): Promise<AxiosResponse<IApiResponse<BranchResponse>>> => {
  return axiosClient.post("/branches", data);
};

/**
 * Lấy danh sách tất cả chi nhánh với phân trang
 */
export const getAllBranchesApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
}): Promise<AxiosResponse<IApiResponse<IPageResponse<BranchResponse>>>> => {
  return axiosClient.get("/branches", { params });
};

/**
 * Lấy thông tin chi nhánh theo ID
 */
export const getBranchByIdApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<BranchResponse>>> => {
  return axiosClient.get(`/branches/${id}`);
};

/**
 * Lấy thông tin chi nhánh theo code
 */
export const getBranchByCodeApi = (
  code: string
): Promise<AxiosResponse<IApiResponse<BranchResponse>>> => {
  return axiosClient.get(`/branches/code/${code}`);
};

/**
 * Cập nhật thông tin chi nhánh
 */
export const updateBranchApi = (
  id: string,
  data: BranchUpdateRequest
): Promise<AxiosResponse<IApiResponse<BranchResponse>>> => {
  return axiosClient.put(`/branches/${id}`, data);
};

/**
 * Xóa chi nhánh
 */
export const deleteBranchApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/branches/${id}`);
};

/**
 * Tìm kiếm chi nhánh theo từ khóa
 */
export const searchBranchesApi = (params: {
  keyword: string;
  page?: number;
  size?: number;
}): Promise<AxiosResponse<IApiResponse<IPageResponse<BranchResponse>>>> => {
  return axiosClient.get("/branches/search", { params });
};

/**
 * Lấy danh sách chi nhánh theo thành phố
 */
export const getBranchesByCityApi = (
  city: string,
  params: {
    page?: number;
    size?: number;
  }
): Promise<AxiosResponse<IApiResponse<IPageResponse<BranchResponse>>>> => {
  return axiosClient.get(`/branches/city/${city}`, { params });
};

/**
 * Lấy danh sách chi nhánh theo trạng thái
 */
export const getBranchesByStatusApi = (
  status: string,
  params: {
    page?: number;
    size?: number;
  }
): Promise<AxiosResponse<IApiResponse<IPageResponse<BranchResponse>>>> => {
  return axiosClient.get(`/branches/status/${status}`, { params });
};

/**
 * Gán quản lý cho chi nhánh
 */
export const assignManagerApi = (
  branchId: string,
  managerId: string
): Promise<AxiosResponse<IApiResponse<BranchResponse>>> => {
  return axiosClient.put(`/branches/${branchId}/manager`, { managerId });
};

/**
 * Gỡ bỏ quản lý khỏi chi nhánh
 */
export const removeManagerApi = (
  branchId: string
): Promise<AxiosResponse<IApiResponse<BranchResponse>>> => {
  return axiosClient.delete(`/branches/${branchId}/manager`);
};

/**
 * Lấy thống kê chi nhánh
 */
export const getBranchStatisticsApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<BranchResponse>>> => {
  return axiosClient.get(`/branches/${id}/statistics`);
};
