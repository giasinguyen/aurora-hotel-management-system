import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import type { AuthState, LoginRequest, User } from "@/types/auth.types";
import type { RootState } from "@/features/store";

// ==================== INITIAL STATE ====================

const initialState: AuthState = {
  accessToken: localStorage.getItem("access_token") || null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  currentUser: null,
  isLoading: false,
  isFetchingUser: false,
  error: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Login async thunk
 */
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      if (!response.result) {
        return rejectWithValue("Không nhận được token từ server");
      }

      return response.result;
    } catch (error: unknown) {
      const errorMessage =
        (error && typeof error === "object" && "response" in error && 
         error.response && typeof error.response === "object" && "data" in error.response &&
         error.response.data && typeof error.response.data === "object" && "message" in error.response.data
         ? String(error.response.data.message)
         : error && typeof error === "object" && "message" in error
         ? String(error.message)
         : "Đăng nhập thất bại. Vui lòng thử lại!");
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Logout async thunk
 */
export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.accessToken || localStorage.getItem("access_token");

      if (token) {
        await authService.logout({ token });
      }
      
      return;
    } catch (error: unknown) {
      // Even if logout API fails, we still clear local state
      const errorMessage = error && typeof error === "object" && "message" in error 
        ? String(error.message) 
        : "Đăng xuất thất bại";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch current user info async thunk
 */
export const fetchCurrentUserAsync = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getCurrentUser();
      
      if (!response.result) {
        return rejectWithValue("Không nhận được thông tin người dùng");
      }

      return response.result;
    } catch (error: unknown) {
      const errorMessage =
        (error && typeof error === "object" && "response" in error && 
         error.response && typeof error.response === "object" && "data" in error.response &&
         error.response.data && typeof error.response.data === "object" && "message" in error.response.data
         ? String(error.response.data.message)
         : error && typeof error === "object" && "message" in error
         ? String(error.message)
         : "Không thể lấy thông tin người dùng");
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== AUTH SLICE ====================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Set user information
     */
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },


    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Manual logout (clear state without API call)
     */
    clearAuth: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.currentUser = null;
      state.error = null;
      state.isLoading = false;
      state.isFetchingUser = false;

      localStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    // ==================== LOGIN ====================
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.token;
        state.isAuthenticated = action.payload.authenticated;
        state.error = null;

        // Save to localStorage
        localStorage.setItem("access_token", action.payload.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // ==================== LOGOUT ====================
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.currentUser = null;
        state.error = null;

        localStorage.removeItem("access_token");
      })
      .addCase(logoutAsync.rejected, (state) => {
        // Still clear state even if API call failed
        state.isLoading = false;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.currentUser = null;
        state.error = null;

        localStorage.removeItem("access_token");
      });

    // ==================== FETCH CURRENT USER ====================
    builder
      .addCase(fetchCurrentUserAsync.pending, (state) => {
        state.isFetchingUser = true;
      })
      .addCase(fetchCurrentUserAsync.fulfilled, (state, action) => {
        state.isFetchingUser = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUserAsync.rejected, (state, action) => {
        state.isFetchingUser = false;
        state.error = action.payload as string;
        // If fetching user fails, might be token expired, keep auth state for now
      });
  },
});

// ==================== EXPORTS ====================

export const { setCurrentUser, clearError, clearAuth } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectFetchingUser = (state: RootState) => state.auth.isFetchingUser;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

