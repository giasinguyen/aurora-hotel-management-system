import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  RoomTypeResponse,
  RoomTypeCreationRequest,
  RoomTypeUpdateRequest,
} from "@/types/roomType.types.d";
import type { AxiosResponse } from "axios";

// ==================== ROOM TYPE APIs ====================

/**
 * Tạo loại phòng mới
 */
export const createRoomTypeApi = (
  data: RoomTypeCreationRequest
): Promise<AxiosResponse<IApiResponse<RoomTypeResponse>>> => {
  return axiosClient.post("/room-types", data);
};

/**
 * Lấy danh sách tất cả loại phòng
 */
export const getAllRoomTypesApi = (): Promise<
  AxiosResponse<IApiResponse<RoomTypeResponse[]>>
> => {
  return axiosClient.get("/room-types");
};

/**
 * Lấy danh sách loại phòng với phân trang
 */
export const getRoomTypesWithPaginationApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<RoomTypeResponse>>>> => {
  return axiosClient.get("/room-types/paginated", { params });
};

/**
 * Lấy thông tin loại phòng theo ID
 */
export const getRoomTypeByIdApi = (
  roomTypeId: string
): Promise<AxiosResponse<IApiResponse<RoomTypeResponse>>> => {
  return axiosClient.get(`/room-types/${roomTypeId}`);
};

/**
 * Lấy danh sách loại phòng theo chi nhánh
 */
export const getRoomTypesByHotelApi = (
  hotelId: string
): Promise<AxiosResponse<IApiResponse<RoomTypeResponse[]>>> => {
  return axiosClient.get(`/room-types/hotel/${hotelId}`);
};

/**
 * Lấy danh sách loại phòng theo chi nhánh với phân trang
 */
export const getRoomTypesByHotelWithPaginationApi = (
  hotelId: string,
  params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }
): Promise<AxiosResponse<IApiResponse<IPageResponse<RoomTypeResponse>>>> => {
  return axiosClient.get(`/room-types/hotel/${hotelId}/paginated`, { params });
};

/**
 * Cập nhật thông tin loại phòng
 */
export const updateRoomTypeApi = (
  roomTypeId: string,
  data: RoomTypeUpdateRequest
): Promise<AxiosResponse<IApiResponse<RoomTypeResponse>>> => {
  return axiosClient.put(`/room-types/${roomTypeId}`, data);
};

/**
 * Xóa loại phòng
 */
export const deleteRoomTypeApi = (
  roomTypeId: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/room-types/${roomTypeId}`);
};

/**
 * Tìm kiếm loại phòng theo tên
 */
export const searchRoomTypesApi = (params: {
  name: string;
  page?: number;
  size?: number;
}): Promise<AxiosResponse<IApiResponse<IPageResponse<RoomTypeResponse>>>> => {
  return axiosClient.get("/room-types/search", { params });
};
