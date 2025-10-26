import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  PromotionResponse,
  PromotionCreationRequest,
  PromotionUpdateRequest,
  PromotionSearchParams,
} from "@/types/promotion.types.d";
import type { AxiosResponse } from "axios";

// ==================== PROMOTION APIs ====================

/**
 * Tạo promotion mới
 */
export const createPromotionApi = (
  data: PromotionCreationRequest
): Promise<AxiosResponse<IApiResponse<PromotionResponse>>> => {
  return axiosClient.post("/promotions", data);
};

/**
 * Lấy danh sách tất cả promotion với phân trang
 */
export const getAllPromotionsApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<PromotionResponse>>>> => {
  return axiosClient.get("/promotions", { params });
};

/**
 * Lấy danh sách promotion đang hoạt động
 */
export const getActivePromotionsApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<PromotionResponse>>>> => {
  return axiosClient.get("/promotions/active", { params });
};

/**
 * Tìm kiếm promotion với nhiều điều kiện
 */
export const searchPromotionsApi = (
  params: PromotionSearchParams
): Promise<AxiosResponse<IApiResponse<IPageResponse<PromotionResponse>>>> => {
  return axiosClient.get("/promotions/search", { params });
};

/**
 * Lấy thông tin promotion theo ID
 */
export const getPromotionByIdApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<PromotionResponse>>> => {
  return axiosClient.get(`/promotions/${id}`);
};

/**
 * Lấy thông tin promotion theo code
 */
export const getPromotionByCodeApi = (
  code: string
): Promise<AxiosResponse<IApiResponse<PromotionResponse>>> => {
  return axiosClient.get(`/promotions/code/${code}`);
};

/**
 * Cập nhật thông tin promotion
 */
export const updatePromotionApi = (
  id: string,
  data: PromotionUpdateRequest
): Promise<AxiosResponse<IApiResponse<PromotionResponse>>> => {
  return axiosClient.put(`/promotions/${id}`, data);
};

/**
 * Xóa promotion
 */
export const deletePromotionApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/promotions/${id}`);
};
