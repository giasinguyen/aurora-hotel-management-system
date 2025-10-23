import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../lib/axiosClient';
import type { User, LoginCredentials, AuthResponse, RegisterCredentials } from '../../../types/auth';

// Login thunk
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
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
      const response = await axiosClient.get('/auth/me');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Lấy thông tin người dùng thất bại';
      return rejectWithValue(message);
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, we still clear local state
      console.error('Logout error:', error);
    }
  }
);

// Register thunk (optional)
export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      return rejectWithValue(message);
    }
  }
);
