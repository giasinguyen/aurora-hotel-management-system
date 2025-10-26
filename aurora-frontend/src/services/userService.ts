import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/api.types";
import type { User } from "@/types/auth.types";

// ==================== USER API ENDPOINTS ====================

const USER_ENDPOINTS = {
  MY_INFO: "/users/myInfo",
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_BY_USERNAME: (username: string) => `/users/username/${username}`,
};

// ==================== USER SERVICE ====================

export const userService = {
  /**
   * Get current user info (requires authentication)
   */
  getCurrentUser: async () => {
    const response = await axiosClient.get<ApiResponse<User>>(USER_ENDPOINTS.MY_INFO);
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<User>>(USER_ENDPOINTS.USER_BY_ID(id));
    return response.data;
  },

  /**
   * Get user by username
   */
  getUserByUsername: async (username: string) => {
    const response = await axiosClient.get<ApiResponse<User>>(
      USER_ENDPOINTS.USER_BY_USERNAME(username)
    );
    return response.data;
  },
};

