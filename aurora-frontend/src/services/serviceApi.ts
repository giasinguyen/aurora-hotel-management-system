import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  ServiceResponse,
  ServiceCreationRequest,
  ServiceUpdateRequest,
  ServiceSearchParams,
} from "@/types/service.types.d";
import type { AxiosResponse } from "axios";

// ==================== SERVICE APIs ====================

/**
 * Tạo service mới
 */
export const createServiceApi = (
  data: ServiceCreationRequest
): Promise<AxiosResponse<IApiResponse<ServiceResponse>>> => {
  return axiosClient.post("/services", data);
};

/**
 * Cập nhật thông tin service
 */
export const updateServiceApi = (
  id: string,
  data: ServiceUpdateRequest
): Promise<AxiosResponse<IApiResponse<ServiceResponse>>> => {
  return axiosClient.put(`/services/${id}`, data);
};

/**
 * Xóa service
 */
export const deleteServiceApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/services/${id}`);
};

/**
 * Lấy thông tin service theo ID
 */
export const getServiceByIdApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<ServiceResponse>>> => {
  return axiosClient.get(`/services/${id}`);
};

/**
 * Lấy danh sách tất cả service với phân trang
 */
export const getAllServicesApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<ServiceResponse>>>> => {
  return axiosClient.get("/services", { params });
};

/**
 * Tìm kiếm service với nhiều điều kiện
 */
export const searchServicesApi = (
  params: ServiceSearchParams
): Promise<AxiosResponse<IApiResponse<IPageResponse<ServiceResponse>>>> => {
  return axiosClient.get("/services/search", { params });
};
