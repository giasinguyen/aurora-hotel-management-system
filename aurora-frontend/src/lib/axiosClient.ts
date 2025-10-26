import type { IApiResponse } from "@/types/apiResponse";
import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import { updateTokenManually } from "@/features/slices/auth/authSlice";
import type { AppDispatch } from "@/features/store";
import { logout } from "@/features/slices/auth/authThunk";
import { refreshTokenApi } from "@/services/authApi";

// Setup dispatch từ store để sử dụng trong interceptors
let dispatchRef: AppDispatch;

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
  dispatchRef = dispatch;
};

// Cấu hình mặc định cho các request
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Tự động gắn Access Token vào mỗi request
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cơ chế hàng đợi xử lý request bị lỗi 401 trong khi refresh token:
// - failedQueue lưu các request bị 401
// - Khi refresh thành công → resolve queue
// - Khi refresh fail → reject toàn bộ queue
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

// Interceptor: Xử lý lỗi 401 và refresh token
let isRefreshing = false;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<IApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check lỗi có phải do JWT Token không?
    const { response } = error;
    const isUnauthorized = response?.status === 401;

    if (isUnauthorized && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu đang refresh token, đưa request vào queue
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Gọi API refresh token
        const res = await refreshTokenApi();
        const accessToken = res.data.result?.accessToken;

        if (!accessToken) {
          throw new Error("No access token received");
        }

        // Lưu token mới vào localStorage
        localStorage.setItem("access_token", accessToken);

        // Cập nhật Redux store
        if (dispatchRef && res.data.result) {
          dispatchRef(updateTokenManually(res.data.result));
        }

        // Xử lý các request trong queue
        processQueue(null, accessToken);

        // Retry request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại → Đăng xuất
        processQueue(refreshError, null);
        if (dispatchRef) {
          dispatchRef(logout());
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;