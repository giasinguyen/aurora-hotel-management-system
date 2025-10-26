import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  AmenityResponse,
  AmenityCreationRequest,
  AmenityUpdateRequest,
} from "@/types/amenity.types.d";
import type { AxiosResponse } from "axios";

// ==================== AMENITY APIs ====================

/**
 * Tạo amenity mới
 */
export const createAmenityApi = (
  data: AmenityCreationRequest
): Promise<AxiosResponse<IApiResponse<AmenityResponse>>> => {
  return axiosClient.post("/amenities", data);
};

/**
 * Lấy danh sách tất cả amenities
 */
export const getAllAmenitiesApi = (): Promise<
  AxiosResponse<IApiResponse<AmenityResponse[]>>
> => {
  return axiosClient.get("/amenities");
};

/**
 * Lấy danh sách amenities với phân trang
 */
export const getAmenitiesWithPaginationApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<AmenityResponse>>>> => {
  return axiosClient.get("/amenities/paginated", { params });
};

/**
 * Lấy thông tin amenity theo ID
 */
export const getAmenityByIdApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<AmenityResponse>>> => {
  return axiosClient.get(`/amenities/${id}`);
};

/**
 * Cập nhật thông tin amenity
 */
export const updateAmenityApi = (
  id: string,
  data: AmenityUpdateRequest
): Promise<AxiosResponse<IApiResponse<AmenityResponse>>> => {
  return axiosClient.put(`/amenities/${id}`, data);
};

/**
 * Xóa amenity
 */
export const deleteAmenityApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/amenities/${id}`);
};

/**
 * Lấy danh sách amenities theo category
 */
export const getAmenitiesByCategoryApi = (
  category: string
): Promise<AxiosResponse<IApiResponse<AmenityResponse[]>>> => {
  return axiosClient.get(`/amenities/category/${category}`);
};
