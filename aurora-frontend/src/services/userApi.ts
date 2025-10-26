import axiosClient from "@/lib/axiosClient";
import type { IApiResponse, IPageResponse } from "@/types/apiResponse";
import type {
  UserResponse,
  UserRegistrationRequest,
  UserCreationRequest,
  UserUpdateRequest,
  UserSearchParams,
  UserPaginationParams,
} from "@/types/user.types.d";
import type { AxiosResponse } from "axios";

// ==================== USER APIs ====================

/**
 * Đăng ký user mới (public)
 */
export const registerUserApi = (
  data: UserRegistrationRequest
): Promise<AxiosResponse<IApiResponse<UserResponse>>> => {
  return axiosClient.post("/users/register", data);
};

/**
 * Tạo user mới (admin)
 */
export const createUserApi = (
  data: UserCreationRequest
): Promise<AxiosResponse<IApiResponse<UserResponse>>> => {
  return axiosClient.post("/users", data);
};

/**
 * Lấy danh sách tất cả users
 */
export const getAllUsersApi = (): Promise<
  AxiosResponse<IApiResponse<UserResponse[]>>
> => {
  return axiosClient.get("/users");
};

/**
 * Lấy danh sách users với phân trang
 */
export const getUsersWithPaginationApi = (
  params: UserPaginationParams
): Promise<AxiosResponse<IApiResponse<IPageResponse<UserResponse>>>> => {
  return axiosClient.get("/users/paginated", { params });
};

/**
 * Lấy thông tin user theo ID
 */
export const getUserByIdApi = (
  userId: string
): Promise<AxiosResponse<IApiResponse<UserResponse>>> => {
  return axiosClient.get(`/users/${userId}`);
};

/**
 * Lấy thông tin user theo username
 */
export const getUserByUsernameApi = (
  username: string
): Promise<AxiosResponse<IApiResponse<UserResponse>>> => {
  return axiosClient.get(`/users/username/${username}`);
};

/**
 * Cập nhật thông tin user
 */
export const updateUserApi = (
  userId: string,
  data: UserUpdateRequest
): Promise<AxiosResponse<IApiResponse<UserResponse>>> => {
  return axiosClient.put(`/users/${userId}`, data);
};

/**
 * Xóa user
 */
export const deleteUserApi = (
  userId: string
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.delete(`/users/${userId}`);
};

/**
 * Tìm kiếm users theo username
 */
export const searchUsersApi = (
  params: UserSearchParams
): Promise<AxiosResponse<IApiResponse<IPageResponse<UserResponse>>>> => {
  return axiosClient.get("/users/search", { params });
};

/**
 * Lấy thông tin user hiện tại (decode từ token và gọi getUserByUsername)
 */
export const getMyInfoApi = async (): Promise<AxiosResponse<IApiResponse<UserResponse>>> => {
  // Decode JWT token để lấy username
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  
  // Decode JWT (simple base64 decode, không verify)
  const payload = JSON.parse(atob(token.split('.')[1]));
  const username = payload.sub; // 'sub' is usually username in JWT
  
  return getUserByUsernameApi(username);
};