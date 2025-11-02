import type { UserSessionResponse } from "@/types/user.d.ts";
import { createSlice } from "@reduxjs/toolkit";
import { getAccount, login, logout, refreshToken } from "./authThunk";

// ===========================================
// Slice
// ===========================================
type AuthState = {
  user: UserSessionResponse;
  isLogin: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialValue: AuthState = {
  user: {
    id: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    avatarUrl: "",
    roles: [],
    permissions: [],
    branchId: "",
    branchName: "",
    updatedAt: "",
  },
  isLogin: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialValue,
  reducers: {
    updateTokenManually(state, action) {
      state.user = action.payload.user;
      localStorage.setItem("access_token", action.payload.accessToken);
      state.isLogin = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem("access_token", action.payload.accessToken);

        state.isLogin = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = {
          id: "",
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          avatarUrl: "",
          roles: [],
          permissions: [],
          branchId: "",
          branchName: "",
          updatedAt: "",
        };
        state.isLogin = false;
        state.isLoading = false;
        localStorage.removeItem("access_token");
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        
        // Always clear auth state on logout, even if API fails
        state.user = {
          id: "",
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          avatarUrl: "",
          roles: [],
          permissions: [],
          branchId: "",
          branchName: "",
          updatedAt: "",
        };
        state.isLogin = false;
        localStorage.removeItem("access_token");
      })

      // GET ACCOUNT
      .addCase(getAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAccount.fulfilled, (state, action) => {
        state.user = action.payload;

        state.isLogin = true;
        state.isLoading = false;
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        
        // Clear authentication state when getAccount fails (token expired/invalid)
        state.user = {
          id: "",
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          avatarUrl: "",
          roles: [],
          permissions: [],
          branchId: "",
          branchName: "",
          updatedAt: "",
        };
        state.isLogin = false;
        localStorage.removeItem("access_token");
      })

      // REFRESH TOKEN
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem("access_token", action.payload.accessToken);

        state.isLogin = true;
        state.isLoading = false;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;

        localStorage.removeItem("access_token");
        state.isLogin = false;
      });
  },
});

// ===========================================
// EXPORT REDUCER
// ===========================================
export const { updateTokenManually } = authSlice.actions;
export default authSlice.reducer;

