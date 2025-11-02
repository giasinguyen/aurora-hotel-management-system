// =============================
// MAIN INTERFACE - AUTHENTICATION
// =============================

/**
 * Response DTO for authentication with access token
 */
export interface AuthTokenResponse {
  accessToken: string;
  user: UserSessionResponse;
}

/**
 * User session information returned during authentication
 */
export interface UserSessionResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  roles: string[];
  permissions: string[];
  branchId: string;
  branchName: string;
  updatedAt: string;
}

/**
 * Detailed user information response
 */
export interface UserDetailsResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  address: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

// =============================
// REQUEST DTOs
// =============================

/**
 * Request DTO for user login with session metadata
 */
export interface LoginRequest {
  username: string;
  password: string;
  sessionMeta?: SessionMetaRequest | null;
}

/**
 * Request DTO for user registration
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  phone?: string;
  address?: string;
}

/**
 * Session metadata from client device
 */
export interface SessionMetaRequest {
  deviceName: string;
  deviceType: string;
  userAgent: string;
}

/**
 * Response DTO containing session metadata
 */
export interface SessionMetaResponse {
  sessionId: string;
  deviceName: string;
  deviceType: string;
  userAgent: string;
  loginAt: string;
  current: boolean;
}
