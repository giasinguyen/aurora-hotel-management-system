import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  FacilityResponse,
  FacilityCreationRequest,
  FacilityUpdateRequest,
} from "@/types/facility.types.d";
import type { AxiosResponse } from "axios";

// ==================== FACILITY APIs ====================

/**
 * Tạo facility mới
 */
export const createFacilityApi = (
  data: FacilityCreationRequest
): Promise<AxiosResponse<IApiResponse<FacilityResponse>>> => {
  return axiosClient.post("/facilities", data);
};

/**
 * Lấy danh sách tất cả facilities với phân trang
 */
export const getAllFacilitiesApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<FacilityResponse>>>> => {
  return axiosClient.get("/facilities", { params });
};

/**
 * Lấy thông tin facility theo ID
 */
export const getFacilityByIdApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<FacilityResponse>>> => {
  return axiosClient.get(`/facilities/${id}`);
};

/**
 * Lấy danh sách facilities theo chi nhánh
 */
export const getFacilitiesByHotelApi = (
  hotelId: string,
  params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }
): Promise<AxiosResponse<IApiResponse<IPageResponse<FacilityResponse>>>> => {
  return axiosClient.get(`/facilities/hotel/${hotelId}`, { params });
};

/**
 * Cập nhật thông tin facility
 */
export const updateFacilityApi = (
  id: string,
  data: FacilityUpdateRequest
): Promise<AxiosResponse<IApiResponse<FacilityResponse>>> => {
  return axiosClient.put(`/facilities/${id}`, data);
};

/**
 * Xóa facility
 */
export const deleteFacilityApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/facilities/${id}`);
};

/**
 * Tìm kiếm facilities theo loại
 */
export const getFacilitiesByTypeApi = (
  type: string,
  params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }
): Promise<AxiosResponse<IApiResponse<IPageResponse<FacilityResponse>>>> => {
  return axiosClient.get(`/facilities/type/${type}`, { params });
};
