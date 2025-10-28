// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result?: T;
  errorCode?: string;
}

export interface ApiError {
  code: number;
  message: string;
  errorCode?: string;
}

