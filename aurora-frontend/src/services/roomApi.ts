import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  RoomResponse,
  RoomCreationRequest,
  RoomUpdateRequest,
  RoomSearchParams,
} from "@/types/room.types.d";
import type { AxiosResponse } from "axios";

// ==================== ROOM APIs ====================

/**
 * Tạo phòng mới
 */
export const createRoomApi = (
  data: RoomCreationRequest
): Promise<AxiosResponse<IApiResponse<RoomResponse>>> => {
  return axiosClient.post("/rooms", data);
};

/**
 * Cập nhật thông tin phòng
 */
export const updateRoomApi = (
  id: string,
  data: RoomUpdateRequest
): Promise<AxiosResponse<IApiResponse<RoomResponse>>> => {
  return axiosClient.put(`/rooms/${id}`, data);
};

/**
 * Xóa phòng
 */
export const deleteRoomApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/rooms/${id}`);
};

/**
 * Lấy thông tin phòng theo ID
 */
export const getRoomByIdApi = (
  id: string
): Promise<AxiosResponse<IApiResponse<RoomResponse>>> => {
  return axiosClient.get(`/rooms/${id}`);
};

/**
 * Lấy danh sách tất cả phòng với phân trang
 */
export const getAllRoomsApi = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<AxiosResponse<IApiResponse<IPageResponse<RoomResponse>>>> => {
  return axiosClient.get("/rooms", { params });
};

/**
 * Lấy danh sách phòng theo chi nhánh
 */
export const getRoomsByBranchApi = (
  hotelId: string,
  params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }
): Promise<AxiosResponse<IApiResponse<IPageResponse<RoomResponse>>>> => {
  return axiosClient.get(`/rooms/hotel/${hotelId}`, { params });
};

/**
 * Lấy danh sách phòng theo loại phòng
 */
export const getRoomsByRoomTypeApi = (
  roomTypeId: string,
  params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }
): Promise<AxiosResponse<IApiResponse<IPageResponse<RoomResponse>>>> => {
  return axiosClient.get(`/rooms/room-type/${roomTypeId}`, { params });
};

/**
 * Lấy danh sách phòng theo trạng thái
 */
export const getRoomsByStatusApi = (
  status: string,
  params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }
): Promise<AxiosResponse<IApiResponse<IPageResponse<RoomResponse>>>> => {
  return axiosClient.get(`/rooms/status/${status}`, { params });
};

/**
 * Tìm kiếm phòng với nhiều điều kiện
 */
export const searchRoomsApi = (
  params: RoomSearchParams
): Promise<AxiosResponse<IApiResponse<IPageResponse<RoomResponse>>>> => {
  return axiosClient.get("/rooms/search", { params });
};
