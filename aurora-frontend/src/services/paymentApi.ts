import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  PaymentResponse,
  PaymentCreationRequest,
  PaymentUpdateRequest,
  PaymentSearchParams,
} from "@/types/payment.types.d";
import type { AxiosResponse } from "axios";

// ==================== PAYMENT APIs ====================

/**
 * Tạo payment mới
 */
export const createPaymentApi = (
  data: PaymentCreationRequest
): Promise<AxiosResponse<IApiResponse<PaymentResponse>>> => {
  return axiosClient.post("/payments", data);
};

/**
 * Cập nhật thông tin payment
 */
export const updatePaymentApi = (
  id: string,
  data: PaymentUpdateRequest
): Promise<AxiosResponse<IApiResponse<PaymentResponse>>> => {
  return axiosClient.put(`/payments/${id}`, data);
};

/**
 * Xóa payment
 */
export const deletePaymentApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/payments/${id}`);
};

/**
 * Lấy thông tin payment theo ID
 */
export const getPaymentByIdApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<PaymentResponse>>> => {
  return axiosClient.get(`/payments/${id}`);
};

/**
 * Lấy danh sách tất cả payment với phân trang
 */
export const getAllPaymentsApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<PaymentResponse>>>> => {
  return axiosClient.get("/payments", { params });
};

/**
 * Tìm kiếm payment với nhiều điều kiện
 */
export const searchPaymentsApi = (
  params: PaymentSearchParams
): Promise<AxiosResponse<IApiResponse<IPageResponse<PaymentResponse>>>> => {
  return axiosClient.get("/payments/search", { params });
};
