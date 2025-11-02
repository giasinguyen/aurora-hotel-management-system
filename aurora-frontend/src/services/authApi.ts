import instance from "@/config/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.d.ts";
import type {
  LoginRequest,
  RegisterRequest,
  AuthTokenResponse,
  UserSessionResponse,
  UserDetailsResponse,
  SessionMetaRequest,
  SessionMetaResponse,
} from "@/types/user.d.ts";
import { getSessionMeta } from "@/utils/sessionHelper";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Register a new user account (no authentication required)
 */
export const registerApi = (data: RegisterRequest) => {
  return axios.post<ApiResponse<UserSessionResponse>>(
    `${API_BASE_URL}/api/v1/auth/register`,
    data,
    {
      withCredentials: true,
    }
  );
};

/**
 * Login with credentials and session metadata.
 * Returns access token in response body and sets refresh token as HttpOnly cookie.
 */
export const loginApi = (data: LoginRequest) => {
  data = {
    ...data,
    sessionMeta: getSessionMeta(),
  };

  return instance.post<ApiResponse<AuthTokenResponse>>(
    "/api/v1/auth/login",
    data
  );
};

/**
 * Logout and clear refresh token cookie. Invalidates the current session.
 */
export const logoutApi = () => {
  return axios.post<ApiResponse<void>>(
    `${API_BASE_URL}/api/v1/auth/logout`,
    {},
    {
      withCredentials: true,
    }
  );
};

/**
 * Get current authenticated user session information
 */
export const getUserSession = () => {
  return instance.get<ApiResponse<UserSessionResponse>>("/api/v1/auth/me");
};

/**
 * Get current authenticated user detailed information
 */
export const getUserDetails = () => {
  return instance.get<ApiResponse<UserDetailsResponse>>(
    "/api/v1/auth/me/details"
  );
};

/**
 * Refresh access token using refresh token from cookie.
 * Requires refresh_token cookie to be sent automatically.
 */
export const refreshTokenApi = () => {
  const data: SessionMetaRequest = getSessionMeta();

  return axios.post<ApiResponse<AuthTokenResponse>>(
    `${API_BASE_URL}/api/v1/auth/refresh-token`,
    data,
    {
      withCredentials: true,
    }
  );
};

/**
 * Get all active sessions for the current user.
 * Requires refresh_token cookie.
 */
export const getSessions = () => {
  return instance.get<ApiResponse<SessionMetaResponse[]>>(
    "/api/v1/auth/sessions"
  );
};

/**
 * Remove a specific session by session ID.
 * User can only remove their own sessions.
 */
export const removeSessionId = (sessionId: string) => {
  return instance.delete<ApiResponse<void>>(
    `/api/v1/auth/sessions/${sessionId}`
  );
};

