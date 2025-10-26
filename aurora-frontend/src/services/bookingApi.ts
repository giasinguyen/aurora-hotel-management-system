import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  BookingResponse,
  BookingCreationRequest,
  BookingUpdateRequest,
  BookingSearchParams,
} from "@/types/booking.types.d";
import type { AxiosResponse } from "axios";

// ==================== BOOKING APIs ====================

/**
 * Tạo booking mới
 */
export const createBookingApi = (
  data: BookingCreationRequest
): Promise<AxiosResponse<IApiResponse<BookingResponse>>> => {
  return axiosClient.post("/bookings", data);
};

/**
 * Cập nhật thông tin booking
 */
export const updateBookingApi = (
  id: string,
  data: BookingUpdateRequest
): Promise<AxiosResponse<IApiResponse<BookingResponse>>> => {
  return axiosClient.put(`/bookings/${id}`, data);
};

/**
 * Xóa booking
 */
export const deleteBookingApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/bookings/${id}`);
};

/**
 * Lấy thông tin booking theo ID
 */
export const getBookingByIdApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<BookingResponse>>> => {
  return axiosClient.get(`/bookings/${id}`);
};

/**
 * Lấy danh sách tất cả booking với phân trang
 */
export const getAllBookingsApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<BookingResponse>>>> => {
  return axiosClient.get("/bookings", { params });
};

/**
 * Tìm kiếm booking với nhiều điều kiện
 */
export const searchBookingsApi = (
  params: BookingSearchParams
): Promise<AxiosResponse<IApiResponse<IPageResponse<BookingResponse>>>> => {
  return axiosClient.get("/bookings/search", { params });
};
