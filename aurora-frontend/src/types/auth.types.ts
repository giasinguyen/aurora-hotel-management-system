// ==================== AUTH REQUEST TYPES ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LogoutRequest {
  token: string;
}

export interface IntrospectRequest {
  token: string;
}

// ==================== AUTH RESPONSE TYPES ====================

export interface AuthenticationResponse {
  token: string;
  authenticated: boolean;
}

export interface IntrospectResponse {
  valid: boolean;
}

// ==================== USER & ROLE TYPES ====================

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: string; // LocalDate from backend
  roles: Role[];
}

// ==================== AUTH STATE ====================

export interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  isFetchingUser: boolean;
  error: string | null;
}

