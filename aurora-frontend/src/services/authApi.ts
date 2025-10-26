import axiosClient from "@/lib/axiosClient";
import type { IApiResponse } from "@/types/apiResponse";
import type {
  LoginRequest,
  AuthenticationResponse,
  IntrospectRequest,
  IntrospectResponse,
  LogoutRequest,
} from "@/types/auth.types.d";
import type { AxiosResponse } from "axios";

// ==================== AUTH APIs ====================

/**
 * Đăng nhập với username và password
 */
export const loginApi = (
  data: LoginRequest
): Promise<AxiosResponse<IApiResponse<AuthenticationResponse>>> => {
  return axiosClient.post("/api/v1/auth/token", data);
};

/**
 * Kiểm tra token có hợp lệ không
 */
export const introspectApi = (
  data: IntrospectRequest
): Promise<AxiosResponse<IApiResponse<IntrospectResponse>>> => {
  return axiosClient.post("/api/v1/auth/introspect", data);
};

/**
 * Refresh access token
 */
export const refreshTokenApi = (): Promise<
  AxiosResponse<IApiResponse<AuthenticationResponse>>
> => {
  const token = localStorage.getItem("access_token");
  return axiosClient.post("/api/v1/auth/refresh", { token });
};

/**
 * Đăng xuất
 */
export const logoutApi = (
  data: LogoutRequest
): Promise<AxiosResponse<IApiResponse<void>>> => {
  return axiosClient.post("/api/v1/auth/logout", data);
};
