import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, logoutApi } from '../../../services/authApi';
import { getMyInfoApi, registerUserApi } from '../../../services/userApi';
import type { User, AuthResponse } from '../../../types/auth';
import type { UserResponse, UserRegistrationRequest } from '../../../types/user.types';

// Helper function to convert UserResponse to User
const convertUserResponseToUser = (userResponse: UserResponse): User => {
  return {
    id: userResponse.id,
    email: userResponse.email,
    name: userResponse.fullName,
    role: userResponse.roles?.[0]?.name,
    avatar: userResponse.avatar,
    phone: userResponse.phone,
    address: userResponse.address,
    createdAt: userResponse.createdAt,
    updatedAt: userResponse.updatedAt,
  };
};

// Login thunk
export const loginUser = createAsyncThunk<
  AuthResponse,
  { username: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      const authData = response.data.result;
      
      if (!authData || !authData.token) {
        return rejectWithValue('Không nhận được dữ liệu xác thực');
      }
      
      // Store token
      localStorage.setItem('access_token', authData.token);
      
      // Fetch user info using JWT token
      const userResponse = await getMyInfoApi();
      const userResult = userResponse.data.result;
      
      if (!userResult) {
        return rejectWithValue('Không lấy được thông tin người dùng');
      }
      
      return {
        user: convertUserResponseToUser(userResult),
        token: authData.token,
        refreshToken: authData.token // Backend chỉ trả về 1 token duy nhất
      };
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Đăng nhập thất bại';
      return rejectWithValue(message);
    }
  }
);

// Get current user thunk
export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyInfoApi();
      const userResult = response.data.result;
      
      if (!userResult) {
        return rejectWithValue('Không lấy được thông tin người dùng');
      }
      
      return convertUserResponseToUser(userResult);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Lấy thông tin người dùng thất bại';
      return rejectWithValue(message);
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await logoutApi({ token });
      }
    } catch (error) {
      // Even if logout fails on server, we still clear local state
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
    }
  }
);

// Alias for compatibility
export const logoutUser = logout;

// Register thunk
export const registerUser = createAsyncThunk<
  { success: boolean; message: string },
  UserRegistrationRequest,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      await registerUserApi(userData);
      return {
        success: true,
        message: 'Đăng ký thành công! Vui lòng đăng nhập.'
      };
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Đăng ký thất bại';
      return rejectWithValue(message);
    }
  }
);
