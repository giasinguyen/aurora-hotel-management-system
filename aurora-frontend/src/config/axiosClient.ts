import type { ApiResponse } from "@/types/apiResponse.d.ts";
import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import { updateTokenManually } from "@/features/slices/auth/authSlice";
import type { AppDispatch } from "@/features/store";
import { logout } from "@/features/slices/auth/authThunk";
import { refreshTokenApi } from "@/services/authApi";

// Setup dispatch from store to use
// in this file
let dispatchRef: AppDispatch;

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
  dispatchRef = dispatch;
};

// Default configuration for requests
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true,
});

// Interceptor: Automatically attach Access Token to each request
// FOR CASE WHERE ACCESS TOKEN IS STORED IN LOCAL STORAGE
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Queue mechanism to handle 401 requests while refreshing token:
// - failedQueue stores 401 requests
// - When refresh succeeds → resolve queue
// - When refresh fails → reject entire queue
type FailedRequest = {
  resolve: () => void;
  reject: (reason?: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve();
    else reject(error);
  });
  failedQueue = [];
};

// Interceptor: Handle 401 errors and UNAUTHORIZED errorCode
let isRefreshing = false;

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if error is a JWT Token error
    const { response } = error;
    const errorCode = (response?.data as ApiResponse<null>)?.code;
    const isUnauthorized = response?.status === 401 || errorCode === 401;

    if (isUnauthorized && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest)) // trigger when resolve()
          .catch((err) => Promise.reject(err)); // trigger when reject()
      }

      isRefreshing = true;

      try {
        const res = (await refreshTokenApi()).data;
        const authTokenResponse = res.result;

        const accessToken = authTokenResponse.accessToken;
        dispatchRef(updateTokenManually(authTokenResponse));
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // Clear token and logout if refresh fails
        dispatchRef(logout());
        processQueue(refreshError, null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
