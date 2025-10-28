import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/api.types";
import type {
  LoginRequest,
  AuthenticationResponse,
  LogoutRequest,
  IntrospectRequest,
  IntrospectResponse,
} from "@/types/auth.types";

// ==================== AUTH API ENDPOINTS ====================

const AUTH_ENDPOINTS = {
  LOGIN: "/api/v1/auth/token",
  LOGOUT: "/api/v1/auth/logout",
  INTROSPECT: "/api/v1/auth/introspect",
};

// ==================== AUTH SERVICE ====================

export const authService = {
  /**
   * Login with username and password
   */
  login: async (credentials: LoginRequest) => {
    const response = await axiosClient.post<ApiResponse<AuthenticationResponse>>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data;
  },

  /**
   * Logout and invalidate token
   */
  logout: async (request: LogoutRequest) => {
    const response = await axiosClient.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.LOGOUT,
      request
    );
    return response.data;
  },

  /**
   * Introspect token to check validity
   */
  introspect: async (request: IntrospectRequest) => {
    const response = await axiosClient.post<ApiResponse<IntrospectResponse>>(
      AUTH_ENDPOINTS.INTROSPECT,
      request
    );
    return response.data;
  },
};

