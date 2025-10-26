import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import type { AppDispatch } from "@/features/store";
import type { ApiResponse } from "@/types/api.types";
import { ErrorCodeNames } from "@/types/errorCodes";
import { clearAuth } from "@/features/slices/auth/authSlice";

// Setup dispatch từ store để sử dụng
// trong đây
let dispatchRef: AppDispatch;

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
  dispatchRef = dispatch;
};

// Cấu hình mặc định cho các request
const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Interceptor: Tự động gắn Access Token vào mỗi request
// CHO TRƯỜNG HỢP ACCESS TOKEN ĐƯỢC LƯU Ở LOCAL STORAGE
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor: Xử lý lỗi 401 - Auto logout

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Check lỗi có phải thuộc lại lỗi JWT Token
    const { response } = error;
    const errorCode = (response?.data as ApiResponse<null>)?.errorCode;
    const isUnauthorized =
      response?.status === 401 &&
      (errorCode === ErrorCodeNames.UNAUTHORIZED || 
       errorCode === ErrorCodeNames.UNAUTHENTICATED);

    if (isUnauthorized) {
      // Token hết hạn -> Logout trực tiếp
      dispatchRef(clearAuth());

      // Redirect to login page (avoid redirect loop if already on login page)
      const currentPath = window.location.pathname;
      
      if (!currentPath.startsWith("/login") && !currentPath.startsWith("/register")) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      }
    }

    return Promise.reject(error);
  },
);


export default axiosClient;
