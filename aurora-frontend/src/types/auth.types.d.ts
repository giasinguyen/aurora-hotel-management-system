// ==================== AUTH TYPES ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
  authenticated: boolean;
}

export interface IntrospectRequest {
  token: string;
}

export interface IntrospectResponse {
  valid: boolean;
  subject?: string;
  expiresAt?: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface LogoutRequest {
  token: string;
}

// ==================== AUTH STATE (Redux) ====================

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
